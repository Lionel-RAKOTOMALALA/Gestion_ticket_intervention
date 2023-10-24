import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import TicketReparation from "./Ticket"; // Assurez-vous d'importer le composant approprié pour les tickets d'intervention
import $ from "jquery";
import Swal from "sweetalert2";
import Loader from "../materiels/loader";

const TicketReparationList = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);

  const destroyDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
  };

  const refreshData = () => {
    destroyDataTable();
    axios.get("http://127.0.0.1:8000/api/tickets") // Assurez-vous d'utiliser l'URL correcte
      .then((response) => {
        setTickets(response.data.tickets); // Assurez-vous que la réponse contient les données des tickets d'intervention
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
          <h6 className="m-0 font-weight-bold text-primary">Liste des tickets d'intervention</h6>
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
                    <th>ID Ticket</th>
                    <th>Date de Création</th>
                    <th>Urgence</th>
                    <th>Priorité</th>
                    <th>Description du Problème</th>
                    <th>Statut Actuel</th>
                    <th>Type de Matériel</th>
                    <th>Nom du Technicien</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <TicketReparation key={ticket.id_ticket} ticket={ticket} refreshData={refreshData} />
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

export default TicketReparationList;
