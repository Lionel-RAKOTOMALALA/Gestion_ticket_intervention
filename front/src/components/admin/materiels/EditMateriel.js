import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from './loader';

const EditMateriel = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [materielInput, setMaterielInput] = useState({
        type_materiel: '',
        etat_materiel: '',
        error_list: {},
    });
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/materiels/${id}`).then((res) => {
            if (res.data.status === 200) {
                setMaterielInput({
                    type_materiel: res.data.materiels.type_materiel,
                    etat_materiel: res.data.materiels.etat_materiel,
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

    const updateMateriel = (e) => {
        e.preventDefault();

        // Réinitialisez les messages d'erreur
        setMaterielInput({
            ...materielInput,
            error_list: {},
        });
        setFormError("");

        // Validation côté client
        const errors = {};
        if (materielInput.type_materiel === "") {
            errors.type_materiel = "Type de matériel est requis";
        }
        if (materielInput.etat_materiel === "") {
            errors.etat_materiel = "État du matériel est requis";
        }

        if (Object.keys(errors).length > 0) {
            // Il y a des erreurs, affichez-les dans le formulaire
            let errorString;
            if (Object.keys(errors).length > 1) {
                const errorFields = Object.keys(errors).map(key => {
                    if (key === "type_materiel") {
                        return "Type de matériel";
                    } else if (key === "etat_materiel") {
                        return "État du matériel";
                    }
                    return key;
                }).join(" et ");
                errorString = `Les champs "${errorFields}" sont requis`;
            } else {
                const errorField = Object.keys(errors)[0];
                if (errorField === "type_materiel") {
                    errorString = "Le champ 'Type de matériel' est requis";
                } else if (errorField === "etat_materiel") {
                    errorString = "Le champ 'État du matériel' est requis";
                }
            }

            setMaterielInput({
                ...materielInput,
                error_list: errors,
            });
            setFormError(errorString);
            swal("Erreurs", errorString, "error");
        } else {
            // Pas d'erreurs, procéder à la requête Axios
            const data = {
                type_materiel: materielInput.type_materiel,
                etat_materiel: materielInput.etat_materiel,
            };
            axios.put(`http://127.0.0.1:8000/api/materiels/${id}`, data)
                .then((res) => {
                    if (res.data.status === 200) {
                        swal('Success', res.data.message, 'success');
                        navigate('/admin/materiels');
                    } else if (res.data.status === 400) {
                        setMaterielInput({
                            ...materielInput,
                            error_list: res.data.errors,
                        });
                    } else if (res.data.status === 404) {
                        swal("Erreur", res.data.message, "error");
                        navigate('/admin/materiels');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleInput = (e) => {
        e.persist();
        setMaterielInput({ ...materielInput, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h4>Modification du demande</h4>
                                <NavLink to="/admin/materiels" className="btn btn-primary btn-sm float-end">
                                    <UilArrowCircleLeft /> Retour à l'affichage
                                </NavLink>
                            </div>
                            <div className="container">
                                <div className="card-body">
                                    {isLoading ? (
                                        <Loader />
                                    ) : (
                                        <form onSubmit={updateMateriel}>
                                            {formError && (
                                                <div className="alert alert-danger mb-3">
                                                    {formError}
                                                </div>
                                            )}
                                            <div className="form-group mb-3">
                                                <label htmlFor="type_materiel">Type du matériel</label>
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
                                                <label htmlFor="etat_materiel">État du matériel</label>
                                                <input
                                                    type="text"
                                                    name="etat_materiel"
                                                    className={`form-control ${materielInput.error_list.etat_materiel ? 'is-invalid' : ''}`}
                                                    onChange={handleInput}
                                                    value={materielInput.etat_materiel}
                                                />
                                                {materielInput.error_list.etat_materiel && (
                                                    <div className="text-danger">
                                                        {materielInput.error_list.etat_materiel}
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
                                                <NavLink to="/admin/materiels" className="col">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-block mb-2"
                                                    >
                                                        <UilTimes size="20" /> Annuler
                                                    </button>
                                                </NavLink>
                                            </div>
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
};

export default EditMateriel;
