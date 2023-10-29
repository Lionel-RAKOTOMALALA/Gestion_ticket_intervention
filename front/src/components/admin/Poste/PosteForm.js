import React, { useEffect, useState } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";

const PosteForm = () => {
  const [posteInput, setPosteInput] = useState({
    nom_poste: "",
    error_list: {},
  });
  const [formError, setFormError] = useState("");

  const handleInput = (e) => {
    e.persist();
    setPosteInput({
      ...posteInput,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const resetForm = () => {
    setPosteInput({
      nom_poste: "",
      error_list: {},
    });
    setFormError("");
  };

  const submitPoste = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setPosteInput({
      ...posteInput,
      error_list: {},
    });
    setFormError("");

    // Validation côté client
    const errors = {};
    if (posteInput.nom_poste === "") {
      errors.nom_poste = "Nom du poste est requis";
    }

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les avec Swal et dans le formulaire
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors)
          .map((key) => {
            if (key === "nom_poste") {
              return "Nom du poste";
            }
            return key;
          })
          .join(" et ");
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        if (errorField === "nom_poste") {
          errorString = "Le champ 'Nom du poste' est requis";
        }
      }

      setPosteInput({
        ...posteInput,
        error_list: errors,
      });
      setFormError(errorString);

      swal("Erreurs", errorString, "error");
    } else {
      const data = {
        nom_poste: posteInput.nom_poste,
        // Vous pouvez ajouter d'autres champs ici
      };

      axios
        .post("http://127.0.0.1:8000/api/postes", data)
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            // Réinitialisez les champs du formulaire
            resetForm();
          } else if (res.data.status === 400) {
            setPosteInput({
              ...posteInput,
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
                <h4>Ajouter un poste d'employé</h4>
                <NavLink to="/admin/postes" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <form onSubmit={submitPoste} id="POSTE_FORM">
                    {formError && (
                      <div className="alert alert-danger mb-3">
                        {formError}
                      </div>
                    )}
                    <div className="form-group mb-3">
                      <label htmlFor="nom_poste">Nom du poste</label>
                      <input
                        type="text"
                        name="nom_poste"
                        className={`form-control ${
                          posteInput.error_list.nom_poste ? "is-invalid" : ""
                        }`}
                        onChange={handleInput}
                        value={posteInput.nom_poste}
                      />
                      {posteInput.error_list.nom_poste && (
                        <div className="text-danger">
                          {posteInput.error_list.nom_poste}
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
                      <NavLink to="/admin/postes" className="col">
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

export default PosteForm;
