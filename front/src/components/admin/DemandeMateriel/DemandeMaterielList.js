import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DemandeMateriel from "./DemandeMateriel";
import Loader from "../materiels/loader"; // Importez le composant Loader
import $ from "jquery";

const DemandeMaterielList = () => {
  const [demandeMateriels, setDemandeMateriels] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement
  const tableRef = useRef(null);

  const destroyDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy(); // Détruire la DataTable existante
    }
  };

  const refreshData = () => {
    destroyDataTable(); // Détruire DataTable avant de charger de nouvelles données
    axios.get("http://127.0.0.1:8000/api/demande_materiel/")
      .then((response) => {
        setDemandeMateriels(response.data.demandes);
        // console.log(demandeMateriels);
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
                    <th>Numéro de série du matériel</th>
                    <th>Nom du demandeur</th>
                    <th>Status du demande</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demandeMateriels.map((demandeMateriel) => (
                    <DemandeMateriel key={demandeMateriel.id_demande} demandeMateriel={demandeMateriel} refreshData={refreshData} />
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
