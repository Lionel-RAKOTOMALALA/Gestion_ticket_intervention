import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditUser = () => {
  const navigate = useNavigate();
  const [registerInput, setregisterInput] = useState({
    username: '',
    email: '',
    logo: '',
    role_user: '',
    nom_entreprise: '',
    sexe : '',
    error_list: {},
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/users/${id}`).then((res) => {
      if (res.data.status === 200) {
        setregisterInput({
          username: res.data.user.username,
          email: res.data.user.email,
          logo: res.data.user.logo,
          role_user: res.data.user.role_user,
          nom_entreprise: res.data.user.nom_entreprise,
          sexe: res.data.user.sexe,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/users');
      }
    });
  }, [id, navigate]);

  const registerSubmit = (e) => {
    e.preventDefault();
    setregisterInput({
      ...registerInput,
      error_list: {},
    });
    setFormError("");

    const errors = {};
    if (registerInput.username === "") {
      errors.username = "Nom d'utilisateur est requis";
    }
    if (registerInput.email === "") {
      errors.email = "E-mail est requis";
    }
    if (registerInput.role_user === "") {
      errors.role_user = "Rôle est requis";
    }
    if (registerInput.nom_entreprise === "") {
      errors.nom_entreprise = "Nom de l'entreprise est requis";
    }

    if (Object.keys(errors).length > 0) {
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors).map((key) => {
          if (key === "username") {
            return "Nom d'utilisateur";
          } else if (key === "email") {
            return "E-mail";
          } else if (key === "role_user") {
            return "Rôle";
          } else if (key === "nom_entreprise") {
            return "Nom de l'entreprise";
          }
          return key;
        }).join(" et ");
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        if (errorField === "username") {
          errorString = "Le champ 'Nom d'utilisateur' est requis";
        } else if (errorField === "email") {
          errorString = "Le champ 'E-mail' est requis";
        } else if (errorField === "role_user") {
          errorString = "Le champ 'Rôle' est requis";
        } else if (errorField === "nom_entreprise") {
          errorString = "Le champ 'Nom de l'entreprise' est requis";
        }
      }

      setregisterInput({
        ...registerInput,
        error_list: errors,
      });
      setFormError(errorString);
      swal("Erreurs", errorString, "error");
    } else {
      const data = {
        username: registerInput.username,
        email: registerInput.email,
        logo: registerInput.logo,
        role_user: registerInput.role_user,
        nom_entreprise: registerInput.nom_entreprise,
        photo_profil_user: registerInput.photo_profil_user,
        password: registerInput.password,
        sexe: registerInput.sexe
      };
      axios.put(`http://127.0.0.1:8000/api/users/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Success', res.data.message, 'success');
            navigate('/admin/users');
          } else if (res.data.status === 400) {
            setregisterInput({
              ...registerInput,
              error_list: res.data.errors,
            });
          } else if (res.data.status === 404) {
            swal("Erreur", res.data.message, "error");
            navigate('/admin/users');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleInput = (e) => {
    e.persist();
    setregisterInput({ ...registerInput, [e.target.name]: e.target.value });
  };

  return (
    <div>
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Register</h4>
            </div>
            <div className="card-body">
              <form onSubmit={registerSubmit}>
                <div className="form-group mb-3">
                  <label>Username</label>
                  <input type="text" name="username" onChange={handleInput} value={registerInput.username} className="form-control" />
                  <span>{registerInput.error_list.username}</span>
                </div>
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input type="text" name="email" onChange={handleInput} value={registerInput.email} className="form-control" />
                  <span>{registerInput.error_list.email}</span>
                </div>
                <div className="form-group mb-3">
                  <label>Password</label>
                  <input type="password" name="password" onChange={handleInput} value={registerInput.password} className="form-control" />
                  <span>{registerInput.error_list.password}</span>
                </div>
                <div className="form-group mb-3">
                  <label>Role User</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="role_user"
                      value="1"
                      checked={registerInput.role_user === "1"}
                      onChange={handleInput}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Admin</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="role_user"
                      value="0"
                      checked={registerInput.role_user === "0"}
                      onChange={handleInput}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Utilisateur simple</label>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>Logo</label>
                  <input type="file" name="logo" onChange={handleInput} className="form-control-file" />
                  <span>{registerInput.error_list.logo}</span>
                </div>
                <div className="form-group mb-3">
                  <label>Nom de l'Entreprise</label>
                  <input type="text" name="nom_entreprise" onChange={handleInput} value={registerInput.nom_entreprise} className="form-control" />
                  <span>{registerInput.error_list.nom_entreprise}</span>
                </div>
                <div className="form-group mb-3">
                  <label>Sexe</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="sexe"
                      value="Homme"
                      checked={registerInput.sexe === "Homme"}
                      onChange={handleInput}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Homme</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="sexe"
                      value="Femme"
                      checked={registerInput.sexe === "Femme"}
                      onChange={handleInput}
                      className="form-check-input"
                    />
                    <label className="form-check-label">Femme</label>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>Photo de Profil</label>
                  <input type="file" name="photo_profil_user" onChange={handleInput} className="form-control-file" />
                  <span>{registerInput.error_list.photo_profil_user}</span>
                </div>
                <div className="form-group mb-3">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default EditUser;
