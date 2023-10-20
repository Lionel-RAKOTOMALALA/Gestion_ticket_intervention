import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Materiel from "./Materiel";
import Loader from "./loader"; // Importez le composant Loader
import $ from "jquery";

const MaterielList = () => {
  const [materiels, setMateriels] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement
  const tableRef = useRef(null);

  const refreshData = () => {
  axios.get("http://127.0.0.1:8000/api/materiels")
      .then((response) => {
        setMateriels(response.data.materiels);
        setIsLoading(false); // Une fois les données chargées, mettez isLoading à false
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
    }
  useEffect(() => {
    refreshData;
  }, []);

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des materiels</h6>
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
                    <th>Numero de serie</th>
                    <th>Type du matériel</th>
                    <th>Etat du matériel</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materiels.map((materiel) => (
                    <Materiel key={materiel.num_serie} materiel={materiel} />
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

export default MaterielList;
