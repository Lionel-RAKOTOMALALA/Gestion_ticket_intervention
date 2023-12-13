import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import {
  TextField,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button, // Assurez-vous que Button est correctement importé
  Select,
  MenuItem,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

function EditMateriel({ id, isOpen, onClose }) {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };

  const [formData, setFormData] = useState({
    type_materiel: '',
    description_materiel: '',
    image_materiel_url: '',
    error_list: {},
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/materiels/${id}`, { headers })
      .then((res) => {
        if (res.data.status === 200) {
          const materielData = res.data.materiel;
          setFormData({
            type_materiel: materielData.type_materiel,
            description_materiel: materielData.description_materiel,
            image_materiel_url: materielData.image_materiel_url,
            error_list: {},
          });
          setIsLoading(false);
        } else if (res.data.status === 404) {
          setIsLoading(false);
          swal('Erreur', res.data.message, 'error');
          navigate('/admin/materiels');
        }
      });
  }, [id, navigate]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const displayFieldError = (fieldName) => {
    return formData.error_list[fieldName] ? 'is-invalid' : '';
  };

  const updateMateriel = (e) => {
    e.preventDefault();
    // Réinitialisez les messages d'erreur
    setFormData({ ...formData, error_list: {} });

    // Validation côté client
    const errors = {};
    if (formData.type_materiel.trim() === '') {
      errors.type_materiel = 'Le type de matériel est requis';
    }
    // Vous pouvez ajouter d'autres validations pour les nouveaux champs ici

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les dans le formulaire
      const errorFields = Object.keys(errors).join(' et ');
      const errorString = `Les champs "${errorFields}" sont requis`;

      setFormData({ ...formData, error_list: errors });
      swal('Erreurs', errorString, 'error');
    } else {
      // Pas d'erreurs, procéder à la requête Axios
      const data = {
        type_materiel: formData.type_materiel,
        description_materiel: formData.description_materiel,
        image_materiel_url: formData.image_materiel_url,
      };

      axios.put(`http://127.0.0.1:8000/api/materiels/${id}`, data, { headers })
        .then((res) => {
          if (res.data.status === 200) {
            swal('Succès', res.data.message, 'success');
            setIsSuccess(true); // Définir isSuccess à true
            navigate('/Acceuil_client/materiels');
          } else if (res.data.status === 400) {
            setFormData({ ...formData, error_list: res.data.error_list });
          } else if (res.data.status === 404) {
            swal('Erreur', res.data.message, 'error');
            navigate('/admin/materiels');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose(); // Fermer la fenêtre modale après la mise à jour réussie
    }
  }, [isSuccess, onClose]);

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification du matériel</h4>
                <Button onClick={() => navigate('/admin/materiels')} variant="contained" color="primary">
                  Retour à l'affichage
                </Button>
              </div>
              <div className="container">
                <div className="card-body">
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <form onSubmit={updateMateriel}>
                      <FormControl fullWidth sx={{ marginBottom: 3 }}>
                        <TextField
                          id="type_materiel"
                          name="type_materiel"
                          onChange={handleInput}
                          value={formData.type_materiel}
                          variant="outlined"
                          label="Type du matériel"
                          sx={{ marginTop: 1 }}
                          className={displayFieldError('type_materiel')}
                        />
                        {formData.error_list.type_materiel && (
                          <FormHelperText error>
                            {formData.error_list.type_materiel}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <FormControl fullWidth sx={{ marginBottom: 3 }}>
                        <FormLabel htmlFor="description_materiel">Description du matériel</FormLabel>
                        <Input
                          type="text"
                          name="description_materiel"
                          onChange={handleInput}
                          value={formData.description_materiel}
                          sx={{ marginTop: 1 }}
                          className={displayFieldError('description_materiel')}
                        />
                        {formData.error_list.description_materiel && (
                          <FormHelperText error>
                            {formData.error_list.description_materiel}
                          </FormHelperText>
                        )}
                      </FormControl>

                      
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
    </div>
  );
}

export default EditMateriel;
