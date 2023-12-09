import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Slide } from '@mui/material';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DemandeurList from './DemandeurList';
import DemandeurForm from './DemandeurForm';

const DemandeurApp = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDemandeurId, setSelectedDemandeurId] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null);

  const handleOpenFormModal = () => {
    setInitialFormValues(null);
    setIsFormModalOpen(true);
  };



  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleOpenEditModal = (id_demandeur) => {
    setSelectedDemandeurId(id_demandeur);
    setIsEditModalOpen(true);
    // Fetch les valeurs initiales du demandeur à éditer et mettez à jour initialFormValues
    // Exemple d'appel API :
    // axios.get(`http://votre-api.com/demandeur/${id_demandeur}`)
    //   .then(response => setInitialFormValues(response.data));
  };

  const handleCloseEditModal = () => {
    setSelectedDemandeurId(null);
    setIsEditModalOpen(false);
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Box sx={{ p: 3 }}>
        <AnimatePresence>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="h3 mb-2 text-gray-800"
          >
            Demandeurs
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-5"
          >
            Gérez les demandeurs de votre équipe ici.
          </motion.p>
        </AnimatePresence>

        <NavLink to="/admin/demandeurs">
          <div className="d-flex justify-content-end">
            <AnimatePresence>
              <motion.button
                type="button"
                className="btn btn-primary mb-3"
                onClick={handleOpenFormModal}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <UilPlus size="20" /> Ajouter un demandeur
              </motion.button>
            </AnimatePresence>
          </div>
        </NavLink>

        <DemandeurList onEdit={handleOpenEditModal} />

        <DemandeurForm
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          initialValues={initialFormValues}
        />

        <DemandeurForm
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialValues={initialFormValues}
        />
      </Box>
    </Slide>
  );
};

export default DemandeurApp;
