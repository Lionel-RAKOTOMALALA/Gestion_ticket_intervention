import React, { Component } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { Link } from 'react-router-dom';

class MaterielForm extends Component {
    state = {
        materielInput: {
            type_materiel: "",
            etat_materiel: "",
            error_list: {},
        },
    };

    handleInput = (e) => {
        e.persist();
        this.setState({
            materielInput: {
                ...this.state.materielInput,
                [e.target.name]: e.target.value,
            },
        });
    };

    submitMateriel = (e) => {
        e.preventDefault();

        // Validation côté client
        if (this.state.materielInput.type_materiel === "" || this.state.materielInput.etat_materiel === "") {
            // Affichez un message d'erreur ou empêchez la soumission
            return;
        }

        const data = {
            type_materiel: this.state.materielInput.type_materiel,
            etat_materiel: this.state.materielInput.etat_materiel,
        };

        axios.post("http://127.0.0.1:8000/api/materiels", data)
            .then((res) => {
                if (res.data.status === 200) {
                    swal("Success", res.data.message, "success");
                    document.getElementById("MATERIEL_FORM").reset();
                } else if (res.data.status === 400) {
                    this.setState({
                        materielInput: {
                            ...this.state.materielInput,
                            error_list: res.data.errors,
                        },
                    });
                }
            });
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
                                    <Link to='/admin/materiels' className='btn btn-primary btn-sm float-end'><UilArrowCircleLeft /> Retour à l'affichage</Link>
                                </div>
                                <div className="container">
                                    <div className="card-body">
                                        <form onSubmit={this.submitMateriel} id="MATERIEL_FORM">
                                            <div className="form-group mb-3">
                                                <label htmlFor="type_materiel">Type du matériel</label>
                                                <input
                                                    type="text"
                                                    name="type_materiel"
                                                    className="form-control"
                                                    onChange={this.handleInput}
                                                    value={this.state.materielInput.type_materiel}
                                                />
                                                {this.state.materielInput.error_list.type_materiel && (
                                                    <span className="text-danger">
                                                        {this.state.materielInput.error_list.type_materiel}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="etat_materiel">État du matériel</label>
                                                <input
                                                    type="text"
                                                    name="etat_materiel"
                                                    className="form-control"
                                                    onChange={this.handleInput}
                                                    value={this.state.materielInput.etat_materiel}
                                                />
                                                {this.state.materielInput.error_list.etat_materiel && (
                                                    <span className="text-danger">
                                                        {this.state.materielInput.error_list.etat_materiel}
                                                    </span>
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
                                                <div className="col">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-block mb-2"
                                                    >
                                                        <UilTimes size="20" /> Annuler
                                                    </button>
                                                </div>
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
