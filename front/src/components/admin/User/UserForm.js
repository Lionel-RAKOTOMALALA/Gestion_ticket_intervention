import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router';

function Register() {
  const navigate = useNavigate();
  const [registerInput, setRegister] = useState({
    username: '',
    email: '',
    password: '',
    role_user: 1,
    logo: null,
    nom_entreprise: '',
    sexe: '',
    error_list: [],
  });

  const [picture, setPicture] = useState(null);

  const handleInput = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
  };

  const handleFileInput = (e) => {
    setPicture(e.target.files[0]);
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo_profil_user', picture);
    formData.append('username', registerInput.username);
    formData.append('email', registerInput.email);
    formData.append('password', registerInput.password);
    formData.append('role_user', registerInput.role_user);
    formData.append('logo', registerInput.logo); // Assurez-vous que vous avez un champ 'logo' dans votre modèle User
    formData.append('nom_entreprise', registerInput.nom_entreprise);
    formData.append('sexe', registerInput.sexe);

    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then((response) => {
      axios.post('http://127.0.0.1:8000/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        
        if (res.data.status === 200) {
          localStorage.setItem('auth_token', res.data.token);
          localStorage.setItem('auth_name', res.data.username);
          swal('Success', res.data.message, 'success');
          navigate('/admin/users');
          console.log(res.data.user);
        } else {
          setRegister({ ...registerInput, error_list: res.data.validation_errors });
        }
      });
    });
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
                <form onSubmit={registerSubmit} encType="multipart/form-data">
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
                    <label>Nom de l'Entreprise</label>
                    <input type="text" name="nom_entreprise" onChange={handleInput} value={registerInput.nom_entreprise} className="form-control" />
                    <span>{registerInput.error_list.nom_entreprise}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Role User</label>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="role_user"
                        value="1"
                        checked={registerInput.role_user === 1}
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
                        checked={registerInput.role_user === 0}
                        onChange={handleInput}
                        className="form-check-input"
                      />
                      <label className="form-check-label">Utilisateur simple</label>
                    </div>
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
                    <label>Logo de l'entreprise</label>
                    <input type="file" name="logo" onChange={handleFileInput} className="form-control" />
                    <span>{registerInput.error_list.logo}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Photo de Profil</label>
                    <input type="file" name="photo_profil_user" onChange={handleFileInput} className="form-control" />
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
}

export default Register;
