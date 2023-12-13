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
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import Swal from "sweetalert2";
import { CheckCircle, Visibility } from "@mui/icons-material";
import { UilTrash } from "@iconscout/react-unicons";
import moment from "moment";

const TicketReparationList = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const tableRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openInterventionModal, setOpenInterventionModal] = useState(false); // Ajout de l'état pour la modal d'ajout d'intervention
  const [interventionFaite, setInterventionFaite] = useState("");
  const [suiteDonnees, setSuiteDonnees] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const destroyDataTable = () => {
    setTickets([]);
  };

  const refreshData = () => {
    destroyDataTable();
    const authToken = localStorage.getItem("auth_token");

    axios
      .get("http://127.0.0.1:8000/api/tickets", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
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
              setOpenInterventionModal(true); // Ouvre la nouvelle modal d'ajout d'intervention
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
    setOpenInterventionModal(false); // Ferme la modal d'ajout d'intervention
  };

  const handleValidation = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/tickets/reparation_com/${selectedTicket}`,
        {
          intervention_faite: interventionFaite,
          suite_a_donnee: suiteDonnees,
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
        setOpenInterventionModal(false);
      });
  };

  const deleteTicket = (id) => {
    Swal.fire({
      title: "Confirmer la suppression",
      text: "Êtes-vous sûr de vouloir supprimer ce ticket d'intervention ?",
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

  const renderActions = (row) => (
    <div>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<UilTrash />}
        onClick={() => deleteTicket(row.id_ticket)}
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
        onClick={() => handleView(row.id_ticket)}
        style={{ marginRight: "8px" }}
      >
        Voir
      </Button>
      {row.statut_actuel !== "Fait" && (
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<CheckCircle />}
          onClick={() => handleFait(row.id_ticket)}
        >
          Réparation faite
        </Button>
      )}
    </div>
  );

  const handleView = (id) => {
    const selectedTicket = tickets.find((ticket) => ticket.id_ticket === id);
    setSelectedTicket(selectedTicket);
    setOpen(true);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Ticket</TableCell>
                  <TableCell>Date de Création</TableCell>
                  <TableCell>Statut Actuel</TableCell>
                  <TableCell>Type de Matériel</TableCell>
                  <TableCell>Image du matériel</TableCell>
                  <TableCell>Nom du Technicien</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? tickets.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : tickets
                ).map((row) => (
                  <TableRow key={row.id_ticket}>
                    <TableCell>{row.id_ticket}</TableCell>
                    <TableCell>
                      {moment(row.date_creation).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell>{row.statut_actuel}</TableCell>
                    <TableCell>{row.type_materiel}</TableCell>
                    <TableCell>
                      <Avatar
                        src={`http://localhost:8000/uploads/materiels/${row.image_materiel_url}`}
                        alt="materiel Photo"
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>{row.nom_technicien}</TableCell>
                    <TableCell>{renderActions(row)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={tickets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>

          {selectedTicket && (
            <>
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

              {/* Nouvelle modal d'ajout d'intervention */}
              <Dialog open={openInterventionModal} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Ajouter Intervention</DialogTitle>
                <DialogContent>
                  {/* Ajoutez les champs et les composants nécessaires pour l'ajout d'intervention */}
                  <TextField
                    label="Intervention Faite"
                    value={interventionFaite}
                    onChange={(e) => setInterventionFaite(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Suite Données"
                    value={suiteDonnees}
                    onChange={(e) => setSuiteDonnees(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenInterventionModal(false)}>Annuler</Button>
                  <Button onClick={handleValidation}>Valider</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketReparationList;
