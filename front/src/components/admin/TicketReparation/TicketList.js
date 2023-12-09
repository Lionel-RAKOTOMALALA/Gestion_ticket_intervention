import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loader from "../materiels/loader";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { CheckCircle, Visibility } from "@mui/icons-material";
import { UilTrash } from "@iconscout/react-unicons";
import moment from "moment";

const TicketReparationList = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [interventionFaite, setInterventionFaite] = useState("");
  const [suiteDonnees, setSuiteDonnees] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const destroyDataTable = () => {
    setTickets([]);
  };

  const refreshData = () => {
    destroyDataTable();
    const authToken = localStorage.getItem('auth_token');

    axios
      .get("http://127.0.0.1:8000/api/tickets",{
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setTickets(response.data.tickets);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleFait = (id) => {
    Swal.fire({
      title: "Confirmer la validation de la réparation",
      text: "Êtes-vous sûr de vouloir valider la clôture de la réparation ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://127.0.0.1:8000/api/tickets/reparationFait/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire("Success", res.data.message, "success");
              refreshData();
              setOpen(true);
              setSelectedTicket(id);
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValidation = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/tickets/reparation_com/${selectedTicket}`,
        {
          interventionFaite,
          suiteDonnees,
        }
      )
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire("Success", res.data.message, "success");
          refreshData();
        } else if (res.data.status === 404) {
          Swal.fire("Erreur", res.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setInterventionFaite("");
        setSuiteDonnees("");
        setOpen(false);
      });
  };

  const deleteTicket = (id) => {
    Swal.fire({
      title: "Confirmer la suppression",
      text:
        "Êtes-vous sûr de vouloir supprimer ce ticket d'intervention ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true);
        axios
          .delete(`http://127.0.0.1:8000/api/tickets/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire("Success", res.data.message, "success");
              refreshData();
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }
    });
  };

  const renderActions = (params) => (
    <div>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<UilTrash />}
        onClick={() => deleteTicket(params.row.id_ticket)}
        disabled={isDeleting}
        style={{ marginRight: "8px" }}
      >
        {isDeleting ? "Suppression..." : "Supprimer"}
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<Visibility />}
        onClick={() => handleView(params.row.id_ticket)}
        style={{ marginRight: "8px" }} 
      >
        Voir
      </Button>
      {params.row.statut_actuel !== "Fait" && (
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<CheckCircle />}
          onClick={() => handleFait(params.row.id_ticket)}
        >
          Réparation faite
        </Button>
      )}
    </div>
  );
  

  const columns = [
    { field: "id_ticket", headerName: "ID Ticket", width: 100 },
    { field: "date_creation", headerName: "Date de Création", width: 150 },
    { field: "statut_actuel", headerName: "Statut Actuel", width: 150 },
    { field: "type_materiel", headerName: "Type de Matériel", width: 150 },
    {
      field: "image_materiel_url",
      headerName: "Image du matériel",
      width: 120,
      renderCell: (params) => (
        <Avatar
          src={`http://localhost:8000/uploads/materiels/${params.row.image_materiel_url}`}
          alt="materiel Photo"
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    { field: "nom_technicien", headerName: "Nom du Technicien", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 450,
      renderCell: renderActions,
    },
  ];

  const handleView = (id) => {
    const selectedTicket = tickets.find(
      (ticket) => ticket.id_ticket === id
    );
    setSelectedTicket(selectedTicket);
    setOpen(true);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              ref={tableRef}
              rows={tickets}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
            />
          </div>
        </div>
      )}
      {selectedTicket && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle
            style={{
              backgroundColor: "rgba(33, 150, 243, 0.9)",
              color: "#fff",
            }}
          >
            Détails du ticket de réparation
          </DialogTitle>
          <DialogContent>
            <Card
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
                marginTop: "2%",
                border: "none",
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>{`ID du ticket: ${selectedTicket.id_ticket}`}</Typography>
                    <Typography>{`Date de création: ${moment(
                      selectedTicket.date_creation
                    ).format("DD/MM/YYYY HH:mm:ss")}`}</Typography>
                    <Typography>{`Statut actuel: ${selectedTicket.statut_actuel}`}</Typography>
                    {/* Add other details... */}
                  </Grid>
                  {/* Add more Grid items for other details... */}
                </Grid>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ color: "#2196f3" }}
              onClick={handleClose}
              disabled={isDeleting}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default TicketReparationList;
