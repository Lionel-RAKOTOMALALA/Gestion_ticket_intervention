// TechnicienApp.jsx
import React, { useState } from "react";
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import TechnicienList from "./TechnicienList";
import TechnicienForm from "./TechnicienForm"; // Ajoutez l'import du composant TechnicienForm

const TechnicienApp = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTechnicienId, setSelectedTechnicienId] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null);

  const handleOpenFormModal = () => {
    setInitialFormValues(null); // Réinitialiser les valeurs initiales du formulaire
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
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Techniciens</h1>
      <p className="mb-5">Gérez les techniciens de votre équipe ici.</p>
      <NavLink to="/admin/techniciens">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3" onClick={handleOpenFormModal}>
            <UilPlus size="20" /> Ajouter un technicien
          </button>
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
    </div>
  );
};

export default TechnicienApp;
