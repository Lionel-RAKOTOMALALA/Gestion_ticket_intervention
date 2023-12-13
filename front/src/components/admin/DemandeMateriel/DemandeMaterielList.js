  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import {
    Box,
    Typography,
    Button,
    IconButton,
    Grid,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Modal,
    Fade,
    Backdrop,
    DialogContentText,
    List,
    ListItem,
    ListItemText,
  } from "@mui/material";
  import { DataGrid, gridClasses } from "@mui/x-data-grid";
  import Swal from "sweetalert2";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import CancelIcon from "@mui/icons-material/Cancel";
  import { Edit, Delete, Visibility } from "@mui/icons-material";
  import { UilEye, UilEditAlt, UilTrash } from "@iconscout/react-unicons";
  import { Link, useNavigate } from "react-router-dom";
  import moment from 'moment';
  import EditDemandeMateriel from "./EditDemandeMateriel";


  const DemandeMaterielList = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [selectedDemande, setSelectedDemande] = useState(null);

    const [demandeMateriels, setDemandeMateriels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [technicienAdmin, setTechnicienAdmin] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem("auth_token"));
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");
    const isAdmin = userRole === "admin";
    const isUserSimple = userRole === "userSimple";
    const [buttonText, setButtonText] = useState('Valider');
    const [rejectButtonText, setRejectButtonText] = useState('Rejeter');
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const [poste,setPoste] = useState(null);


    useEffect(() => {
      const fetchTechnicienAdmin = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/getTechnicienAdmin`
          );
          setTechnicienAdmin(response.data.admin);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du technicien admin:",
            error
          );
        }
      };

      fetchTechnicienAdmin();
    }, []);

    useEffect(() => {
      refreshData();
    }, [authToken]);

    const refreshData = () => {
      let apiUrl = "http://127.0.0.1:8000/api/demande_materiel";

      axios
        .get(
          "http://127.0.0.1:8000/api/countDemandeurForAuthenticatedUser",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          const demandeurVerifCount = response.data.demandeur_count;
          setPoste(response.data.poste);

          if (
            localStorage.getItem("role") === "userSimple" &&
            demandeurVerifCount > 0
          ) {
            apiUrl = "http://127.0.0.1:8000/api/demandes-utilisateur";
          }

          axios
            .get(apiUrl, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            })
            .then((response) => {
              setDemandeMateriels(response.data.demandes);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    };

    function getUrgencePriorite(etatMateriel, demandeur) {
      let urgence, priorite;
      switch (etatMateriel) {
        case "En panne":
          urgence = "Haute";
          priorite = "Haute";
          break;
        case "Endommagé":
          urgence = "Moyenne";
          priorite = "Moyenne";
          break;
        case "Dysfonctionnement":
          urgence = "Faible";
          priorite = "Faible";
          break;
        case "Obsolète":
          urgence = "Faible";
          priorite = "Faible";
          break;
        case "Maintenance nécessaire":
          urgence = "Moyenne";
          priorite = "Moyenne";
          break;
        case "Autre":
          urgence = "Faible";
          priorite = "Faible";
          break;
        default:
          urgence = "Faible";
          priorite = "Faible";
      }
      if (demandeur === "Copefrito" && urgence === "Faible") {
        priorite = "Haute";
      }
      return { urgence, priorite };
    }

    const handleValidate = async (e, demande) => {
    
        Swal.fire({
          title: "Confirmer la validation",
          text: "Êtes-vous sûr de vouloir valider cette demande ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Oui",
          cancelButtonText: "Non",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const validateUrl = `http://127.0.0.1:8000/api/demande_materiel/validate/${demande}`;

              const { urgence, priorite } = getUrgencePriorite(
                demande.etat_materiel,
                demande.demandeur_entreprise
              );

              const data = {
                urgence,
                priorite,
                statut_actuel: "En cours de reparation",
                id_technicien: technicienAdmin,
                id_demande: demande,
              };

              const authToken = localStorage.getItem('auth_token');

              try {
                const res = await axios.put(validateUrl, data, {
                  headers: {
                    'Authorization': `Bearer ${authToken}`
                  }
                });

                if (res.data.status === 200) {
                  Swal.fire("Success", res.data.message, "success");
                  refreshData();
                } else if (res.data.status === 404) {
                  Swal.fire("Erreur", res.data.message, "error");
                  navigate("/admin/demande_materiels");
                }
              } catch (error) {
                console.error(error);
              }

            } catch (error) {
              console.error("Error during validation:", error);
            }
          }
        });
      
    };

    const handleReject = async (e, id) => {
        Swal.fire({
          title: "Confirmer le rejet",
          text: "Êtes-vous sûr de vouloir rejeter cette demande ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Oui",
          cancelButtonText: "Non",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await axios.put(
                `http://127.0.0.1:8000/api/demande_materiel/reject/${id}`,
                { status: "rejeté" },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );
            
              if (res.data.status === 200) {
                Swal.fire("Success", res.data.message, "success");
                refreshData();
              } else if (res.data.status === 404) {
                Swal.fire("Erreur", res.data.message, "error");
                navigate("/admin/demande_materiels");
              }
            } catch (error) {
              console.error(error);
            }
          }
        });
    };

    const handleEdit = (id_demande) => {
      const selectedDemand = demandeMateriels.find((demande) => demande.id_demande === id_demande);
      setSelectedDemande(selectedDemand)
      setEditModalData(selectedDemande);
      setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
      try {
        const result = await Swal.fire({
          title: "Confirmer la suppression",
          text: "Êtes-vous sûr de vouloir supprimer cette demande ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Oui",
          cancelButtonText: "Non",
        });
    
        if (result.isConfirmed) {
          const res = await axios.delete(
            `http://127.0.0.1:8000/api/demande_materiel/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            }
          );
    
          if (res.data && res.data.status === 200) {
            Swal.fire("Success", res.data.message, "success");
            refreshData();
          } else if (res.data && res.data.status === 404) {
            Swal.fire("Erreur", res.data.message, "error");
            navigate("/admin/demande_materiels");
          } else {
            Swal.fire("Erreur", "Une erreur inattendue s'est produite", "error");
          }
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Une erreur s'est produite", "error");
      }
    };
    

    const statusIcon = (status) => {
      if (status === "Validé") {
        return <CheckCircleIcon style={{ color: "green" }} />;
      } else if (status === "rejeté") {
        return <CancelIcon style={{ color: "red" }} />;
      } else {
        return null;
      }
    };
    const renderActions = (params) => {
      const userRole = localStorage.getItem("role");
      const isAdmin = userRole === "admin";
      const isUserSimple = userRole === "userSimple";
    
      return (
        <Grid container spacing={2} justifyContent="flex-start">
          {isUserSimple && (
            <>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(params.row.id_demande)}
                >
                  Edit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(params.row.id_demande)}
                >
                  {isDeleting ? "Suppression..." : ""}
                </Button>
              </Grid>
            </>
          )}
          {isAdmin && (
            <>
              {!params.row.status && (
                <>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={(e) => handleValidate(e, params.row.id_demande)}
                    >
                      {buttonText}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => handleReject(e, params.row.id_demande)}
                    >
                      {rejectButtonText}
                    </Button>
                  </Grid>
                </>
              )}
              {params.row.status === "En attente de validation" && (
                <>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={(e) => handleValidate(e, params.row.id_demande)}
                    >
                      {buttonText}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => handleReject(e, params.row.id_demande)}
                    >
                      {rejectButtonText}
                    </Button>
                  </Grid>
                </>
              )}
            </>
          )}
          <Grid item>
            <IconButton
              onClick={() => handleView(params.row.id_demande)}
              color="primary"
              aria-label="View"
            >
              <Visibility />
            </IconButton>
          </Grid>
        </Grid>
      );
    };
    




    useEffect(() => {
      const intervalId = setInterval(() => {
        refreshData();
      }, 1000); 

    
      return () => clearInterval(intervalId);
    }, [authToken]);




    const columns = [
      { field: "id_demande", headerName: "Numéro de la demande", width: 90 },
      { field: "etat_materiel", headerName: "État du matériel", width: isAdmin ? 150 : 170 },
      { field: "type_materiel", headerName: "Type du matériel", width: isAdmin ? 70 : 100 },
      ...(isAdmin
        ? [
            { field: "demandeur_username", headerName: "Nom du demandeur", width: 100 },
            { field: "demandeur_entreprise", headerName: "Entreprise", width: 150 },
          ]
        : []
      ),
      {
        field: "status",
        headerName: "Statut de la demande",
        width: isAdmin ? 150 : 200,
        renderCell: (params) => (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              color:
                params.row.status === "Validé"
                  ? "#4CAF50" // Vert
                  : params.row.status === "Rejeté"
                  ? "#FF5252" // Rouge
                  : params.row.status === "En attente de validation"
                  ? "#FFC107" // Jaune un peu plus foncé
                  : "", // Ajustez cette partie selon vos besoins
            }}
          >
            {statusIcon(params.row.status)} {params.row.status}
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: isAdmin ? 550 : 350,
        renderCell: renderActions,
      },
    ];
    
    
    
    
    
    
    


  const handleView = (id) => {
    const selectedDemande = demandeMateriels.find((demande) => demande.id_demande === id);
    setModalData(selectedDemande);
    setModalOpen(true);
  };

    const handleCloseModal = () => {
      setModalOpen(false);
      setIsEditModalOpen(false);
    };
    const handleCloseEditModal = () => {
      setEditModalData({});
      setIsEditModalOpen(false);
    };

      const calculateSkeletonSize = (content) => {
        const defaultSize = 30; 
        const contentLength = content ? content.toString().length : 0;

        return defaultSize + contentLength * 5;
      };
    

    
      return (
        <Box sx={{ height: 400, width: "100%" }}>
          <Typography variant="h6" component="h6" sx={{ textAlign: "center", mt: 3, mb: 3 }}>
            Liste des demandes de réparation de matériel
          </Typography>
          {isLoading ? (
            <DataGrid
              columns={columns.map((col) => ({
                ...col,
                renderCell: (params) => (
                  <Skeleton
                    variant="rectangular"
                    height={calculateSkeletonSize(params.value)}
                    width="80%"
                  />
                ),
              }))}
              rows={[...Array(5).keys()].map((rowId) => ({ id: rowId }))}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              disableDensitySelector
              disableSelectionOnClick
              disableMultipleSelection
              hideFooter
            />
          ) : (
            <DataGrid
              columns={columns}
              rows={demandeMateriels}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              onCellEditCommit={(params) => console.log(params)}
              getRowId={(row) => row.id_demande}
              sx={{
                [`& .${gridClasses.row}`]: {
                  bgcolor: (theme) => (theme.palette.mode === "light" ? "#eee" : "#333"),
                },
              }}
            />
          )}



 <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isEditModalOpen}>
          <div>
            {selectedDemande && (
              <EditDemandeMateriel open={isEditModalOpen} onClose={handleCloseEditModal} id={selectedDemande} />
            )}
          </div>
        </Fade>
      </Modal>


  <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: 'rgba(33, 150, 243, 0.9)', color: '#fff' }}>Détails de la demande</DialogTitle>
        <DialogContent>
          <Card style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', marginTop : '2%', border: 'none' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">{`Numéro de la demande: ${modalData.id_demande}`}</Typography>
                  <Typography variant="body1">{`État du matériel: ${modalData.etat_materiel}`}</Typography>
                  <Typography variant="body1">{`Type du matériel: ${modalData.type_materiel}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{`Description du problème: ${modalData.description_probleme}`}</Typography>
                  <Typography variant="body1">{`Date et heure de la demande: ${moment(modalData.created_at).format('YYYY-MM-DD [à] HH:mm:ss')}`}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button style={{ color: '#2196f3' }} onClick={handleCloseModal}>Fermer</Button>
        </DialogActions>
      </Dialog>

        </Box>
      );
    };
    
    export default DemandeMaterielList;