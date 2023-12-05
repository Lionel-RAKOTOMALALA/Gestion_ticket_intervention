import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  Input,
  FormControl,
  FormLabel,
  FormHelperText
} from "@mui/material";
import {
  CheckCircle,
  Clear,
  ArrowCircleLeft,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const MaterielForm = () => {
    const [demandeurVerifCount, setDemandeurVerifCount] = useState(null);
    const [technicienVerifCount, setTechnicienVerifCount] = useState(null);
    const [id_demandeur, setidDemandeur] = useState(null);
    const [materielInput, setMaterielInput] = useState({
        type_materiel: "",
        description_materiel: "",
        image_materiel_url: null,
        error_list: {},
    });
    const [formError, setFormError] = useState("");
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const authToken = localStorage.getItem('auth_token');

        if (authToken) {
            axios.get("http://127.0.0.1:8000/api/countDemandeurForAuthenticatedUser", {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            })
                .then(response => {
                    setDemandeurVerifCount(response.data.demandeur_count);
                    console.log(`Nombre d'apparition dans demandeurs : ${response.data.demandeur_count}`);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du nombre de demandeurs:', error);
                });

            axios.get("http://127.0.0.1:8000/api/showIdDemandeur", {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            })
                .then(response => {
                    setidDemandeur(response.data.id_demandeur);
                    console.log(`id_demandeur : ${response.data.id_demandeur}`);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération de l\'id_demandeur:', error);
                });

            axios.get("http://127.0.0.1:8000/api/countTechnicienForAuthenticatedUser", {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            })
                .then(response => {
                    setTechnicienVerifCount(response.data.technicien_count);
                    console.log(`Nombre d'apparition dans technicien : ${response.data.technicien_count}`);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du nombre de demandeurs:', error);
                });

            if (localStorage.getItem('role') === 'admin') {
                axios.get(`http://127.0.0.1:8000/api/newUserSpecialisation`).then((res) => {
                    if (res.data.status === 200) {
                        setUserList(res.data.users);
                    }
                });
            }
        }
    }, []);

    const userRole = localStorage.getItem('role');
    let linkBack = userRole === 'admin' ? '/admin/materiels' : '/Acceuil_client/materiels';

    const handleImageInput = (e) => {
        const file = e.target.files[0];
        setMaterielInput({
            ...materielInput,
            image_materiel_url: file,
        });
    };

    const handleInput = (e) => {
        e.persist();
        setMaterielInput({
            ...materielInput,
            [e.target.name]: e.target.value,
        });
        setFormError("");
    };

    const resetForm = () => {
        setMaterielInput({
            type_materiel: "",
            description_materiel: "",
            image_materiel_url: null,
            error_list: {},
        });
        setFormError("");
    };

    const submitMateriel = (e) => {
        e.preventDefault();
        setMaterielInput({
            ...materielInput,
            error_list: {},
        });
        setFormError("");

        const errors = {};
        if (materielInput.type_materiel === "") {
            errors.type_materiel = "Type de matériel est requis";
        }
        if (materielInput.description_materiel === "") {
            errors.description_materiel = "Description du matériel est requis";
        }

        if (Object.keys(errors).length > 0) {
            let errorString = "Les champs suivants sont requis : ";
            errorString += Object.keys(errors).join(", ");

            setMaterielInput({
                ...materielInput,
                error_list: errors,
            });
            setFormError(errorString);

            swal("Erreurs", errorString, "error");
        } else {
            const formData = new FormData();
            formData.append('type_materiel', materielInput.type_materiel);
            formData.append('description_materiel', materielInput.description_materiel);
            formData.append('image_materiel_url', materielInput.image_materiel_url);
            if (userRole === 'userSimple' && demandeurVerifCount > 0) {
                formData.append('id_demandeur', id_demandeur);
            }
            const authToken = localStorage.getItem('auth_token');
            
            axios.post("http://127.0.0.1:8000/api/materiels", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`, 
                },
            }).then((res) => {
                if (res.data.status === 200) {
                    swal("Success", res.data.message, "success");
                    resetForm();
                } else if (res.data.status === 400) {
                    setMaterielInput({
                        ...materielInput,
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
                                <Typography variant="h5" color="primary.main" >Ajouter un matériel</Typography>
                                <NavLink
                                    to={linkBack}
                                    className="btn btn-primary btn-sm float-end"
                                    sx={{ textDecoration: 'none', color: '#1976D2', '&:hover': { color: '#125699' } }}
                                >
                                    <ArrowCircleLeft /> Retour à l'affichage
                                </NavLink>
                            </Box>
                        </Paper>
                        <form onSubmit={submitMateriel} encType="multipart/form-data">
                            {formError && (
                                <Box mt={3} mb={3} color="error.main">
                                    {formError}
                                </Box>
                            )}
                            <Box mt={3}>
                                <TextField
                                    type="text"
                                    name="type_materiel"
                                    fullWidth
                                    variant="outlined"
                                    label="Type de matériel"
                                    error={
                                        materielInput.error_list.type_materiel ? true : false
                                    }
                                    helperText={
                                        materielInput.error_list.type_materiel
                                    }
                                    onChange={handleInput}
                                    value={materielInput.type_materiel}
                                />
                            </Box>
                            <Box mt={3}>
                                <TextField
                                    type="text"
                                    name="description_materiel"
                                    fullWidth
                                    variant="outlined"
                                    label="description_materiel"
                                    error={
                                        materielInput.error_list.description_materiel ? true : false
                                    }
                                    helperText={
                                        materielInput.error_list.description_materiel
                                    }
                                    onChange={handleInput}
                                    value={materielInput.description_materiel}
                                />
                            </Box>
                            <Box mt={3}>
                                <FormControl fullWidth sx={{ marginBottom: 3 }}>
                                    <FormLabel htmlFor="image_materiel_url">Image du matériel</FormLabel>
                                    <Input
                                        type="file"
                                        name="image_materiel_url"
                                        onChange={handleImageInput}
                                        sx={{ marginTop: 1 }}
                                    />
                                    {materielInput.error_list.image_materiel_url && (
                                        <FormHelperText error>
                                            {materielInput.error_list.image_materiel_url}
                                        </FormHelperText>
                                    )}
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
                                    Ajouter
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

export default MaterielForm;
