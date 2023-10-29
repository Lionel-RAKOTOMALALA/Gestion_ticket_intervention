import React from "react";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";

const Poste = ({ poste, refreshData }) => {
  const navigate = useNavigate();

  if (!poste) {
    return null;
  }

  const deletePoste = (e, id) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer ce poste ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/postes/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData(); 
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/postes');
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
      <td>{poste.id_poste}</td>
      <td>{poste.nom_poste}</td>
      <td>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/poste/edit/${poste.id_poste}`}>
            <button className="btn btn-primary btn-sm mr-2">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ display: 'inline-block' }}>
          <button onClick={(e) => deletePoste(e, poste.id_poste)} className="btn btn-danger btn-sm">
            <UilTrashAlt /> Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Poste;
