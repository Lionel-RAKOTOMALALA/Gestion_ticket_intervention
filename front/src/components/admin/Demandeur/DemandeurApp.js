// DemandeurApp.jsx
import React, { useState } from "react";
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import DemandeurList from "./DemandeurList";
import DemandeurForm from "./DemandeurForm";

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
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Demandeurs</h1>
      <p className="mb-5">Gérez les demandeurs de votre équipe ici.</p>
      <NavLink to="/admin/demandeurs">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3" onClick={handleOpenFormModal}>
            <UilPlus size="20" /> Ajouter un demandeur
          </button>
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
    </div>
  );
};

export default DemandeurApp;
