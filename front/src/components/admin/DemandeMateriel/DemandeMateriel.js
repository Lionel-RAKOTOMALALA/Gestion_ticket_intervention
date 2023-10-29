import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { UilEditAlt, UilTrash } from "@iconscout/react-unicons";
import { Link,useNavigate } from "react-router-dom";

const DemandeMateriel = ({ demandeMateriel, refreshData }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const deleteDemande = (e, id) => {
    Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Êtes-vous sûr de vouloir supprimer cette demande ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://127.0.0.1:8000/api/demande_materiel/${id}`)
            .then((res) => {
              if (res.data.status === 200) {
                Swal.fire('Success', res.data.message, 'success');
                refreshData(); 
              } else if (res.data.status === 404) {
                Swal.fire("Erreur", res.data.message, "error");
                navigate('/admin/demande_materiels');
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
      <td>{demandeMateriel.id_demande}</td>
      <td>{demandeMateriel.etat_materiel}</td>
      <td>{demandeMateriel.description_probleme}</td>
      <td>{demandeMateriel.type_materiel}</td>
      <td>{demandeMateriel.demandeur_username}</td>
      <td>{demandeMateriel.status}</td>
      <td>
        <Link to={`/admin/demande/edit/${demandeMateriel.id_demande}`} className="btn btn-sm btn-primary">
          <UilEditAlt size="20" />
        </Link>
        <button className="btn btn-sm btn-danger" onClick={(e) => deleteDemande(e, demandeMateriel.id_demande)} disabled={isDeleting}>
          {isDeleting ? "Suppression..." : <UilTrash size="20" />}
        </button>
      </td>
    </tr>
  );
};

export default DemandeMateriel;
