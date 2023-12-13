import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
  Container,
  Paper,
  Modal,
} from "@mui/material";
import {
  CheckCircle,
  Clear,
  ArrowCircleLeft,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { InputLabel, FormHelperText } from "@mui/material";

import axios from "axios";
import swal from "sweetalert";

const DemandeMaterielForm = ({ open, onClose }) => {
  const userRole = localStorage.getItem("role");
  let linkBack = null;
  if (userRole === "admin") {
    linkBack = "/admin/demande_materiels";
  } else {
    linkBack = "/Acceuil_client/demande_materiels";
  };

  const [demandeurList, setDemandeurList] = useState([]);
  const [materielList, setMaterielList] = useState([]);
  const authToken = localStorage.getItem("auth_token");


  useEffect(() => { 
    axios
      .get('http://127.0.0.1:8000/api/listeMateriel', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          setMaterielList(res.data.materiels);
        }
      })
      .catch((error) => {
        console.error("Error fetching materiel list: ", error);
      });
  }, []);
  console.log(materielList);

  const [demandeMaterielInput, setDemandeMaterielInput] = useState({
    etat_materiel: "",
    description_probleme: "",
    num_serie: "",
    description_etat_personnalise: "",
    error_list: {},
  });

  const [formError, setFormError] = useState("");
  
  const handleInput = (e) => {
    setDemandeMaterielInput({
      ...demandeMaterielInput,
      [e.target.name]: e.target.value,
    });
    console.log("Numéro de série sélectionné :", e.target.value);
    setFormError("");
  };
  const handleClose = () => {
    resetForm(); // Réinitialise le formulaire lorsque le modal est fermé
    onClose(); // Ferme le modal
  };
  

  const resetForm = () => {
    setDemandeMaterielInput({
      etat_materiel: "",
      description_probleme: "",
      num_serie: "",
      description_etat_personnalise: "",
      error_list: {},
    });
    setFormError("");
  };

  const submitDemandeMateriel = (e) => {
    e.preventDefault();

    setDemandeMaterielInput({
      ...demandeMaterielInput,
      error_list: {},
    });
    setFormError("");

    const errors = {};
    if (demandeMaterielInput.etat_materiel === "") {
      errors.etat_materiel = "L'état du matériel est requis";
    }
    if (demandeMaterielInput.description_probleme === "") {
      errors.description_probleme =
        "La description du problème est requise";
    }
    if (demandeMaterielInput.num_serie === "") {
      errors.num_serie = "Le numéro de série est requis";
    }

    if (Object.keys(errors).length > 0) {
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
        etatMaterielValue =
          demandeMaterielInput.description_etat_personnalise;
      }

      const data = {
        etat_materiel: etatMaterielValue,
        status: "En attente de validation",
        description_probleme: demandeMaterielInput.description_probleme,
        num_serie: demandeMaterielInput.num_serie,
      };
      console.log(data);
      axios
        .post("http://127.0.0.1:8000/api/demande_materiel", data, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            resetForm();
            onClose(); // Fermer la modal après la soumission réussie
          } else if (res.data.status === 400) {
            const errorString = res.data.message;
            setFormError(errorString);

            swal("Erreurs", errorString, "error");
          }
        })
        .catch((error) => {
          console.error("Error creating demande materiel: ", error);
          const errorString = "Une erreur s'est produite lors de la création de la demande de matériel.";
          setFormError(errorString);
          swal("Erreur", errorString, "error");
        });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ backgroundColor: '#f8f8f8', marginBottom: 5, padding: 3 }}>
          <Box mb={3}>
            <Typography variant="h4" align="center">
              Nouvelle demande de matériel
            </Typography>
          </Box>
          <form onSubmit={submitDemandeMateriel}>
            <Box mb={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="etat_materiel_label">État du matériel</InputLabel>
                <Select
                  labelId="etat_materiel_label"
                  id="etat_materiel"
                  name="etat_materiel"
                  label="État du matériel"
                  onChange={handleInput}
                  value={demandeMaterielInput.etat_materiel}
                  error={!!demandeMaterielInput.error_list.etat_materiel}
                >
                  <MenuItem value="">
                    <em>Choisir l'état du matériel</em>
                  </MenuItem>
                  <MenuItem value="Bon état">Bon état</MenuItem>
                  <MenuItem value="Mauvais état">Mauvais état</MenuItem>
                  <MenuItem value="Autre">Autre</MenuItem>
                </Select>
                <FormHelperText error>
                  {demandeMaterielInput.error_list.etat_materiel}
                </FormHelperText>
              </FormControl>
            </Box>
            {demandeMaterielInput.etat_materiel === "Autre" && (
              <Box mb={3}>
                <TextField
                  fullWidth
                  id="description_etat_personnalise"
                  name="description_etat_personnalise"
                  label="Description de l'état personnalisé"
                  variant="outlined"
                  multiline
                  rows={4}
                  onChange={handleInput}
                  value={demandeMaterielInput.description_etat_personnalise}
                  error={!!demandeMaterielInput.error_list.description_etat_personnalise}
                  helperText={demandeMaterielInput.error_list.description_etat_personnalise}
                />
              </Box>
            )}
            <Box mb={3}>
              <TextField
                fullWidth
                id="description_probleme"
                name="description_probleme"
                label="Description du problème"
                variant="outlined"
                multiline
                rows={4}
                onChange={handleInput}
                value={demandeMaterielInput.description_probleme}
                error={!!demandeMaterielInput.error_list.description_probleme}
                helperText={demandeMaterielInput.error_list.description_probleme}
              />
            </Box>
            <Box mb={3}>
            <FormControl fullWidth variant="outlined">
  <InputLabel id="num_serie_label">Numéro de série</InputLabel>
  <Select
    labelId="num_serie_label"
    id="num_serie"
    name="num_serie"
    label="Numéro de série"
    onChange={handleInput}
    value={demandeMaterielInput.num_serie}
    error={!!demandeMaterielInput.error_list.num_serie}
  >
    <MenuItem value="">
      <em>Choisir le matériel à réparer</em>
    </MenuItem>
    {materielList.map((materiel) => (
      <MenuItem key={materiel.num_serie} value={materiel.num_serie}>
        {materiel.type_materiel}
      </MenuItem>
    ))}
  </Select>
  <FormHelperText error>
    {demandeMaterielInput.error_list.num_serie}
  </FormHelperText>
</FormControl>

            </Box>
            <Box display="flex" justifyContent="space-between">
            <Button
  variant="contained"
  color="secondary"
  type="button"
  startIcon={<ArrowCircleLeft />}
  onClick={handleClose}  // Utilise la fonction handleClose
>
  Retour
</Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                endIcon={<CheckCircle />}
              >
                Soumettre la demande
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Modal>
  );
};

export default DemandeMaterielForm;
