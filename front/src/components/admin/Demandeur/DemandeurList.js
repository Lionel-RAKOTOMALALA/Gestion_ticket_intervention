import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Swal from "sweetalert2";
import { Edit, Delete } from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  Skeleton,
  Grid,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import EditDemandeur from './EditDemandeur';
import { useLocation, useNavigate } from 'react-router-dom';

const DemandeurList = () => {
  const [demandeurs, setDemandeurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDemandeur, setSelectedDemandeur] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/demandeurs');
        setDemandeurs(response.data.demandeurs);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 6000); // Refresh every 60 seconds (adjust this interval as needed)

    // Fetch initial data
    fetchData();

    // Clear interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); 

  useEffect(() => {
    const pathname = location.pathname;
    const match = pathname.match(/\/admin\/demandeurs\/edit\/(\d+)/);
    if (match) {
      const id_demandeur = parseInt(match[1], 10);
      const selected = demandeurs.find(
        (demandeur) => demandeur.id_demandeur === id_demandeur
      );
      setSelectedDemandeur(selected);
      setIsEditModalOpen(true);
    }
  }, [location.pathname, demandeurs]);

  const handleCloseEditModal = () => {
    setSelectedDemandeur(null);
    setIsEditModalOpen(false);
    
  };
  const handleDelete = async (id) => {
    try {
      setIsEditModalOpen(false)
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
          `http://127.0.0.1:8000/api/demandeurs/${id}`
        );

        if (res.data.status === 200) {
          Swal.fire("Success", res.data.message, "success");
        
        } else if (res.data.status === 404) {
          Swal.fire("Erreur", res.data.message, "error");
          navigate("/admin/demandeurs");
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
    { 
      field: 'id_demandeur', 
      headerName: 'ID', 
      width: 70 
    },
    { 
      field: 'photo_profil_user', // Assurez-vous que le nom du champ correspond à votre modèle de données
      headerName: 'Profil', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={`http://localhost:8000/uploads/users/${params.row.photo_profil_user}`} alt={params.row.username} style={{ marginRight: 8 }} />
          {params.row.username}
        </div>
      ),
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 170 
    },
    { 
      field: 'sexe', 
      headerName: 'Sexe', 
      width: 120 
    },
    { 
      
      field: 'logo', // Assurez-vous que le nom du champ correspond à votre modèle de données
      headerName: 'Entreprise', 
      width: 120,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={`http://localhost:8000/uploads/logo/${params.row.logo}`} alt={params.row.logo} style={{ marginRight: 8, width: 80}} />
          
        </div>
      ),
    },
    { 
      field: 'role_user', 
      headerName: 'Role', 
      width: 150 
    },
    { 
      field: 'nom_poste', 
      headerName: 'Nom du poste', 
      width: 150 
    },
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
              onClick={() => handleEdit(params.row.id_demandeur)}
            >
              Modifier
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Delete />}
              onClick={() => handleDelete(params.row.id_demandeur)}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  const getLoadingRows = () => {
    return [...Array(5).keys()].map((rowId) => {
      const skeletonRow = { id: rowId };

      columns.forEach((column) => {
        skeletonRow[column.field] = (
          <Skeleton
            variant="rectangular"
            height={30}
            width="80%"
            key={`${rowId}-${column.field}`}
          />
        );
      });

      return skeletonRow;
    });
  };

  const handleEdit = (id_demandeur) => {
    const selected = demandeurs.find(
      (demandeur) => demandeur.id_demandeur === id_demandeur
    );
    setSelectedDemandeur(selected);
    setIsEditModalOpen(true);
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
        Liste des demandeurs
      </Typography>
      {isLoading ? (
        <DataGrid
          columns={columns.map((column) => ({
            ...column,
            renderCell: (params) => params.row[column.field],
          }))}
          rows={getLoadingRows()}
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
          rows={demandeurs}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          onCellEditCommit={(params) => console.log(params)}
          getRowId={(row) => row.id_demandeur}
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
            {selectedDemandeur && (
              <EditDemandeur
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                idDemandeur={selectedDemandeur.id_demandeur}
              />
            )}
          </div>
        </Fade>
      </Modal>
    </Box>
  );
};

export default DemandeurList;
