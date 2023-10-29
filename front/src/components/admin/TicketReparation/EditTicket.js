import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditTicket = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [materielsList, setMaterielsList] = useState([]);
  const [techniciensList, setTechniciensList] = useState([]);
  const [ticketInput, setTicketInput] = useState({
    urgence: '',
    priorite: '',
    description_probleme: '',
    cout_reparation: '',
    num_serie: '',
    id_technicien: '',
    error_list: {},
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la liste des matériels depuis l'API
    axios.get('http://127.0.0.1:8000/api/materiels').then((res) => {
      if (res.data.status === 200) {
        setMaterielsList(res.data.materiels);
      }
    });

    // Récupérer la liste des techniciens depuis l'API
    axios.get('http://127.0.0.1:8000/api/users').then((res) => {
      if (res.data.status === 200) {
        setTechniciensList(res.data.users);
      }
    });

    // Récupérer les données du ticket à modifier
    axios.get(`http://127.0.0.1:8000/api/tickets/${id}`).then((res) => {
      if (res.data.status === 200) {
        const ticketData = res.data.ticket;
        setTicketInput({
          urgence: ticketData.urgence,
          priorite: ticketData.priorite,
          description_probleme: ticketData.description_probleme,
          cout_reparation: ticketData.cout_reparation,
          num_serie: ticketData.num_serie,
          id_technicien: ticketData.id_technicien,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/tickets');
      }
    });
  }, [id, navigate]);

  const updateTicket = (e) => {
    e.preventDefault();
    
    // Réinitialisez les messages d'erreur
    setTicketInput({
      ...ticketInput,
      error_list: {},
    });
    setFormError('');

    // Validation côté client
    const errors = {};
    if (ticketInput.urgence === '') {
      errors.urgence = "L'urgence est requise";
    }
    if (ticketInput.priorite === '') {
      errors.priorite = 'La priorité est requise';
    }
    if (ticketInput.num_serie === '') {
      errors.num_serie = 'Le numéro de série est requis';
    }
    if (ticketInput.id_technicien === '') {
      errors.id_technicien = 'Le technicien est requis';
    }
    // ... Ajoutez la validation pour les autres champs

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les dans le formulaire
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors).map((key) => {
          if (key === 'urgence') {
            return 'Urgence';
          } else if (key === 'priorite') {
            return 'Priorité';
          } else if (key === 'num_serie') {
            return 'Numéro de série';
          } else if (key === 'id_technicien') {
            return 'Technicien';
          }
          return key;
        }).join(' et ');
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        if (errorField === 'urgence') {
          errorString = "Le champ 'Urgence' est requis";
        } else if (errorField === 'priorite') {
          errorString = "Le champ 'Priorité' est requis";
        } else if (errorField === 'num_serie') {
          errorString = "Le champ 'Numéro de série' est requis";
        } else if (errorField === 'id_technicien') {
          errorString = "Le champ 'Technicien' est requis";
        }
      }

      setTicketInput({
        ...ticketInput,
        error_list: errors,
      });
      setFormError(errorString);
      swal('Erreurs', errorString, 'error');
    } else {
      // Pas d'erreurs, procéder à la requête Axios
      const data = {
        urgence: ticketInput.urgence,
        priorite: ticketInput.priorite,
        description_probleme: ticketInput.description_probleme,
        cout_reparation: ticketInput.cout_reparation,
        num_serie: ticketInput.num_serie,
        id_technicien: ticketInput.id_technicien,
      };
      axios.put(`http://127.0.0.1:8000/api/tickets/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Success', res.data.message, 'success');
            navigate('/admin/tickets');
          } else if (res.data.status === 400) {
            setTicketInput({
              ...ticketInput,
              error_list: res.data.errors,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleInput = (e) => {
    e.persist();
    setTicketInput({ ...ticketInput, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification du ticket</h4>
                <NavLink to="/admin/tickets" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <form onSubmit={updateTicket}>
                      {formError && (
                        <div className="alert alert-danger mb-3">
                          {formError}
                        </div>
                      )}
                      <div className="form-group mb-3">
                        <label htmlFor="urgence">Urgence</label>
                        <select
                          name="urgence"
                          onChange={handleInput}
                          value={ticketInput.urgence}
                          className={`form-control ${ticketInput.error_list.urgence ? 'is-invalid' : ''}`}
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
                          className={`form-control ${ticketInput.error_list.priorite ? 'is-invalid' : ''}`}
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
                          className={`form-control ${ticketInput.error_list.description_probleme ? 'is-invalid' : ''}`}
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
                        <label htmlFor="cout_reparation">Coût de réparation</label>
                        <input
                          type="text"
                          name="cout_reparation"
                          className={`form-control ${ticketInput.error_list.cout_reparation ? 'is-invalid' : ''}`}
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
                        <label htmlFor="num_serie">Matériel à réparer</label>
                        <select
                          name="num_serie"
                          onChange={handleInput}
                          value={ticketInput.num_serie}
                          className={`form-control ${ticketInput.error_list.num_serie ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner le matériel</option>
                          {materielsList.map((materiel) => (
                            <option key={materiel.num_serie} value={materiel.num_serie}>
                              {materiel.type_materiel}
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
                        <label htmlFor="id_technicien">Technicien qui s'en charge</label>
                        <select
                          name="id_technicien"
                          onChange={handleInput}
                          value={ticketInput.id_technicien}
                          className={`form-control ${ticketInput.error_list.id_technicien ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner un technicien</option>
                          {techniciensList.map((technicien) => (
                            <option key={technicien.id} value={technicien.id}>
                              {technicien.username}
                            </option>
                          ))}
                        </select>
                        {ticketInput.error_list.id_technicien && (
                          <div className="text-danger">
                            {ticketInput.error_list.id_technicien}
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTicket;
