import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Slide } from '@mui/material';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TechnicienList from './TechnicienList';
import TechnicienForm from './TechnicienForm';

const TechnicienApp = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTechnicienId, setSelectedTechnicienId] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null);

  const handleOpenFormModal = () => {
    setInitialFormValues(null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleOpenEditModal = (id_technicien) => {
    setSelectedTechnicienId(id_technicien);
    setIsEditModalOpen(true);
    // Fetch les valeurs initiales du technicien à éditer et mettez à jour initialFormValues
    // Exemple d'appel API :
    // axios.get(`http://votre-api.com/technicien/${id_technicien}`)
    //   .then(response => setInitialFormValues(response.data));
  };

  const handleCloseEditModal = () => {
    setSelectedTechnicienId(null);
    setIsEditModalOpen(false);
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Box sx={{ p: 3 }}>
        <AnimatePresence>
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="h3 mb-2 text-gray-800"
          >
            Techniciens
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
            Gérez les techniciens de votre équipe ici.
          </motion.p>
        </AnimatePresence>

        <NavLink to="/admin/techniciens">
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
                <UilPlus size="20" /> Ajouter un technicien
              </motion.button>
            </AnimatePresence>
          </div>
        </NavLink>

        <TechnicienList onEdit={handleOpenEditModal} />

        <TechnicienForm
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          initialValues={initialFormValues}
        />

        <TechnicienForm
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialValues={initialFormValues}
        />
      </Box>
    </Slide>
  );
};

export default TechnicienApp;
