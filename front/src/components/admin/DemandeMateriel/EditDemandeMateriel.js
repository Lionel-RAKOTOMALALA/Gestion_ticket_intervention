import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditDemandeMateriel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [demandeurList, setDemandeurList] = useState([]);
  const [materielList, setMaterielList] = useState([]);
  const [demandeMaterielInput, setDemandeMaterielInput] = useState({
    etat_materiel: '',
    description_probleme: '',
    num_serie: '',
    id_demandeur: '',
    error_list: {},
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la liste des demandeurs
    axios.get('http://127.0.0.1:8000/api/users').then((res) => {
      if (res.data.status === 200) {
        setDemandeurList(res.data.users);
      }
    });

    // Récupérer la liste des matériels
    axios.get('http://127.0.0.1:8000/api/materiels/listeMateriel').then((res) => {
      if (res.data.status === 200) {
        setMaterielList(res.data.materiels);
      }
    });

    // Récupérer les données de la demande de matériel
    axios.get(`http://127.0.0.1:8000/api/demande_materiel/${id}`).then((res) => {
      if (res.data.status === 200) {
        setDemandeMaterielInput({
          etat_materiel: res.data.demande.etat_materiel,
          description_probleme: res.data.demande.description_probleme,
          num_serie: res.data.demande.num_serie,
          id_demandeur: res.data.demande.id_demandeur,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/demande_materiels');
      }
    });
  }, [id, navigate]);

  const updateDemandeMateriel = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setDemandeMaterielInput({
      ...demandeMaterielInput,
      error_list: {},
    });
    setFormError('');

    // Validation côté client
    const errors = {};
    if (demandeMaterielInput.etat_materiel === '') {
      errors.etat_materiel = "L'état du matériel est requis";
    }
    if (demandeMaterielInput.description_probleme === '') {
      errors.description_probleme = "La description du problème est requise";
    }
    if (demandeMaterielInput.num_serie === '') {
      errors.num_serie = 'Le numéro de série est requis';
    }
    if (demandeMaterielInput.id_demandeur === '') {
      errors.id_demandeur = "L'ID du demandeur est requis";
    }

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les dans le formulaire
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors)
          .map((key) => {
            if (key === 'etat_materiel') {
              return "État du matériel";
            } else if (key === 'description_probleme') {
              return "Description du problème";
            } else if (key === 'num_serie') {
              return 'Numéro de série';
            } else if (key === 'id_demandeur') {
              return "ID du demandeur";
            }
            return key;
          })
          .join(' et ');
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        if (errorField === 'etat_materiel') {
          errorString = "Le champ 'État du matériel' est requis";
        } else if (errorField === 'description_probleme') {
          errorString = "Le champ 'Description du problème' est requis";
        } else if (errorField === 'num_serie') {
          errorString = 'Le champ Numéro de série est requis';
        } else if (errorField === 'id_demandeur') {
          errorString = "Le champ 'ID du demandeur' est requis";
        }
      }

      setDemandeMaterielInput({
        ...demandeMaterielInput,
        error_list: errors,
      });
      setFormError(errorString);
      swal('Erreurs', errorString, 'error');
    } else {
      // Pas d'erreurs, procéder à la requête Axios
      const data = {
        etat_materiel: demandeMaterielInput.etat_materiel,
        description_probleme: demandeMaterielInput.description_probleme,
        num_serie: demandeMaterielInput.num_serie,
        id_demandeur: demandeMaterielInput.id_demandeur,
      };
      axios.put(`http://127.0.0.1:8000/api/demande_materiel/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Success', res.data.message, 'success');
            navigate('/admin/demande_materiels');
          } else if (res.data.status === 400) {
            setDemandeMaterielInput({
              ...demandeMaterielInput,
              error_list: res.data.errors,
            });
          } else if (res.data.status === 404) {
            swal('Erreur', res.data.message, 'error');
            navigate('/admin/demande_materiels');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleInput = (e) => {
    e.persist();
    setDemandeMaterielInput({ ...demandeMaterielInput, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification de la demande de matériel</h4>
                <NavLink to="/admin/demande_materiels" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <form onSubmit={updateDemandeMateriel}>
                      {formError && (
                        <div className="alert alert-danger mb-3">
                          {formError}
                        </div>
                      )}
                      <div className="form-group mb-3">
                        <label htmlFor="etat_materiel">État du matériel</label>
                        <input
                          type="text"
                          name="etat_materiel"
                          className={`form-control ${demandeMaterielInput.error_list.etat_materiel ? 'is-invalid' : ''}`}
                          onChange={handleInput}
                          value={demandeMaterielInput.etat_materiel}
                        />
                        {demandeMaterielInput.error_list.etat_materiel && (
                          <div className="text-danger">
                            {demandeMaterielInput.error_list.etat_materiel}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="description_probleme">Description du problème</label>
                        <input
                          type="text"
                          name="description_probleme"
                          className={`form-control ${demandeMaterielInput.error_list.description_probleme ? 'is-invalid' : ''}`}
                          onChange={handleInput}
                          value={demandeMaterielInput.description_probleme}
                        />
                        {demandeMaterielInput.error_list.description_probleme && (
                          <div className="text-danger">
                            {demandeMaterielInput.error_list.description_probleme}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="num_serie">Numéro de série du matériel</label>
                        <select
                          name="num_serie"
                          onChange={handleInput}
                          value={demandeMaterielInput.num_serie}
                          className={`form-control ${demandeMaterielInput.error_list.num_serie ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner un matériel</option>
                          {materielList.map((item) => (
                            <option key={item.num_serie} value={item.num_serie}>
                              {item.type_materiel}
                            </option>
                          ))}
                        </select>
                        {demandeMaterielInput.error_list.num_serie && (
                          <div className="text-danger">
                            {demandeMaterielInput.error_list.num_serie}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="id_demandeur">Nom du demandeur</label>
                        <select
                          name="id_demandeur"
                          onChange={handleInput}
                          value={demandeMaterielInput.id_demandeur}
                          className={`form-control ${demandeMaterielInput.error_list.id_demandeur ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner un demandeur</option>
                          {demandeurList.map((item) => (
                            <option key={item.id_demandeur} value={item.id_demandeur}>
                              {item.username}
                            </option>
                          ))}
                        </select>
                        {demandeMaterielInput.error_list.id_demandeur && (
                          <div className="text-danger">
                            {demandeMaterielInput.error_list.id_demandeur}
                          </div>
                        )}
                      </div>
                      <div className="row">
                        <div className="col">
                          <button type="submit" className="btn btn-primary btn-block mb-2">
                            <UilCheckCircle size="20" /> Confirmer
                          </button>
                        </div>
                        <NavLink to="/admin/demande_materiels" className="col">
                          <button type="button" className="btn btn-secondary btn-block mb-2">
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

export default EditDemandeMateriel;
