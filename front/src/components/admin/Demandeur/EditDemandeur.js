// EditDemandeur.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import {
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
  MenuItem,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function EditDemandeur({ idDemandeur, onClose }) {
  const navigate = useNavigate();
  const { /* Add any necessary route parameters */ } = useParams();

  const [formData, setFormData] = useState({
    id_poste: '',
    username: '',
    role_user: '',
    id_entreprise: '',
    sexe: '',
    photo_profil_user: null,
    error_list: {},
  });

  const [postes, setPostes] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPosteField, setShowPosteField] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [entrepriseList, setEntrepriseList] = useState([]);
  const [posteList, setPosteList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postesResponse, entreprisesResponse, demandeurResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/postes'),
          axios.get('http://127.0.0.1:8000/api/entreprises'),
          axios.get(`http://127.0.0.1:8000/api/demandeurs/${idDemandeur}`),
        ]);

        if (postesResponse.data.status === 200) {
          setPostes(postesResponse.data.postes);
        }

        setEntrepriseList(entreprisesResponse.data.data);
        setPosteList(postesResponse.data.postes);

        setEntreprises(entreprisesResponse.data.data);

        if (demandeurResponse.data.demandeur) {
          const demandeurData = demandeurResponse.data.demandeur;
          setFormData({
            id_poste: demandeurData.id_poste,
            username: demandeurData.nom_utilisateur,
            role_user: demandeurData.role_user,
            id_entreprise: demandeurData.id_entreprise,
            sexe: demandeurData.sexe,
            error_list: {},
          });

          if (demandeurData.id_entreprise === '1') {
            setFormData((prevData) => ({
              ...prevData,
              id_poste: postesResponse.data.postes.length > 0 ? postesResponse.data.postes[0].id_poste : '',
            }));
          }

          setShowPosteField(demandeurData.id_entreprise === '1');
        } else {
          swal('Erreur', 'Demandeur non trouvé', 'error');
          navigate('/admin/demandeurs');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        swal('Erreur', 'Une erreur s\'est produite lors du chargement des données', 'error');
      }
    };

    fetchData();
  }, [idDemandeur, navigate]);

  const handleInput = (e, isDemandeur) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [isDemandeur ? name : name]: value,
    }));
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo_profil_user: selectedFile,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleEntrepriseChange = (e) => {
    const selectedEntreprise = e.target.value;
    setFormData({ ...formData, id_entreprise: selectedEntreprise });
    setShowPosteField(selectedEntreprise === '1');
  };

  const handlePosteChange = (e) => {
    setFormData({ ...formData, id_poste: e.target.value });
  };

  const handleSubmit = async (e, isDemandeur) => {
    e.preventDefault();

    const formDataToSend = {
      photo_profil_user: null,
      id_poste: formData.id_poste,
      username: formData.username,
      role_user: formData.role_user,
      sexe: formData.sexe,
      id_entreprise: formData.id_entreprise,
    };

    axios
      .put(`http://127.0.0.1:8000/api/editDemandeur/${idDemandeur}`, formDataToSend)
      .then((res) => {
        if (res.data.status === 200) {
          onClose();
          swal('Succès', res.data.message, 'success');
        } else if (res.data.status === 400) {
          // setMaterielInput({ ...materielInput, error_list: res.data.error_list });
        } else if (res.data.status === 404) {
          onClose();
          swal('Erreur', res.data.message, 'error');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card" style={{ marginTop: '-50px' }}>
              <div className="card-header">
                <h4>Modification du demandeur</h4>
                <Button onClick={onClose} variant="contained" color="primary">
                  Retour à l'affichage
                </Button>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <TextField
                        id="username"
                        name="username"
                        onChange={(e) => handleInput(e, true)}
                        value={formData.username}
                        variant="outlined"
                        label="Username"
                        sx={{ marginTop: 1 }}
                      />
                      {formData.error_list.username && (
                        <FormHelperText error>
                          {formData.error_list.username}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <FormLabel>Role User</FormLabel>
                      <RadioGroup
                        row
                        name="role_user"
                        value={formData.role_user}
                        onChange={(e) => handleInput(e, true)}
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
                        value={formData.id_entreprise}
                        onChange={handleEntrepriseChange}
                        displayEmpty
                        input={<Input />}
                        sx={{ marginTop: 1 }}
                      >
                        <MenuItem value="" disabled>
                          Sélectionner une entreprise
                        </MenuItem>
                        {entrepriseList.map((entreprise) => (
                          <MenuItem key={entreprise.id_entreprise} value={entreprise.id_entreprise}>
                            {entreprise.nom_entreprise}
                          </MenuItem>
                        ))}
                      </Select>
                      {formData.error_list.id_entreprise && (
                        <FormHelperText error>
                          {formData.error_list.id_entreprise}
                        </FormHelperText>
                      )}
                    </FormControl>

                    {showPosteField && (
                      <FormControl fullWidth sx={{ marginBottom: 3 }}>
                        <FormLabel htmlFor="id_poste">Poste</FormLabel>
                        <Select
                          id="id_poste"
                          name="id_poste"
                          value={formData.id_poste}
                          onChange={handlePosteChange}
                          displayEmpty
                          input={<Input />}
                          sx={{ marginTop: 1 }}
                        >
                          <MenuItem value="" disabled>
                            Sélectionner un poste
                          </MenuItem>
                          {posteList.map((poste) => (
                            <MenuItem key={poste.id_poste} value={poste.id_poste}>
                              {poste.nom_poste}
                            </MenuItem>
                          ))}
                        </Select>
                        {formData.error_list.poste && (
                          <FormHelperText error>
                            {formData.error_list.poste}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}

                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <FormLabel>Sexe</FormLabel>
                      <RadioGroup
                        row
                        name="sexe"
                        value={formData.sexe}
                        onChange={(e) => handleInput(e, true)}
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
                      {formData.error_list.photo_profil_user && (
                        <FormHelperText error>
                          {formData.error_list.photo_profil_user}
                        </FormHelperText>
                      )}
                    </FormControl>

                    {previewImage && (
                      <div>
                        <img
                          src={previewImage}
                          alt="Aperçu de l'image"
                          style={{ maxWidth: '200px', maxHeight: '70px', marginTop: '0rem' }}
                        />
                      </div>
                    )}


                    <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 3 }}>
                      Enregistrer les modifications
                    </Button>
                  </form>

                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDemandeur;
