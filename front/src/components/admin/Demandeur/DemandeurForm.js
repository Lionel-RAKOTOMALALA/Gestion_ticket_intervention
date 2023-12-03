// DemandeurFormModal.jsx
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
  Select,
  MenuItem
} from '@mui/material';

function DemandeurForm({ isOpen, onClose, initialValues }) {
  const navigate = useNavigate();
  const [registerInput, setRegister] = useState({
    username: '',
    email: '',
    password: '',
    role_user: '',
    id_entreprise: '',
    sexe: '',
    error_list: [],
    id_poste: '',
  });

  const [picture, setPicture] = useState(null);
  const [postes, setPostes] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [showPosteField, setShowPosteField] = useState(false);

  useEffect(() => {
    // Fetch the list of postes from the API
    axios.get('http://127.0.0.1:8000/api/postes')
      .then(response => {
        setPostes(response.data.postes);
      })
      .catch(error => {
        console.error('Error fetching postes:', error);
      });

    // Fetch the list of entreprises from the API
    axios.get('http://127.0.0.1:8000/api/entreprises')
      .then(response => {
        setEntreprises(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching entreprises:', error);
      });

    // Si initialValues est fourni, mettez à jour les valeurs du formulaire avec les valeurs initiales
    if (initialValues) {
      setRegister(prevValues => ({ ...prevValues, ...initialValues }));
    } else {
      // Si pas de valeurs initiales, réinitialiser le formulaire
      setRegister({
        username: '',
        email: '',
        password: '',
        role_user: '',
        id_entreprise: '',
        sexe: '',
        error_list: [],
        id_poste: '',
      });
    }
  }, [isOpen, initialValues]);

  const handleInput = (e) => {
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
  };

  const handleFileInput = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleEntrepriseChange = (e) => {
    const selectedEntreprise = e.target.value;
    setRegister({ ...registerInput, id_entreprise: selectedEntreprise });

    // Mettre à jour la visibilité du champ du poste en fonction de l'entreprise sélectionnée
    setShowPosteField(selectedEntreprise === '1');
  };

  const handlePosteChange = (e) => {
    setRegister({ ...registerInput, id_poste: e.target.value });
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo_profil_user', picture);
    formData.append('username', registerInput.username);
    formData.append('email', registerInput.email);
    formData.append('password', registerInput.password);
    formData.append('role_user', registerInput.role_user);
    formData.append('id_entreprise', registerInput.id_entreprise);
    formData.append('sexe', registerInput.sexe);
    
    // Si l'entreprise est "Copefrito", utilisez la valeur sélectionnée dans le champ du poste, sinon, définissez à 2
    formData.append('id_poste', registerInput.id_entreprise === '1' ? registerInput.id_poste : '2');

    const authToken = localStorage.getItem('auth_token');

    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then((response) => {
      axios.post('http://127.0.0.1:8000/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      }).then((res) => {
        if (res.data.status === 200) {
          onClose(); // Fermer le modal après l'ajout
          swal('Success', res.data.message, 'success');
          navigate('/admin/demandeurs');
          console.log(res.data.user);
        } else {
          setRegister({ ...registerInput, error_list: res.data.validation_errors });
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
                <div className="card" style={{marginTop:'-70px'}}>
                  <div className="card-header">
                    <h4>Register</h4>
                  </div>
                  <div className="card-body">
                  <form onSubmit={registerSubmit} encType="multipart/form-data">
                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <TextField
                        id="username"
                        name="username"
                        onChange={handleInput}
                        value={registerInput.username}
                        variant="outlined"
                        label="Username"
                        sx={{ marginTop: 1 }}
                      />
                      {registerInput.error_list.username && (
                        <FormHelperText error>
                          {registerInput.error_list.username}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <TextField
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleInput}
                        value={registerInput.email}
                        variant="outlined"
                        label="Email"
                        sx={{ marginTop: 1 }}
                      />
                      {registerInput.error_list.email && (
                        <FormHelperText error>
                          {registerInput.error_list.email}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <TextField
                        id="password"
                        name="password"
                        type="password"
                        onChange={handleInput}
                        value={registerInput.password}
                        variant="outlined"
                        label="Password"
                        sx={{ marginTop: 1 }}
                      />
                      {registerInput.error_list.password && (
                        <FormHelperText error>
                          {registerInput.error_list.password}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <FormLabel>Role User</FormLabel>
                      <RadioGroup
                        row
                        name="role_user"
                        value={registerInput.role_user}
                        onChange={handleInput}
                        sx={{ marginTop: 1 }}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Admin"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Utilisateur simple"
                        />
                      </RadioGroup>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <FormLabel htmlFor="id_entreprise">Entreprise</FormLabel>
                      <Select
                        id="id_entreprise"
                        name="id_entreprise"
                        value={registerInput.id_entreprise}
                        onChange={handleEntrepriseChange}
                        displayEmpty
                        input={<Input />}
                        sx={{ marginTop: 1 }}
                      >
                        <MenuItem value="" disabled>
                          Select Entreprise
                        </MenuItem>
                        {entreprises.map(entreprise => (
                          <MenuItem key={entreprise.id_entreprise} value={entreprise.id_entreprise}>
                            {entreprise.nom_entreprise}
                          </MenuItem>
                        ))}
                      </Select>
                      {registerInput.error_list.id_entreprise && (
                        <FormHelperText error>
                          {registerInput.error_list.id_entreprise}
                        </FormHelperText>
                      )}
                    </FormControl>

                    {showPosteField && (
                      <FormControl fullWidth sx={{ marginBottom: 3 }}>
                        <FormLabel htmlFor="id_poste">Poste</FormLabel>
                        <Select
                          id="id_poste"
                          name="id_poste"
                          value={registerInput.id_poste}
                          onChange={handlePosteChange}
                          displayEmpty
                          input={<Input />}
                          sx={{ marginTop: 1 }}
                        >
                          <MenuItem value="" disabled>
                            Select Poste
                          </MenuItem>
                          {postes.map(poste => (
                            <MenuItem key={poste.id_poste} value={poste.id_poste}>
                              {poste.nom_poste}
                            </MenuItem>
                          ))}
                        </Select>
                        {registerInput.error_list.poste && (
                          <FormHelperText error>
                            {registerInput.error_list.poste}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}

                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <FormLabel>Sexe</FormLabel>
                      <RadioGroup
                        row
                        name="sexe"
                        value={registerInput.sexe}
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
                      <FormLabel htmlFor="photo_profil_user">Photo de Profil</FormLabel>
                      <Input
                        type="file"
                        name="photo_profil_user"
                        onChange={handleFileInput}
                        sx={{ marginTop: 1 }}
                      />
                      {registerInput.error_list.photo_profil_user && (
                        <FormHelperText error>
                          {registerInput.error_list.photo_profil_user}
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

export default DemandeurForm;
