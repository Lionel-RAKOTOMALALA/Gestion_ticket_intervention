import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DemandeMateriel from "./DemandeMateriel";
import Loader from "../materiels/loader"; // Importez le composant Loader
import $ from "jquery";

const DemandeMaterielList = () => {
  const [demandeMateriels, setDemandeMateriels] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement
  const tableRef = useRef(null);

  const authToken = localStorage.getItem('auth_token');
  const [demandeurVerifCount, setDemandeurVerifCount] = useState(null);

  const destroyDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy(); // Détruire la DataTable existante
    }
  };

  const refreshData = () => {
    destroyDataTable(); // Détruire DataTable avant de charger de nouvelles données
    let apiUrl = "http://127.0.0.1:8000/api/demande_materiel"; // URL par défaut

    // Utilisez Axios pour faire une requête à la route API countDemandeurForAuthenticatedUser
    axios.get("http://127.0.0.1:8000/api/countDemandeurForAuthenticatedUser", {
      headers: {
        'Authorization': `Bearer ${authToken}`, // Ajoutez le token Bearer
      }
    })
      .then((response) => {
        const demandeurVerifCount = response.data.demandeur_count;
        setDemandeurVerifCount(response.data.demandeur_count);
        
        if (demandeurVerifCount > 0) {
          apiUrl = "http://127.0.0.1:8000/api/demandes-utilisateur";
        }

        // Utilisez l'URL appropriée pour récupérer les données
        axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Ajoutez le token Bearer
          }
        })
          .then((response) => {
            setDemandeMateriels(response.data.demandes);
            setIsLoading(false);
            
            if (tableRef.current) {
              $(tableRef.current).DataTable({
                language: {
                  search: 'Rechercher :',
                  lengthMenu: 'Afficher _MENU_ éléments par page',
                  info: 'Affichage de _START_ à _END_ sur _TOTAL_ éléments',
                  infoEmpty: 'Aucun élément trouvé',
                  infoFiltered: '(filtré de _MAX_ éléments au total)',
                  paginate: {
                    first: 'Premier',
                    previous: 'Précédent',
                    next: 'Suivant',
                    last: 'Dernier'
                  }
                }
              });
            }
          })
          .catch((error) => {
            console.error(error);
            // Gérer les erreurs ici, par exemple, une redirection vers une page d'erreur
          });
      })
      .catch((error) => {
        console.error(error);
        // Gérer les erreurs ici, par exemple, une redirection vers une page d'erreur
      });
  };

  useEffect(() => {
    refreshData(); // Appeler la fonction ici pour charger les données lors du montage du composant
  }, []);

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des demandes de réparation de matériel</h6>
        </div>
        <div className="card-body">
          {isLoading ? ( // Condition d'affichage du loader
            <Loader />
          ) : (
            <div className="table-responsive">
              <table
                ref={tableRef}
                className="table table-bordered table-striped"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>Numéro de la demande</th>
                    <th>État du matériel</th>
                    <th>Description du problème</th>
                    <th>Type du matériel</th>
                    <th>Nom du demandeur</th>
                    <th>Status du demande</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demandeMateriels.map((demandeMateriel) => (
                    <DemandeMateriel key={demandeMateriel.id_demande} demandeMateriel={demandeMateriel} refreshData={refreshData} demandeurCount={demandeurVerifCount}/>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandeMaterielList;
