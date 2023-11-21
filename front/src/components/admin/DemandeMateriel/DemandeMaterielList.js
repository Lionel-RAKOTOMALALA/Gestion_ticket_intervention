import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Skeleton,
} from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { UilEye, UilEditAlt, UilTrash } from "@iconscout/react-unicons";
import { Link, useNavigate } from "react-router-dom";

const DemandeMaterielList = () => {
  const [demandeMateriels, setDemandeMateriels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [technicienAdmin, setTechnicienAdmin] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("auth_token"));
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";
  const isUserSimple = userRole === "userSimple";
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('Valider');
  const [rejectButtonText, setRejectButtonText] = useState('Rejeter'); // Ajout de l'état pour le texte du bouton "Rejeter"

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
  }, [authToken, isApproved, isRejected, isButtonDisabled]);

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
    if (!isApproved) {
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
                        setIsApproved(true);
                        setIsRejected(false);
                      } else if (res.data.status === 404) {
                        Swal.fire("Erreur", res.data.message, "error");
                        navigate("/admin/demande_materiels");
                      }
                    } catch (error) {
                      console.error(error);
                      // Gérer les erreurs
                    }

                } catch (error) {
                    console.error("Error during validation:", error);
                }
            }
        });
    }
};

  const handleReject = async (e, id) => {
    if (!isRejected) {
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
              { status: "rejeté" }
            );

            if (res.data.status === 200) {
              Swal.fire("Success", res.data.message, "success");
              refreshData();
              setIsRejected(true);
              setIsApproved(false);
              setRejectButtonText('Rejeté'); // Mettez à jour le texte du bouton ici
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate("/admin/demande_materiels");
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-demande-materiel/${id}`);
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
        setIsDeleting(true);

        const res = await axios.delete(
          `http://127.0.0.1:8000/api/demande_materiel/${id}`
        );

        if (res.data.status === 200) {
          Swal.fire("Success", res.data.message, "success");
          refreshData();
        } else if (res.data.status === 404) {
          Swal.fire("Erreur", res.data.message, "error");
          navigate("/admin/demande_materiels");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
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
      <Grid container spacing={2}>
        {isUserSimple && (
          <>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => handleEdit(params.row.id_demande)}
              ></Button>
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
                    disabled={isButtonDisabled}
                  >
                    {buttonText}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => handleReject(e, params.row.id_demande)}
                    disabled={isButtonDisabled}
                  >
                    {rejectButtonText} {/* Utilisez la constante pour le texte du bouton */}
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
                    disabled={isButtonDisabled}
                  >
                    {buttonText}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => handleReject(e, params.row.id_demande)}
                    disabled={isButtonDisabled}
                  >
                    {rejectButtonText} {/* Utilisez la constante pour le texte du bouton */}
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

  const demandeurCountLogic = (row) => {
    return isAdmin ? (
      <>
        {row.status === "Validé" ? (
          <span>
            <CheckCircleIcon size="20" style={{ color: "green" }} />
            {row.status}
          </span>
        ) : row.status === "rejeté" ? (
          <span>
            <CancelIcon size="20" style={{ color: "red" }} />
            {row.status}
          </span>
        ) : (
          // Autres icônes ou contenu ici si nécessaire
          row.status
        )}
      </>
    ) : (
      <>
        {isAdmin ? (
          <>
            {row.status === "Validé" || row.status === "rejeté" ? (
              ""
            ) : (
              <>
                {isApproved === false && isRejected === false && (
                  <>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={(e) => handleValidate(e, row.id_demande)}
                      disabled={isApproved}
                    >
                      {isApproved ? (
                        "Valider"
                      ) : <CheckCircleIcon style={{ color: "green" }} /> /* Ajout de l'icône */}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => handleReject(e, row.id_demande)}
                      disabled={isRejected}
                    >
                      {isRejected ? (
                        "Rejet"
                      ) : <CancelIcon style={{ color: "red" }} /> /* Ajout de l'icône */}
                    </button>
                  </>
                )}
              </>
            )}
          </>
        ) : null}
      </>
    );
  };



  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 1000); // Set the interval time in milliseconds (e.g., 30000 for every 30 seconds)

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [authToken, isApproved, isRejected, isButtonDisabled]);


    const columns = [
      { field: "id_demande", headerName: "Numéro de la demande", width: 150 },
      { field: "etat_materiel", headerName: "État du matériel", width: 150 },
      { field: "description_probleme", headerName: "Description du problème", width: 200 },
      { field: "type_materiel", headerName: "Type du matériel", width: 150 },
      { field: "demandeur_username", headerName: "Nom du demandeur", width: 150 },
      { field: "demandeur_entreprise", headerName: "Entreprise", width: 100 },
      {
        field: "status",
        headerName: "Statut de la demande",
        width: 150,
        renderCell: (params) => (
          <Box style={{ display: "flex", alignItems: "center" }}>
            {statusIcon(params.row.status)}{statusIcon()} {params.row.status}
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 350,
        renderCell: renderActions,
      },
    ];

    const handleView = (id) => {
      // Implementation for handleView
      // ...
    };

    const calculateSkeletonSize = (content) => {
      // You can customize this function based on your content and styling needs
      const defaultSize = 30; // Default size for the Skeleton
      const contentLength = content ? content.toString().length : 0;
  
      // Adjust the multiplier as needed to fit your layout
      return defaultSize + contentLength * 5;
    };
  
    // Your other functions...
  
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
      </Box>
    );
  };
  
  export default DemandeMaterielList;