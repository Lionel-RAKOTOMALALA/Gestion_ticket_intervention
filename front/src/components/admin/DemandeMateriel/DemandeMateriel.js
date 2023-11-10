import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import swal from 'sweetalert';
import { UilEditAlt, UilTrash, UilCheckCircle, UilTimesCircle, UilEye } from "@iconscout/react-unicons";
import { Link, useNavigate } from "react-router-dom";

const DemandeMateriel = ({ demandeMateriel, refreshData, demandeurCount }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproved, setIsApproved] = useState(demandeMateriel.status === "Validé");
  const [isRejected, setIsRejected] = useState(false);
  const [technicienAdmin, setTechnicienAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechnicienAdmin = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getTechnicienAdmin`);
        setTechnicienAdmin(response.data.admin);

        console.log(response.data.admin);
        alert(response.data.admin)
      } catch (error) {
        console.error("Erreur lors de la récupération du technicien admin :", error);
      }
    };

    fetchTechnicienAdmin();
  }, []);
  function getUrgencePriorite(etatMateriel, demandeur) {
    let urgence, priorite;
    switch(etatMateriel) {
      case 'En panne':
        urgence = 'Haute';
        priorite = 'Haute';
        break;
      case 'Endommagé':
        urgence = 'Moyenne';
        priorite = 'Moyenne';
        break;
      case 'Dysfonctionnement':
        urgence = 'Faible';
        priorite = 'Faible';
        break;
      case 'Obsolète':
        urgence = 'Faible';
        priorite = 'Faible';
        break;
      case 'Maintenance nécessaire':
        urgence = 'Moyenne';
        priorite = 'Moyenne';
        break;
      case 'Autre':
        urgence = 'Faible';
        priorite = 'Faible';
        break;
      default:
        urgence = 'Faible';
        priorite = 'Faible';
    }
    if (demandeur === 'Copefrito' && urgence === 'Faible') {
      priorite = 'Haute';
    }
    return { urgence, priorite };
   }

  const handleDelete = (e, id) => {
    Swal.fire({
      title: "Confirmer la suppression",
      text: "Êtes-vous sûr de vouloir supprimer cette demande ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/demande_materiel/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire("Success", res.data.message, "success");
              refreshData();
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate("/admin/demande_materiels");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  const handleValidate = async (e, id) => {
    if (!isApproved) {
      Swal.fire({
        title: "Confirmer la validation",
        text: "Êtes-vous sûr de vouloir valider cette demande ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res1 = await axios.put(`http://127.0.0.1:8000/api/demande_materiel/validate/${id}`);
            let res2;

            if (technicienAdmin) {
              const { urgence, priorite } = getUrgencePriorite(demandeMateriel.etat_materiel, demandeMateriel.demandeur_entreprise);
              const dataTicket = {
                urgence: urgence,
                priorite: priorite,
                statut_actuel: 'En cours de reparation',
                id_technicien: technicienAdmin,
                id_demande: demandeMateriel.id_demande,
              };
              
              console.log("Data Ticket:", dataTicket);
              res2 = await axios.post('http://127.0.0.1:8000/api/tickets', dataTicket);
            }

            if (res1.data.status === 200) {
              Swal.fire("Success", res1.data.message, "success");
              refreshData();
              setIsApproved(true);
              setIsRejected(false);

              if (res2 && res2.data.status === 200) {
                Swal.fire("Success", res2.data.message, "success");
              } else if (res2 && res2.data.status === 400) {
                Swal.fire("Erreur", res2.data.message, "error");
              }
            } else if (res1.data.status === 404) {
              Swal.fire("Erreur", res1.data.message, "error");
              navigate("/admin/demande_materiels");
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  };

  const handleReject = async (e, id) => {
    if (!isRejected) {
      Swal.fire({
        title: "Confirmer le rejet",
        text: "Êtes-vous sûr de vouloir rejeter cette demande ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axios.put(`http://127.0.0.1:8000/api/demande_materiel/reject/${id}`, { status: "rejeté" });

            if (res.data.status === 200) {
              Swal.fire("Success", res.data.message, "success");
              refreshData();
              setIsRejected(true);
              setIsApproved(false);
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate("/admin/demande_materiels");
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  };

  useEffect(() => {
    if (demandeMateriel.status === 'rejeté' || demandeMateriel.status === 'Validé') {
      setIsRejected(demandeMateriel.status === 'rejeté');
      setIsApproved(demandeMateriel.status === 'Validé');
    }
  }, [demandeMateriel.status]);

  return (
    <tr>
      <td>{demandeMateriel.id_demande}</td>
      <td>{demandeMateriel.etat_materiel}</td>
      <td>{demandeMateriel.description_probleme}</td>
      <td>{demandeMateriel.type_materiel}</td>
      {demandeurCount !== 1 || localStorage.getItem('role') !== 'userSimple' ? (
        <>
          <td>{demandeMateriel.demandeur_username}</td>
          <td>{demandeMateriel.demandeur_entreprise}</td>
        </>
      ) : null}
      <td>
        {demandeurCount < 0 ? (
          <>
            <Link to={`/admin/demande_materiels/edit/${demandeMateriel.id_demande}`} className="btn btn-sm btn-primary" disabled={isDeleting}>
              <UilEditAlt size="20" />
            </Link>
            <button className="btn btn-sm btn-danger" onClick={(e) => handleDelete(e, demandeMateriel.id_demande)} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : <UilTrash size="20" />}
            </button>
          </>
        ) : (
          <>
            {demandeMateriel.status === "Validé" ? (
              <span>
                <UilCheckCircle size="20" style={{ color: 'green' }} />
                {demandeMateriel.status}
              </span>
            ) : demandeMateriel.status === "rejeté" ? (
              <span>
                <UilTimesCircle size="20" style={{ color: 'red' }} />
                {demandeMateriel.status}
              </span>
            ) : (
              // Autres icônes ou contenu ici si nécessaire
              demandeMateriel.status
            )}
          </>
        )}
      </td>

      <td>
        {demandeurCount > 0 ? (
          <>
            <Link to={`/admin/demande_materiels/edit/${demandeMateriel.id_demande}`} className="btn btn-sm btn-primary" disabled={isDeleting}>
              <UilEditAlt size="20" />
            </Link>
            <button className="btn btn-sm btn-danger" onClick={(e) => handleDelete(e, demandeMateriel.id_demande)} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : <UilTrash size="20" />}
            </button>
          </>
        ) : (
          <>
            {demandeMateriel.status === "Validé" || demandeMateriel.status === "rejeté" ? (
              ""
            ) : (
              <>
                {isApproved === false && isRejected === false && (
                  <>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={(e) => handleValidate(e, demandeMateriel.id_demande)}
                      disabled={isApproved}
                    >
                      {isApproved ? (
                        "Valider"
                      ) : <UilCheckCircle size="20" /> /* Ajout de l'icône */}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => handleReject(e, demandeMateriel.id_demande)}
                      disabled={isRejected}
                    >
                      {isRejected ? (
                        "Rejet"
                      ) : <UilTimesCircle size="20" /> /* Ajout de l'icône */}
                    </button>
                  </>
                )}
              </>
            )}
          </>
        )}
        <button className="btn btn-sm btn-success">
          <UilEye size="20" /> View
        </button>
      </td>
    </tr>
  );
};

export default DemandeMateriel;
