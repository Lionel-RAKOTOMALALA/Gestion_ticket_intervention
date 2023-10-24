import React from "react";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";

const TicketReparation = ({ ticket, refreshData }) => {
  const navigate = useNavigate();

  if (!ticket) {
    return null;
  }

  const deleteTicket = (e, id) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer ce ticket d\'intervention ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/tickets/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData(); 
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/tickets'); // Assurez-vous d'utiliser la bonne URL
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  }

  return (
    <tr>
      <td>{ticket.id_ticket}</td>
      <td>{ticket.date_creation}</td>
      <td>{ticket.urgence}</td>
      <td>{ticket.priorite}</td>
      <td>{ticket.description_probleme}</td>
      <td>{ticket.statut_actuel}</td>
      <td>{ticket.date_resolution}</td>
      <td>{ticket.cout_reparation}</td>
      <td>{ticket.num_serie}</td>
      <td>{ticket.nom_technicien}</td> {/* Assurez-vous que la clé est correcte pour le nom du technicien */}
      <td>{ticket.intervention_faite}</td>
      <td>{ticket.suite_a_donnee}</td>
      <td>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/tickets/${ticket.id_ticket}`}>
            <button className="btn btn-primary btn-sm mr-2">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ display: 'inline-block' }}>
          <button onClick={(e) => deleteTicket(e, ticket.id_ticket)} className="btn btn-danger btn-sm">
            <UilTrashAlt /> Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TicketReparation;
