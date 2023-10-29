import React from "react";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";

const Demandeur = ({ demandeur, refreshData }) => {
  const navigate = useNavigate();

  if (!demandeur) {
    return null;
  }

  const deleteDemandeur = (e, id) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer ce demandeur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/demandeurs/${id}`) // Mettez à jour l'URL de l'API pour la suppression du demandeur
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData();
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/demandeurs');
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
      <td>{demandeur.id_demandeur}</td>
      <td>{demandeur.nom_utilisateur}</td>
      <td>{demandeur.nom_poste}</td>
      <td>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/demandeur/edit/${demandeur.id_demandeur}`}>
            <button className="btn btn-primary btn-sm mr-2">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ display: 'inline-block' }}>
          <button onClick={(e) => deleteDemandeur(e, demandeur.id_demandeur)} className="btn btn-danger btn-sm">
            <UilTrashAlt /> Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Demandeur;
