import React, { useState, useEffect } from 'react';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import { Button, Modal } from '@mui/material';
import { Slide, Box, Typography } from '@mui/material';
import DemandeMaterielList from './DemandeMaterielList';
import DemandeMaterielForm from './DemandeMaterielForm';
import axios from 'axios';

const DemandeMaterielApp = () => {
  const [userRole, setUserRole] = useState('');
  const [showButton, setShowButton] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demandeurVerifCount, setDemandeurVerifCount] = useState(null);
  const [technicienVerifCount, setTechnicienVerifCount] = useState(null);

  useEffect(() => {
    // Charger le rôle de l'utilisateur depuis le stockage local
    const role = localStorage.getItem('role');
    setUserRole(role);

    // Récupérez le token d'authentification depuis le localStorage
    const authToken = localStorage.getItem('auth_token');

    // Assurez-vous que le token est disponible
    if (authToken) {
      // Utilisez Axios pour faire une requête à la route API
      axios.get("http://127.0.0.1:8000/api/countDemandeurForAuthenticatedUser", {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      })
        .then(response => {
          setDemandeurVerifCount(response.data.demandeur_count);
          console.log(`Nombre d'apparition dans demandeurs : ${response.data.demandeur_count}`);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du nombre de demandeurs :', error);
        });

      axios.get("http://127.0.0.1:8000/api/countTechnicienForAuthenticatedUser", {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      })
        .then(response => {
          setTechnicienVerifCount(response.data.demandeur_count);
          console.log(`Nombre d'apparition dans technicien : ${response.data.technicien_count}`);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du nombre de demandeurs :', error);
        });
    }
  }, []);

  let linkAdd = userRole === 'admin' ? '/admin/demande/ajout' : '/Acceuil_client/demande_materiels';



  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="primary.main" gutterBottom>
          Demande de Réparation de Matériel
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Ne laissez pas votre appareil endommagé affecter votre quotidien. Notre équipe dévouée est là pour vous aider. Faites dès maintenant une
          demande d'intervention pour réparer votre appareil et reprenez le contrôle de votre technologie.
        </Typography>
        {userRole === 'userSimple' && (
          <NavLink to={linkAdd}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, marginLeft: 'auto' }}>
              <Button variant="contained" color="primary" startIcon={<UilPlus size="20" />} onClick={handleOpenModal}>
                Ajouter
              </Button>
            </Box>
          </NavLink>
        )}
        <DemandeMaterielList />

        {/* Afficher le composant DemandeMaterielForm en tant que modal */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
        <DemandeMaterielForm open={isModalOpen} onClose={handleCloseModal} />
        </Modal>
      </Box>
    </Slide>
  );
};

export default DemandeMaterielApp;
