import React, { useEffect, useState } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";

const TicketReparationForm = () => {
  const [materielsList, setMaterielsList] = useState([]);
  const [techniciensList, setTechniciensList] = useState([]);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const [selectedTechnicien, setSelectedTechnicien] = useState(null);

  useEffect(() => {
    // Récupérer la liste des matériels depuis l'API
    axios.get("http://127.0.0.1:8000/api/materiels").then((res) => {
      if (res.data.status === 200) {
        setMaterielsList(res.data.materiels);
      }
    });

    // Récupérer la liste des techniciens depuis l'API
    axios.get("http://127.0.0.1:8000/api/techniciens").then((res) => {
      if (res.data.status === 200) {
        setTechniciensList(res.data.techniciens);
      }
    });
  }, []);

  const [ticketInput, setTicketInput] = useState({
    date_creation: "",
    urgence: "",
    priorite: "",
    description_probleme: "",
    statut_actuel: "",
    date_resolution: "",
    cout_reparation: "",
    num_serie: "",
    id_technicien: "",
    intervention_faite: "",
    suite_a_donnee: "",
    error_list: {},
  });

  const [formError, setFormError] = useState("");

  const handleInput = (e) => {
    e.persist();
    setTicketInput({
      ...ticketInput,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const resetForm = () => {
    setTicketInput({
      date_creation: "",
      urgence: "",
      priorite: "",
      description_probleme: "",
      statut_actuel: "",
      date_resolution: "",
      cout_reparation: "",
      num_serie: "",
      id_technicien: "",
      intervention_faite: "",
      suite_a_donnee: "",
      error_list: {},
    });
    setFormError("");
  };

  const submitTicket = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setTicketInput({
      ...ticketInput,
      error_list: {},
    });
    setFormError("");

    // Validation côté client
    const errors = {};
    if (ticketInput.date_creation === "") {
      errors.date_creation = "La date de création est requise";
    }
    if (ticketInput.urgence === "") {
      errors.urgence = "L'urgence est requise";
    }
    if (ticketInput.priorite === "") {
      errors.priorite = "La priorité est requise";
    }
    if (ticketInput.num_serie === "") {
      errors.num_serie = "Le numéro de série est requis";
    }
    if (ticketInput.id_technicien === "") {
      errors.id_technicien = "Le technicien est requis";
    }
    // ... Ajoutez la validation pour les autres champs

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les avec Swal et dans le formulaire
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors)
          .map((key) => key)
          .join(" et ");
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        errorString = `Le champ '${errorField}' est requis`;
      }

      setTicketInput({
        ...ticketInput,
        error_list: errors,
      });
      setFormError(errorString);

      swal("Erreurs", errorString, "error");
    } else {
      const data = {
        date_creation: ticketInput.date_creation,
        urgence: ticketInput.urgence,
        priorite: ticketInput.priorite,
        description_probleme: ticketInput.description_probleme,
        statut_actuel: ticketInput.statut_actuel,
        date_resolution: ticketInput.date_resolution,
        cout_reparation: ticketInput.cout_reparation,
        num_serie: ticketInput.num_serie,
        id_technicien: ticketInput.id_technicien,
        intervention_faite: ticketInput.intervention_faite,
        suite_a_donnee: ticketInput.suite_a_donnee,
      };

      axios
        .post("http://127.0.0.1:8000/api/tickets", data)
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            // Réinitialisez les champs du formulaire
            resetForm();
          } else if (res.data.status === 400) {
            setTicketInput({
              ...ticketInput,
              error_list: res.data.errors,
            });
          }
        });
    }
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h4>Ajouter un ticket d'intervention</h4>
                <NavLink
                  to="/admin/tickets"
                  className="btn btn-primary btn-sm float-end"
                >
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <form onSubmit={submitTicket} id="TICKET_FORM" encType="multipart/form-data">
                    {formError && (
                      <div className="alert alert-danger mb-3">
                        {formError}
                      </div>
                    )}
                    <div className="form-group mb-3">
                      <label htmlFor="date_creation">Date de création</label>
                      <input
                        type="date"
                        name="date_creation"
                        className={`form-control ${
                          ticketInput.error_list.date_creation
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleInput}
                        value={ticketInput.date_creation}
                      />
                      {ticketInput.error_list.date_creation && (
                        <div className="text-danger">
                          {ticketInput.error_list.date_creation}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="urgence">Urgence</label>
                      <select
                        name="urgence"
                        onChange={handleInput}
                        value={ticketInput.urgence}
                        className="form-control"
                      >
                        <option value="">Sélectionner l'urgence</option>
                        <option value="Faible">Faible</option>
                        <option value="Moyenne">Moyenne</option>
                        <option value="Élevée">Élevée</option>
                      </select>
                      {ticketInput.error_list.urgence && (
                        <div className="text-danger">
                          {ticketInput.error_list.urgence}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="priorite">Priorité</label>
                      <select
                        name="priorite"
                        onChange={handleInput}
                        value={ticketInput.priorite}
                        className="form-control"
                      >
                        <option value="">Sélectionner la priorité</option>
                        <option value="Basse">Basse</option>
                        <option value="Normale">Normale</option>
                        <option value="Haute">Haute</option>
                      </select>
                      {ticketInput.error_list.priorite && (
                        <div className="text-danger">
                          {ticketInput.error_list.priorite}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="description_probleme">Description du problème</label>
                      <textarea
                        name="description_probleme"
                        className={`form-control ${
                          ticketInput.error_list.description_probleme
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleInput}
                        value={ticketInput.description_probleme}
                      />
                      {ticketInput.error_list.description_probleme && (
                        <div className="text-danger">
                          {ticketInput.error_list.description_probleme}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="statut_actuel">Statut actuel</label>
                      <input
                        type="text"
                        name="statut_actuel"
                        className={`form-control ${
                          ticketInput.error_list.statut_actuel
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleInput}
                        value={ticketInput.statut_actuel}
                      />
                      {ticketInput.error_list.statut_actuel && (
                        <div className="text-danger">
                          {ticketInput.error_list.statut_actuel}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="date_resolution">Date de résolution</label>
                      <input
                        type="date"
                        name="date_resolution"
                        className={`form-control ${
                          ticketInput.error_list.date_resolution
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleInput}
                        value={ticketInput.date_resolution}
                      />
                      {ticketInput.error_list.date_resolution && (
                        <div className="text-danger">
                          {ticketInput.error_list.date_resolution}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="cout_reparation">Coût de réparation</label>
                      <input
                        type="text"
                        name="cout_reparation"
                        className={`form-control ${
                          ticketInput.error_list.cout_reparation
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleInput}
                        value={ticketInput.cout_reparation}
                      />
                      {ticketInput.error_list.cout_reparation && (
                        <div className="text-danger">
                          {ticketInput.error_list.cout_reparation}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="num_serie">Numéro de série</label>
                      <select
                        name="num_serie"
                        onChange={handleInput}
                        value={ticketInput.num_serie}
                        className={`form-control ${
                          ticketInput.error_list.num_serie
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value="">Sélectionner le numéro de série</option>
                        {materielsList.map((materiel) => (
                          <option key={materiel.num_serie} value={materiel.num_serie}>
                            {materiel.num_serie}
                          </option>
                        ))}
                      </select>
                      {ticketInput.error_list.num_serie && (
                        <div className="text-danger">
                          {ticketInput.error_list.num_serie}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="id_technicien">Technicien</label>
                      <select
                        name="id_technicien"
                        onChange={handleInput}
                        value={ticketInput.id_technicien}
                        className={`form-control ${
                          ticketInput.error_list.id_technicien
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value="">Sélectionner un technicien</option>
                        {techniciensList.map((technicien) => (
                          <option key={technicien.id_technicien} value={technicien.id_technicien}>
                            {technicien.competence}
                          </option>
                        ))}
                      </select>
                      {ticketInput.error_list.id_technicien && (
                        <div className="text-danger">
                          {ticketInput.error_list.id_technicien}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="intervention_faite">Intervention faite</label>
                      <input
                        type="text"
                        name="intervention_faite"
                        className={`form-control ${
                          ticketInput.error_list.intervention_faite
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleInput}
                        value={ticketInput.intervention_faite}
                      />
                      {ticketInput.error_list.intervention_faite && (
                        <div className="text-danger">
                          {ticketInput.error_list.intervention_faite}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="suite_a_donnee">Suite à donnée</label>
                      <input
                        type="text"
                        name="suite_a_donnee"
                        className={`form-control ${
                          ticketInput.error_list.suite_a_donnee
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleInput}
                        value={ticketInput.suite_a_donnee}
                      />
                      {ticketInput.error_list.suite_a_donnee && (
                        <div className="text-danger">
                          {ticketInput.error_list.suite_a_donnee}
                        </div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block mb-2"
                        >
                          <UilCheckCircle size="20" /> Confirmer
                        </button>
                      </div>
                      <NavLink to="/admin/tickets" className="col">
                        <button
                          type="button"
                          className="btn btn-secondary btn-block mb-2"
                        >
                          <UilTimes size="20" /> Annuler
                        </button>
                      </NavLink>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketReparationForm;
