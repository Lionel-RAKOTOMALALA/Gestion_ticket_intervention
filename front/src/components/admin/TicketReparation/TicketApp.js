import React, { useState, useEffect } from "react";
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import TicketList from "./TicketList";
import TicketListDemandeur from './TicketListDemandeur';
import axios from "axios";

const TicketApp = () => {
  const [demandeurVerifCount, setDemandeurVerifCount] = useState(null);
  const [loading, setLoading] = useState(true);

 

  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const isUserSimple = userRole === 'userSimple';

  return (
    <div className="container-fluid">
      {isAdmin ? (
        <>
          <h1 className="h3 mb-2 text-gray-800">Tickets d'intervention</h1>
          <p className="mb-5">
            Gérez les tickets d'intervention de votre équipe ici.
          </p>
         
        </>
      ) : (
        <TicketListDemandeur />
      )}
      {isAdmin && <TicketList />}
    </div>
  );
};

export default TicketApp;
