import React, { useState, useEffect } from 'react';
import { UilEditAlt, UilTrashAlt, UilEye, UilCheckCircle } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const TicketReparation = ({ ticket, refreshData }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [intervention_faite, setInterventionFaite] = useState('');
  const [suite_a_donnee, setSuiteDonnees] = useState('');
  

  const handleFait = (id) => {
    Swal.fire({
      title: 'Confirmer la validation de la réparation',
      text: 'Êtes-vous sûr de vouloir valider la clôture de la réparation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://127.0.0.1:8000/api/tickets/reparationFait/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData();
              setOpen(true); // Ouvrir la boîte de dialogue après la validation
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/tickets');
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValidation = () => {
    axios.put(`http://127.0.0.1:8000/api/tickets/reparation_com/${ticket.id_ticket}`, {
      intervention_faite,
      suite_a_donnee,
    })
    .then((res) => {
      if (res.data.status === 200) {
        Swal.fire('Success', res.data.message, 'success');
        refreshData();
      } else if (res.data.status === 404) {
        Swal.fire("Erreur", res.data.message, "error");
        navigate('/admin/tickets');
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setInterventionFaite('');
      setSuiteDonnees('');
      setOpen(false);
    });
  };

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
              navigate('/admin/tickets');
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

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
          {ticket.statut_actuel !== 'Fait' && (
            <button className="btn btn-success btn-sm equal-width-button" onClick={() => handleFait(ticket.id_ticket)}>
              <UilCheckCircle /> Fait
            </button>
          )}
        </div>
      </td>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Validation de la réparation</DialogTitle>
        <DialogContent>
          <TextField
            label="Intervention Faite"
            fullWidth
            margin="normal"
            value={intervention_faite}
            onChange={(e) => setInterventionFaite(e.target.value)}
          />
          <TextField
            label="Suite à Données"
            fullWidth
            margin="normal"
            value={suite_a_donnee}
            onChange={(e) => setSuiteDonnees(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleValidation} color="primary">Valider</Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
};

export default TicketReparation;
