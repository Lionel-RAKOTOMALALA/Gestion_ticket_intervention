// TechnicienForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router';
import {
  Modal,
  Backdrop,
  Fade,
  TextField,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Input,
  FormHelperText,
  Button,
} from '@mui/material';

function TechnicienForm({ isOpen, onClose, initialValues }) {
  const navigate = useNavigate();
  const [technicienInput, setTechnicienInput] = useState({
    username: '',
    email: '',
    password: '',
    sexe: '',
    competence: '',
    error_list: [],
  });

  const [picture, setPicture] = useState(null);

  useEffect(() => {
    // Si initialValues est fourni, mettez à jour les valeurs du formulaire avec les valeurs initiales
    if (initialValues) {
      setTechnicienInput(initialValues);
    }
  }, [isOpen, initialValues]);

  const handleInput = (e) => {
    setTechnicienInput({ ...technicienInput, [e.target.name]: e.target.value });
  };

  const handleFileInput = (e) => {
    setPicture(e.target.files[0]);
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo_profil_user', picture);
    formData.append('username', technicienInput.username);
    formData.append('email', technicienInput.email);
    formData.append('password', technicienInput.password);
    formData.append('sexe', technicienInput.sexe);
    formData.append('competence', technicienInput.competence);

    const authToken = localStorage.getItem('auth_token');

    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then((response) => {
      axios.post('http://127.0.0.1:8000/api/registerTechnicien', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      }).then((res) => {
        if (res.data.status === 200) {
          onClose(); // Fermer le modal après l'ajout
          swal('Success', res.data.message, 'success');
          navigate('/admin/techniciens');
          console.log(res.data.user);
        } else {
          setTechnicienInput({ ...technicienInput, error_list: res.data.validation_errors });
        }
      });
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <div>
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card" style={{ marginTop: '-70px' }}>
                  <div className="card-header">
                    <h4>Ajout de Technicien</h4>
                  </div>
                  <div className="card-body">
                  <form onSubmit={registerSubmit} encType="multipart/form-data">
                  <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <TextField
                      id="username"
                      name="username"
                      onChange={handleInput}
                      value={technicienInput.username}
                      variant="outlined"
                      label="Username"
                      sx={{ marginTop: 1 }}
                    />
                    {technicienInput.error_list.username && (
                      <FormHelperText error>
                        {technicienInput.error_list.username}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <TextField
                      id="email"
                      name="email"
                      type="email"
                      onChange={handleInput}
                      value={technicienInput.email}
                      variant="outlined"
                      label="Email"
                      sx={{ marginTop: 1 }}
                    />
                    {technicienInput.error_list.email && (
                      <FormHelperText error>
                        {technicienInput.error_list.email}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <TextField
                      id="password"
                      name="password"
                      type="password"
                      onChange={handleInput}
                      value={technicienInput.password}
                      variant="outlined"
                      label="Password"
                      sx={{ marginTop: 1 }}
                    />
                    {technicienInput.error_list.password && (
                      <FormHelperText error>
                        {technicienInput.error_list.password}
                      </FormHelperText>
                    )}
                  </FormControl>

                  

                  <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <FormLabel>Sexe</FormLabel>
                    <RadioGroup
                      row
                      name="sexe"
                      value={technicienInput.sexe}
                      onChange={handleInput}
                      sx={{ marginTop: 1 }}
                    >
                      <FormControlLabel
                        value="Homme"
                        control={<Radio />}
                        label="Homme"
                      />
                      <FormControlLabel
                        value="Femme"
                        control={<Radio />}
                        label="Femme"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <FormLabel htmlFor="competence">Compétence</FormLabel>
                    <TextField
                      id="competence"
                      name="competence"
                      onChange={handleInput}
                      value={technicienInput.competence}
                      variant="outlined"
                      label="Compétence"
                      sx={{ marginTop: 1 }}
                    />
                    {technicienInput.error_list.competence && (
                      <FormHelperText error>
                        {technicienInput.error_list.competence}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <FormLabel htmlFor="photo_profil_user">Photo de Profil</FormLabel>
                    <Input
                      type="file"
                      name="photo_profil_user"
                      onChange={handleFileInput}
                      sx={{ marginTop: 1 }}
                    />
                    {technicienInput.error_list.photo_profil_user && (
                      <FormHelperText error>
                        {technicienInput.error_list.photo_profil_user}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 3 }}>
                    Register
                  </Button>
                </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default TechnicienForm;
