import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Skeleton,
  Avatar,
  Grid,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import EditMateriel from './EditMateriel'; // Assurez-vous que le chemin du composant EditMateriel est correct

const MaterielList = () => {
  const [materiels, setMateriels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/materiel_repare', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        setMateriels(response.data.materiels);
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
      const response = await axios.get('http://127.0.0.1:8000/api/materiel_repare', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      setMateriels(response.data.materiels);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (num_serie) => {
    const selected = materiels.find((m) => m.num_serie === num_serie);
    setSelectedMateriel(selected);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMateriel(null);
  };

  const handleDelete = async (num_serie) => {
    try {
      const result = await Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Êtes-vous sûr de vouloir supprimer ce matériel ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
      });

      if (result.isConfirmed) {
        const res = await axios.delete(`http://127.0.0.1:8000/api/materiels/${num_serie}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (res.data.status === 200) {
          Swal.fire('Success', res.data.message, 'success');
          refreshData();
        } else if (res.data.status === 404) {
          Swal.fire('Erreur', res.data.message, 'error');
          navigate('/admin/materiels');
        } else {
          Swal.fire('Erreur', "Une erreur inattendue s'est produite", 'error');
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Erreur', 'Une erreur s\'est produite', 'error');
    }
  };

  const columns = [
    { field: 'num_serie', headerName: 'Numero de serie', width: 150 },
    {
      field: 'image_materiel_url',
      headerName: 'Image du matériel',
      width: 200,
      renderCell: (params) => (
        <Avatar
          src={`http://localhost:8000/uploads/materiels/${params.row.image_materiel_url}`}
          alt="materiel Photo"
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    { field: 'type_materiel', headerName: 'Type du materiel', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 350,
      renderCell: (params) => (
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => handleEdit(params.row.num_serie)}
            >
              Modifier
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Delete />}
              onClick={() => handleDelete(params.row.num_serie)}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
        Liste des materiels
      </Typography>
      {isLoading ? (
  <DataGrid
    columns={columns.map((col) => ({
      ...col,
      renderCell: (params) => (
        <Skeleton variant="rectangular" height={30} width="80%" />
      ),
    }))}
    rows={[...Array(5).keys()].map((rowId) => ({
      id: rowId,
      num_serie: '',
      image_materiel_url: '',
      type_materiel: '',
    }))}
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
  rows={materiels}
  pageSize={5}
  rowsPerPageOptions={[5]}
  onCellEditCommit={(params) => console.log(params)}
  getRowId={(row) => row.num_serie}
  sx={{
    [`& .${gridClasses.row}`]: {
      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#eee' : '#333'),
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
            {selectedMateriel && (
              <EditMateriel
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                id={selectedMateriel.num_serie}
              />
            )}
          </div>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MaterielList;
