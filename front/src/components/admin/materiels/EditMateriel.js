import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from "sweetalert";
import axios from "axios";
import Loader from './loader';

const EditMateriel = () => {
    const { id } = useParams();
    const [materielInput, setMaterielInput] = useState({
        type_materiel: '',
        etat_materiel: '',
        error_list: { type_materiel: '', etat_materiel: '' },
    });
    const [isLoading, setIsLoading] = useState(true); // État de chargement initialisé à true

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/materiels/${id}`).then(res => {
            if (res.data.status === 200) {
                // Utilisez les données de l'API pour initialiser materielInput
                setMaterielInput({
                    type_materiel: res.data.materiels.type_materiel,
                    etat_materiel: res.data.materiels.etat_materiel,
                    error_list: { type_materiel: '', etat_materiel: '' },
                });
                setIsLoading(false); // Met à jour l'état de chargement une fois les données récupérées
            } else if (res.data.status === 404) {
                setIsLoading(false); // Met à jour l'état de chargement en cas d'erreur
                swal("Erreur", res.data.message);
            }
        });
    }, [id]);

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
                                    {isLoading ? ( // Vérifie si les données sont en cours de chargement
                                        <Loader />
                                    ) : (
                                        <form>
                                            <div className="form-group mb-3">
                                                <label htmlFor="type_materiel">Type du matériel</label>
                                                <input
                                                    type="text"
                                                    name="type_materiel"
                                                    className="form-control"
                                                    onChange={handleInput}
                                                    value={materielInput.type_materiel}
                                                />
                                                <span>
                                                    {materielInput.error_list.type_materiel}
                                                </span>
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="etat_materiel">État du matériel</label>
                                                <input
                                                    type="text"
                                                    name="etat_materiel"
                                                    className="form-control"
                                                    onChange={handleInput}
                                                    value={materielInput.etat_materiel}
                                                />
                                                <span>
                                                    {materielInput.error_list.etat_materiel}
                                                </span>
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
