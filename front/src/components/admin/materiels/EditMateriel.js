import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from "sweetalert";
import axios from "axios";

const EditMateriel = (props) => {

    const [materielInput, setMaterielInput] = useState([]);
    useEffect(()=>{
        const materiel_id = props.match.params.id;
        axios.get(`http://127.0.0.1:8000/api/materiels/${materiel_id}`).then(res=>{
            if(res.data.status === 200){
                setMaterielInput(res.data.materiels);
            }else if(res.data.status === 404){
                swal("Erreur",res.data.message);
            }
        });
    },[props.match.params.id]);

    const handleInput = (e) => {
        e.persist();
        setMaterielInput({ ...materielInput, [e.target.name]: e.target.value });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Ajoutez ici la logique pour soumettre le formulaire
    // };

    return (
        <div>
            <div>
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4>Modification du demande</h4>
                                    <Link to="/admin/materiels" className="btn btn-primary btn-sm float-end">
                                        <UilArrowCircleLeft /> Retour à l'affichage
                                    </Link>
                                </div>
                                <div className="container">
                                    <div className="card-body">
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
                                                        <UilTimes size="20" /> Cancel
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
        </div>
    );
};

export default EditMateriel;
