  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { Box, Typography, Button, Modal, Backdrop, Fade } from '@mui/material';
  import { DataGrid, gridClasses } from '@mui/x-data-grid';
  import EditDemandeur from './EditDemandeur';
  import { useLocation, useNavigate } from 'react-router-dom';

  const DemandeurList = () => {
    const [demandeurs, setDemandeurs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDemandeur, setSelectedDemandeur] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      refreshData();
    }, []);

    const refreshData = () => {
      axios
        .get('http://127.0.0.1:8000/api/demandeurs')
        .then((response) => {
          setDemandeurs(response.data.demandeurs);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    useEffect(() => {
      const pathname = location.pathname;
      const match = pathname.match(/\/admin\/demandeurs\/edit\/(\d+)/);
      if (match) {
        const id_demandeur = parseInt(match[1], 10);
        const selected = demandeurs.find((demandeur) => demandeur.id_demandeur === id_demandeur);
        setSelectedDemandeur(selected);
        setIsEditModalOpen(true);
      }
    }, [location.pathname, demandeurs]);

    const handleCloseEditModal = () => {
      setSelectedDemandeur(null);
      setIsEditModalOpen(false);
      refreshData();
    };

    const columns = [
      { field: 'id_demandeur', headerName: 'ID', width: 70 },
      { field: 'username', headerName: 'Nom d\'utilisateur', width: 100 },
      { field: 'email', headerName: 'Email', width: 100 },
      { field: 'sexe', headerName: 'Sexe', width: 120 },
      { field: 'nom_entreprise', headerName: 'Nom de l\'entreprise', width: 100 },
      { field: 'role_user', headerName: 'Role', width: 100 },
      { field: 'nom_poste', headerName: 'Nom du poste', width: 100 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEdit(params.row.id_demandeur)}
            >
              Modifier
            </Button>
          </div>
        ),
      },
    ];

    const handleEdit = (id_demandeur) => {
      const selected = demandeurs.find((demandeur) => demandeur.id_demandeur === id_demandeur);
      setSelectedDemandeur(selected);
      setIsEditModalOpen(true);
    };

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <Typography variant="h6" component="h6" sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
          Liste des demandeurs
        </Typography>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <DataGrid
            columns={columns}
            rows={demandeurs.map((demandeur) => ({ ...demandeur, id: demandeur.id_demandeur }))}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            onCellClick={(params) => {
              if (params.field === 'actions') {
                handleEdit(params.row.id_demandeur);
              }
            }}
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
