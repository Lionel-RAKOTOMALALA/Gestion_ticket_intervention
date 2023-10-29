import React from "react";
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import DemandeurList from "./DemandeurList";

const DemandeurApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Demandeurs</h1>
      <p className="mb-5">
        Gérez les demandeurs de votre équipe ici.
      </p>
      <NavLink to="/admin/demandeur/ajout">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter un demandeur
          </button>
        </div>
      </NavLink>
      <DemandeurList />
    </div>
  );
};

export default DemandeurApp;
