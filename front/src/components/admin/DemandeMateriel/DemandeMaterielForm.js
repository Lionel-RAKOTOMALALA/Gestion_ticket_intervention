import React, { useEffect, useState } from "react";
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
  Paper
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

const DemandeMaterielForm = () => {
  const userRole = localStorage.getItem("role");
  let linkBack = null;
  if (userRole === "admin") {
    linkBack = "/admin/demande_materiels";
  } else {
    linkBack = "/Acceuil_client/demande_materiels";
  };

  const [demandeurList, setDemandeurList] = useState([]);
  const [materielList, setMaterielList] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/materiels").then((res) => {
      if (res.data.status === 200) {
        setMaterielList(res.data.materiels);
      }
    });
  }, []);

  const [demandeMaterielInput, setDemandeMaterielInput] = useState({
    etat_materiel: "",
    description_probleme: "",
    num_serie: "",
    description_etat_personnalise: "",
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

      const authToken = localStorage.getItem("auth_token");
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
    <Container maxWidth="sm">
    <Box my={5}>
      <Card>
        <CardContent>
        <Paper elevation={0} sx={{ backgroundColor: '#f8f8f8', marginBottom: 5, padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" color="primary.main" >Demande de réparation</Typography>
          <NavLink
            to={linkBack}
            className="btn btn-primary btn-sm float-end"
            sx={{ textDecoration: 'none', color: '#1976D2', '&:hover': { color: '#125699' } }}
          >
            <ArrowCircleLeft /> Retour à l'affichage
          </NavLink>
        </Box>
      </Paper>
          <form onSubmit={submitDemandeMateriel} id="DEMANDE_MATERIEL_FORM">
            {formError && (
              <Box mt={3} mb={3} color="error.main">
                {formError}
              </Box>
            )}
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">État du matériel</FormLabel>
              <RadioGroup
                name="etat_materiel"
                value={demandeMaterielInput.etat_materiel}
                onChange={handleInput}
              >
               <FormControlLabel
                    value="En panne"
                    control={<Radio />}
                    label="En panne"
                  />
                  <FormControlLabel
                    value="Endommagé"
                    control={<Radio />}
                    label="Endommagé"
                  />
                  <FormControlLabel
                    value="Dysfonctionnement"
                    control={<Radio />}
                    label="Dysfonctionnement"
                  />
                  <FormControlLabel
                    value="Obsolete"
                    control={<Radio />}
                    label="Obsolete"
                  />
                  <FormControlLabel
                    value="Maintenance nécessaire"
                    control={<Radio />}
                    label="Maintenance nécessaire"
                  />
                  <FormControlLabel
                    value="Autre"
                    control={<Radio />}
                    label="Autre"
                  />
                </RadioGroup>
                {demandeMaterielInput.etat_materiel === "Autre" && (
                  <Box mt={3}>
                    <TextField
                      type="text"
                      name="description_etat_personnalise"
                      fullWidth
                      variant="outlined"
                      label="Description de l'état personnalisé"
                      onChange={handleInput}
                      value={
                        demandeMaterielInput.description_etat_personnalise
                      }
                    />
                  </Box>
                )}
              </FormControl>
              <Box mt={3}>
                <TextField
                  type="text"
                  name="description_probleme"
                  fullWidth
                  variant="outlined"
                  label="Description du problème"
                  error={
                    demandeMaterielInput.error_list.description_probleme
                      ? true
                      : false
                  }
                  helperText={
                    demandeMaterielInput.error_list.description_probleme
                  }
                  onChange={handleInput}
                  value={demandeMaterielInput.description_probleme}
                />
              </Box>
              <Box mt={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="num_serie">
                    Numéro de série du matériel
                  </InputLabel>
                  <Select
                    name="num_serie"
                    onChange={handleInput}
                    value={demandeMaterielInput.num_serie}
                    label="Numéro de série du matériel"
                    error={
                      demandeMaterielInput.error_list.num_serie ? true : false
                    }
                  >
                    <MenuItem value="">Sélectionner un matériel</MenuItem>
                    {materielList.map((item) => (
                      <MenuItem
                        key={item.num_serie}
                        value={item.num_serie}
                      >
                        {item.type_materiel}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>
                    {demandeMaterielInput.error_list.num_serie}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box mt={3} display="flex">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="medium"
                  endIcon={<CheckCircle />}
                  fullWidth
                >
                  Confirmer
                </Button>
                <NavLink
                  to={linkBack}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={<Clear />}
                    fullWidth
                    style={{ marginLeft: "10px" }}
                  >
                    Annuler
                  </Button>
                </NavLink>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DemandeMaterielForm;
