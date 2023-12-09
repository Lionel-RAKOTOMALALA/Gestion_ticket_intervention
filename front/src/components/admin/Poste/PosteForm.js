import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Typography } from "@mui/material";
import { CheckCircle, Clear } from "@mui/icons-material";
import axios from "axios";
import swal from "sweetalert";

const PosteForm = ({ isOpen, onRequestClose, initialValues }) => {
    const [posteInput, setPosteInput] = useState({
        nom_poste: "",
        error_list: {},
    });
    const [formError, setFormError] = useState("");

    useEffect(() => {
        // Si des valeurs initiales sont fournies, utilisez-les pour initialiser le formulaire
        if (initialValues) {
            setPosteInput({
                nom_poste: initialValues.nom_poste || "", // Remplacez cela par les noms de champ corrects
                error_list: {},
            });
        } else {
            // Si aucune valeur initiale n'est fournie, réinitialisez le formulaire
            setPosteInput({
                nom_poste: "",
                error_list: {},
            });
        }
    }, [isOpen, initialValues]);

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

        setPosteInput({
            ...posteInput,
            error_list: {},
        });
        setFormError("");

        const errors = {};
        if (posteInput.nom_poste === "") {
            errors.nom_poste = "Nom du poste est requis";
        }

        if (Object.keys(errors).length > 0) {
            let errorString = "Les champs suivants sont requis : ";
            errorString += Object.keys(errors).join(", ");

            setPosteInput({
                ...posteInput,
                error_list: errors,
            });
            setFormError(errorString);

            swal("Erreurs", errorString, "error");
        } else {
            const data = {
                nom_poste: posteInput.nom_poste,
            };

            axios
                .post("http://127.0.0.1:8000/api/postes", data)
                .then((res) => {
                    if (res.data.status === 200) {
                        swal("Success", res.data.message, "success");
                        onRequestClose();
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
        <Modal
            open={isOpen}
            onClose={onRequestClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box p={3} sx={{ width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h5" color="primary.main" gutterBottom>
                    Ajouter un poste d'employé
                </Typography>
                <form onSubmit={submitPoste}>
                    {formError && (
                        <Box mt={3} mb={3} color="error.main">
                            {formError}
                        </Box>
                    )}
                    <Box mt={3}>
                        <TextField
                            type="text"
                            name="nom_poste"
                            fullWidth
                            variant="outlined"
                            label="Nom du poste"
                            error={
                                posteInput.error_list.nom_poste ? true : false
                            }
                            helperText={
                                posteInput.error_list.nom_poste
                            }
                            onChange={handleInput}
                            value={posteInput.nom_poste}
                        />
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
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            size="medium"
                            endIcon={<Clear />}
                            style={{ marginLeft: "10px" }}
                            onClick={onRequestClose}
                        >
                            Annuler
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default PosteForm;
