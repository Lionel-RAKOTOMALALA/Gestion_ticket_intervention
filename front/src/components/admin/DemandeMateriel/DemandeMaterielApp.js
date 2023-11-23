import React, { useState, useEffect } from 'react';
// ... (other imports)

import { Box, Typography, Button, Slide } from '@mui/material';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DemandeMaterielList from './DemandeMaterielList';

const DemandeMaterielApp = () => {
  const [userRole, setUserRole] = useState('');
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    // Charger le rôle de l'utilisateur depuis le stockage local
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  let linkAdd = userRole === 'admin' ? '/admin/demande/ajout' : '/Acceuil_client/demande_materiels/ajout';

  const handleButtonClick = () => {
    setShowButton(false);
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Box sx={{ p: 3 }}>
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" color="primary.main" gutterBottom>
                Demande de Réparation de Matériel
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="body1" color="textSecondary" paragraph>
                Ne laissez pas votre appareil endommagé affecter votre quotidien. Notre équipe dévouée est là pour vous aider. Faites dès maintenant une
                demande d'intervention pour réparer votre appareil et reprenez le contrôle de votre technologie.
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
        <NavLink to={linkAdd}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, marginLeft: 'auto' }}>
            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button variant="contained" color="primary" startIcon={<UilPlus size="20" />} onClick={handleButtonClick}>
                    Ajouter
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </NavLink>
        <DemandeMaterielList />
      </Box>
    </Slide>
  );
};

export default DemandeMaterielApp;
