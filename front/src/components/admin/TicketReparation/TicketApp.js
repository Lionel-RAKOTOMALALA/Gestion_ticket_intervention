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

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      axios
        .get('http://127.0.0.1:8000/api/countDemandeurForAuthenticatedUser', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        })
        .then(response => {
          setDemandeurVerifCount(response.data.demandeur_count);
          localStorage.setItem('demandeurExist', response.data.demandeur_count);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du nombre de demandeurs :', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const isUserSimple = userRole === 'userSimple';

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div className="container-fluid">
      {isAdmin && demandeurVerifCount === 0 ? (
        <>
          <h1 className="h3 mb-2 text-gray-800">Tickets d'intervention</h1>
          <p className="mb-5">
            Gérez les tickets d'intervention de votre équipe ici.
          </p>
         
        </>
      ) : (
        <TicketListDemandeur />
      )}
      {isAdmin && demandeurVerifCount === 0 && <TicketList />}
    </div>
  );
};

export default TicketApp;
