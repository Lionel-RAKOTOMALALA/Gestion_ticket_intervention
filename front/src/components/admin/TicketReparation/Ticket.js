import React, { useState, useEffect } from 'react';
import { UilEditAlt, UilTrashAlt, UilEye, UilCheckCircle } from "@iconscout/react-unicons";
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
      <td>{ticket.statut_actuel}</td>
      <td>{ticket.type_materiel}</td>
      <td>
        <img
          src={"http://localhost:8000/uploads/materiels/" + ticket.image_materiel_url}
          alt="materiel Photo"
          className="rounded-circle mx-auto"
          style={{
            width: "3rem",
            height: "3rem",
          }}
        />
      </td>
      <td>{ticket.nom_technicien}</td>
      <td>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/ticket/edit/${ticket.id_ticket}`}>
            <button className="btn btn-primary btn-sm equal-width-button">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <button onClick={(e) => deleteTicket(e, ticket.id_ticket)} className="btn btn-danger btn-sm equal-width-button">
            <UilTrashAlt /> Supprimer
          </button>
        </div>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/tickets/${ticket.id_ticket}`}>
            <button className="btn btn-primary btn-sm equal-width-button">
              <UilEye /> View
            </button>
          </NavLink>
        </div>
        <div style={{ display: 'inline-block' }}>
          <button className="btn btn-success btn-sm equal-width-button">
            <UilCheckCircle /> Valider
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TicketReparation;
