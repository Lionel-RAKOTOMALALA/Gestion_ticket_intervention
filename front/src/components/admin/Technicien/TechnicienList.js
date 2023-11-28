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
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const TechnicienList = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    axios
      .get("http://127.0.0.1:8000/api/techniciens")
      .then((response) => {
        setTechniciens(response.data.techniciens);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEdit = (id) => {
    navigate(`/edit-technicien/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Confirmer la suppression",
        text: "Êtes-vous sûr de vouloir supprimer ce technicien ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      });

      if (result.isConfirmed) {
        const res = await axios.delete(
          `http://127.0.0.1:8000/api/techniciens/${id}`
        );

        if (res.data && res.data.status === 200) {
          Swal.fire("Success", res.data.message, "success");
          refreshData();
        } else if (res.data && res.data.status === 404) {
          Swal.fire("Erreur", res.data.message, "error");
          navigate("/admin/techniciens");
        } else {
          // Gestion d'une réponse inattendue
          Swal.fire("Erreur", "Une erreur inattendue s'est produite", "error");
        }
      }
    } catch (error) {
      console.error(error);
      // Gestion des erreurs générales
      Swal.fire("Erreur", "Une erreur s'est produite", "error");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Nom d'utilisateur", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "sexe", headerName: "Sexe", width: 80 },
    { field: "nom_entreprise", headerName: "Nom de l'entreprise", width: 150 },
    { field: "role_user", headerName: "Role", width: 100 },
    { field: "competence", headerName: "Compétence", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 350,
      renderCell: (params) => (
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => handleEdit(params.row.id)}
            >
              Modifier
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Delete />}
              onClick={() => handleDelete(params.row.id)}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: "center", mt: 3, mb: 3 }}>
        Liste des techniciens
      </Typography>
      {isLoading ? (
        <DataGrid
          columns={columns.map((col) => ({
            ...col,
            renderCell: (params) => (
              <Skeleton
                variant="rectangular"
                height={30}
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
          rows={techniciens}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          onCellEditCommit={(params) => console.log(params)}
          getRowId={(row) => row.id}
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

export default TechnicienList;
