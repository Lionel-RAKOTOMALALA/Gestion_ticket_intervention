import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Demandeur from "./Demandeur"; // Assurez-vous que Demandeur est correctement importé
import $ from "jquery";
import Swal from "sweetalert2";
import Loader from "../materiels/loader";

const DemandeurList = () => {
  const [demandeurs, setDemandeurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);

  const destroyDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
  };

  const refreshData = () => {
    destroyDataTable();
    axios.get("http://127.0.0.1:8000/api/demandeurs") // Mettez à jour l'URL de l'API pour les demandeurs
      .then((response) => {
        setDemandeurs(response.data.demandeurs); // Assurez-vous que la réponse contient les demandeurs
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
    refreshData();
  }, []);

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des demandeurs</h6>
        </div>
        <div className="card-body">
          {isLoading ? (
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
                    <th>ID Demandeur</th>
                    <th>Nom de l'utilisateur</th>
                    <th>Poste occupé</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demandeurs.map((demandeur) => (
                    <Demandeur key={demandeur.id_demandeur} demandeur={demandeur} refreshData={refreshData} />
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

export default DemandeurList;
