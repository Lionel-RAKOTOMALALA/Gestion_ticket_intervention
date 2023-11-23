
import React, { useEffect, useState } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";

const DemandeMaterielForm = () => {
  
   

  const userRole = localStorage.getItem('role');
  let linkBack = null;
  if(userRole === 'admin') {
    linkBack = '/admin/demande_materiels';
  } else {
    linkBack = '/Acceuil_client/demande_materiels';
  }

  const [demandeurList, setDemandeurList] = useState([]);
  const [materielList, setMaterielList] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/users`).then((res) => {
      if (res.data.status === 200) {
        setDemandeurList(res.data.users);
      }
    });
    axios.get(`http://127.0.0.1:8000/api/materiels`).then((res) => {
      if (res.data.status === 200) {
        setMaterielList(res.data.materiels);
      }
    });
  }, []);

  const [demandeMaterielInput, setDemandeMaterielInput] = useState({
    etat_materiel: "",
    description_probleme: "",
    num_serie: "",
    id_demandeur: "",
    description_etat_personnalise: "", // Correction du nom du champ
    error_list: {},
  });

  const [formError, setFormError] = useState("");

  const handleInput = (e) => {
    e.persist();
    setDemandeMaterielInput({
      ...demandeMaterielInput,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const resetForm = () => {
    setDemandeMaterielInput({
      etat_materiel: "",
      description_probleme: "",
      num_serie: "",
      id_demandeur: "",
      description_etat_personnalise: "", // Correction du nom du champ
      error_list: {},
    });
    setFormError("");
  };

  const submitDemandeMateriel = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setDemandeMaterielInput({
      ...demandeMaterielInput,
      error_list: {},
    });
    setFormError("");

    // Validation côté client
    const errors = {};
    if (demandeMaterielInput.etat_materiel === "") {
      errors.etat_materiel = "L'état du matériel est requis";
    }
    if (demandeMaterielInput.description_probleme === "") {
      errors.description_probleme = "La description du problème est requise";
    }
    if (demandeMaterielInput.num_serie === "") {
      errors.num_serie = "Le numéro de série est requis";
    }
    if (demandeMaterielInput.id_demandeur === "") {
      errors.id_demandeur = "L'ID du demandeur est requis";
    }

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les avec Swal et dans le formulaire
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors)
          .map((key) => {
            if (key === "etat_materiel") {
              return "État du matériel";
            } else if (key === "description_probleme") {
              return "Description du problème";
            } else if (key === "num_serie") {
              return "Numéro de série";
            } else if (key === "id_demandeur") {
              return "ID du demandeur";
            }
            return key;
          })
          .join(" et ");
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        if (errorField === "etat_materiel") {
          errorString = "Le champ 'État du matériel' est requis";
        } else if (errorField === "description_probleme") {
          errorString = "Le champ 'Description du problème' est requis";
        } else if (errorField === "num_serie") {
          errorString = "Le champ 'Numéro de série' est requis";
        } else if (errorField === "id_demandeur") {
          errorString = "Le champ 'ID du demandeur' est requis";
        }
      }

      setDemandeMaterielInput({
        ...demandeMaterielInput,
        error_list: errors,
      });
      setFormError(errorString);

      swal("Erreurs", errorString, "error");
    } else {
      let etatMaterielValue = demandeMaterielInput.etat_materiel;

      if (demandeMaterielInput.etat_materiel === "Autre") {
        etatMaterielValue = demandeMaterielInput.description_etat_personnalise;
      }

      const data = {
        etat_materiel: etatMaterielValue, // Utilisez la valeur correcte
        status: "En attente de validation",
        description_probleme: demandeMaterielInput.description_probleme,
        num_serie: demandeMaterielInput.num_serie,
        id_demandeur: demandeMaterielInput.id_demandeur,
      };
      
      const authToken = localStorage.getItem('auth_token');
      axios
        .post("http://127.0.0.1:8000/api/demande_materiel", data, {
          headers: {
              'Authorization': `Bearer ${authToken}`
          }})
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            // Réinitialisez les champs du formulaire
            resetForm();
          } else if (res.data.status === 400) {
            setDemandeMaterielInput({
              ...demandeMaterielInput,
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
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Demande de réparation</h4>
                <NavLink
                  to={linkBack}
                  className="btn btn-primary btn-sm float-end"
                >
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <form onSubmit={submitDemandeMateriel} id="DEMANDE_MATERIEL_FORM">
                    {formError && (
                      <div className="alert alert-danger mb-3">
                        {formError}
                      </div>
                    )}
                    <div className="form-group mb-3">
                    <label htmlFor="etat_materiel">État du matériel</label>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="etat_materiel"
                            value="En panne"
                            checked={demandeMaterielInput.etat_materiel === "En panne"}
                            onChange={handleInput}
                          /> En panne
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="etat_materiel"
                            value="Endommagé"
                            checked={demandeMaterielInput.etat_materiel === "Endommagé"}
                            onChange={handleInput}
                          /> Endommagé
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="etat_materiel"
                            value="Dysfonctionnement"
                            checked={demandeMaterielInput.etat_materiel === "Dysfonctionnement"}
                            onChange={handleInput}
                          /> Dysfonctionnement
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="etat_materiel"
                            value="Obsolete"
                            checked={demandeMaterielInput.etat_materiel === "Obsolete"}
                            onChange={handleInput}
                          /> Obsolete
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="etat_materiel"
                            value="Maintenance nécessaire"
                            checked={demandeMaterielInput.etat_materiel === "Maintenance nécessaire"}
                            onChange={handleInput}
                          /> Maintenance nécessaire
                        </label>
                      </div>
                      <label>
                        <input
                          type="radio"
                          name="etat_materiel"
                          value="Autre"
                          checked={demandeMaterielInput.etat_materiel === "Autre"}
                          onChange={handleInput}
                        /> Autre
                      </label>
                    </div>
                    {demandeMaterielInput.etat_materiel === "Autre" && (
                      <div className="form-group mb-3">
                        <label htmlFor="description_etat_personnalise">Description de l'état personnalisé</label>
                        <input
                          type="text"
                          name="description_etat_personnalise" // Utilisez "description_etat_personnalise" comme nom
                          className="form-control"
                          onChange={handleInput}
                          value={demandeMaterielInput.description_etat_personnalise} // Affichez la valeur
                        />
                      </div>
                    )}

                    <div className="form-group mb-3">
                      <label htmlFor="description_probleme">Description du problème</label>
                      <input
                        type="text"
                        name="description_probleme"
                        className={`form-control ${
                          demandeMaterielInput.error_list.description_probleme
                            ? "is-invalid"
                            : ""
                        }`}
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
                      <select name="num_serie" onChange={handleInput} value={demandeMaterielInput.num_serie} className="form-control">
                        <option value="">Sélectionner un matériel</option>
                        {materielList.map((item) => {
                          return (
                            <option key={item.num_serie} value={item.num_serie}>
                              {item.type_materiel}
                            </option>
                          );
                        })}
                      </select>
                      {demandeMaterielInput.error_list.num_serie && (
                        <div className="text-danger">
                          {demandeMaterielInput.error_list.num_serie}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="id_demandeur">Nom du demandeur</label>
                      <select name="id_demandeur" onChange={handleInput} value={demandeMaterielInput.id_demandeur} className="form-control">
                        <option value="">Sélectionner un demandeur</option>
                        {demandeurList.map((item) => {
                          return (
                            <option key={item.id_demandeur} value={item.id_demandeur}>
                              {item.username}
                            </option>
                          );
                        })}
                      </select>
                      {demandeMaterielInput.error_list.id_demandeur && (
                        <div className="text-danger">
                          {demandeMaterielInput.error_list.id_demandeur}
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
                      <NavLink to={linkBack} className="col">
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

export default DemandeMaterielForm;