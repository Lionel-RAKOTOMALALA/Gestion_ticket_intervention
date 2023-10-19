import React, { Component } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from 'react-router-dom';

class MaterielForm extends Component {
    state = {
        materielInput: {
            type_materiel: "",
            etat_materiel: "",
            error_list: {},
        },
        formError: "",
    };

    handleInput = (e) => {
        e.persist();
        this.setState({
            materielInput: {
                ...this.state.materielInput,
                [e.target.name]: e.target.value,
            },
            formError: "",
        });
    };

    resetForm = () => {
        this.setState({
            materielInput: {
                type_materiel: "",
                etat_materiel: "",
                error_list: {},
            },
            formError: "",
        });
    };

    submitMateriel = (e) => {
        e.preventDefault();

        // Réinitialisez les messages d'erreur
        this.setState({
            materielInput: {
                ...this.state.materielInput,
                error_list: {},
            },
            formError: "",
        });

        // Validation côté client
        const errors = {};
        if (this.state.materielInput.type_materiel === "") {
            errors.type_materiel = "Type de matériel est requis";
        }
        if (this.state.materielInput.etat_materiel === "") {
            errors.etat_materiel = "État du matériel est requis";
        }

        if (Object.keys(errors).length > 0) {
            // Il y a des erreurs, affichez-les avec Swal et dans le formulaire
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
                    errorString = "Le champ 'type de matériel' est requis";
                } else if (errorField === "etat_materiel") {
                    errorString = " Le champ 'état du matériel' est requis";
                }
            }

            this.setState({
                materielInput: {
                    ...this.state.materielInput,
                    error_list: errors,
                },
                formError: errorString,
            });

            swal("Erreurs", errorString, "error");
        } else {
            const data = {
                type_materiel: this.state.materielInput.type_materiel,
                etat_materiel: this.state.materielInput.etat_materiel,
            };

            axios.post("http://127.0.0.1:8000/api/materiels", data)
                .then((res) => {
                    if (res.data.status === 200) {
                        swal("Success", res.data.message, "success");

                        // Réinitialisez les champs du formulaire
                        this.resetForm();
                    } else if (res.data.status === 400) {
                        this.setState({
                            materielInput: {
                                ...this.state.materielInput,
                                error_list: res.data.errors,
                            },
                        });
                    }
                });
        }
    };

    render() {
        return (
            <div>
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4>Demande de réparation</h4>
                                    <NavLink to='/admin/materiels' className='btn btn-primary btn-sm float-end'><UilArrowCircleLeft /> Retour à l'affichage</NavLink>
                                </div>
                                <div className="container">
                                    <div className="card-body">
                                        <form onSubmit={this.submitMateriel} id="MATERIEL_FORM">
                                            {this.state.formError && (
                                                <div className="alert alert-danger mb-3">
                                                    {this.state.formError}
                                                </div>
                                            )}
                                            <div className="form-group mb-3">
                                                <label htmlFor="type_materiel">Type de matériel</label>
                                                <input
                                                    type="text"
                                                    name="type_materiel"
                                                    className={`form-control ${this.state.materielInput.error_list.type_materiel ? 'is-invalid' : ''}`}
                                                    onChange={this.handleInput}
                                                    value={this.state.materielInput.type_materiel}
                                                />
                                                {this.state.materielInput.error_list.type_materiel && (
                                                    <div className="text-danger">
                                                        {this.state.materielInput.error_list.type_materiel}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="etat_materiel">État du matériel</label>
                                                <input
                                                    type="text"
                                                    name="etat_materiel"
                                                    className={`form-control ${this.state.materielInput.error_list.etat_materiel ? 'is-invalid' : ''}`}
                                                    onChange={this.handleInput}
                                                    value={this.state.materielInput.etat_materiel}
                                                />
                                                {this.state.materielInput.error_list.etat_materiel && (
                                                    <div className="text-danger">
                                                        {this.state.materielInput.error_list.etat_materiel}
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MaterielForm;
