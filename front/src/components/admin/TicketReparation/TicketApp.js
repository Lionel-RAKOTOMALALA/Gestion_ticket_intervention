import React from "react";
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import TicketList from "./TicketList"; // Assurez-vous d'importer le composant approprié pour la liste des tickets

const TicketApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Tickets d'intervention</h1>
      <p className="mb-5">
        Gérez les tickets d'intervention de votre équipe ici.
      </p>
      <NavLink to="/admin/ticket/ajout"> {/* Assurez-vous que l'URL est correcte */}
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Créer un nouveau ticket
          </button>
        </div>
      </NavLink>
      <TicketList /> 
    </div>
  );
};

export default TicketApp;
