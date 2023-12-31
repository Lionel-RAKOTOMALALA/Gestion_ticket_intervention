import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Skeleton,
  Avatar
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
   
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/techniciens");
        setTechniciens(response.data.techniciens);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    
    fetchData();

    const intervalId = setInterval(fetchData, 3000);


    return () => clearInterval(intervalId);
  }, []); 

  const refreshData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/techniciens");
      setTechniciens(response.data.techniciens);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
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

        if (res.data.status === 200) {
          Swal.fire("Success", res.data.message, "success");
          refreshData();
        } else if (res.data.status === 404) {
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
    { field: "id_technicien", headerName: "ID", width: 70 },
    { 
      field: 'photo_profil_user', // Assurez-vous que le nom du champ correspond à votre modèle de données
      headerName: 'Profil', 
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={`http://localhost:8000/uploads/users/${params.row.photo_profil_user}`} alt={params.row.username} style={{ marginRight: 8 }} />
          {params.row.username}
        </div>
      ),
    },
    { field: "email", headerName: "Email", width: 180 },
    { field: "sexe", headerName: "Sexe", width: 80 },
    { 
      
      field: 'logo', // Assurez-vous que le nom du champ correspond à votre modèle de données
      headerName: 'Entreprise', 
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={`http://localhost:8000/uploads/logo/${params.row.logo}`} alt={params.row.logo} style={{ marginRight: 8, width: 80}} />
          
        </div>
      ),
    },
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
              onClick={() => handleEdit(params.row.id_technicien)}
            >
              Modifier
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Delete />}
              onClick={() => handleDelete(params.row.id_technicien)}
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
          getRowId={(row) => row.id_technicien}
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
