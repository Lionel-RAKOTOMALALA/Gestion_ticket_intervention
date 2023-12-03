import React, { useState, useEffect } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from 'react-router-dom';

function MaterielForm() {
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

    const handleFileInput = (e) => {
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
        <div>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h4>Demande de réparation</h4>
                                <NavLink to={linkBack} className='btn btn-primary btn-sm float-end'><UilArrowCircleLeft /> Retour à l'affichage</NavLink>
                            </div>
                            <div className="container">
                                <div className="card-body">
                                    <form onSubmit={submitMateriel} id="MATERIEL_FORM">
                                        {formError && (
                                            <div className="alert alert-danger mb-3">
                                                {formError}
                                            </div>
                                        )}
                                        <div className="form-group mb-3">
                                            <label htmlFor="type_materiel">Type de matériel</label>
                                            <input
                                                type="text"
                                                name="type_materiel"
                                                className={`form-control ${materielInput.error_list.type_materiel ? 'is-invalid' : ''}`}
                                                onChange={handleInput}
                                                value={materielInput.type_materiel}
                                            />
                                            {materielInput.error_list.type_materiel && (
                                                <div className="text-danger">
                                                    {materielInput.error_list.type_materiel}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="description_materiel">Description du problème</label>
                                            <input
                                                type="text"
                                                name="description_materiel"
                                                className={`form-control ${materielInput.error_list.description_materiel ? 'is-invalid' : ''}`}
                                                onChange={handleInput}
                                                value={materielInput.description_materiel}
                                            />
                                            {materielInput.error_list.description_materiel && (
                                                <div className="text-danger">
                                                    {materielInput.error_list.description_materiel}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="image_materiel_url">Image du matériel</label>
                                            <input
                                                type="file"
                                                name="image_materiel_url"
                                                className={`form-control ${materielInput.error_list.image_materiel_url ? 'is-invalid' : ''}`}
                                                onChange={handleFileInput}
                                            />
                                            {materielInput.error_list.image_materiel_url && (
                                                <div className="text-danger">
                                                    {materielInput.error_list.image_materiel_url}
                                                </div>
                                            )}
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-block mb-2"
                                                >
                                                    <UilCheckCircle size="20" /> Confirm
                                                </button>
                                            </div>
                                            <NavLink to={linkBack} className="col">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-block mb-2"
                                                >
                                                    <UilTimes size="20" /> Annuler
                                                </button>
                                            </NavLink>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MaterielForm;
