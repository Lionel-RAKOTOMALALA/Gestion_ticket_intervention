import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Poste from "./Poste";
import $ from "jquery";
import Swal from "sweetalert2";
import Loader from "../materiels/loader";

const PosteList = () => {
  const [postes, setPostes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);

  const destroyDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
  };

  const refreshData = () => {
    destroyDataTable();
    axios.get("http://127.0.0.1:8000/api/postes")
      .then((response) => {
        setPostes(response.data.postes);
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
          <h6 className="m-0 font-weight-bold text-primary">Liste des postes d'employés</h6>
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
                    <th>ID Poste</th>
                    <th>Nom du Poste</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {postes.map((poste) => (
                    <Poste key={poste.id_poste} poste={poste} refreshData={refreshData} />
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

export default PosteList;
