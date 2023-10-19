import React from "react";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import { NavLink } from "react-router-dom";

const Materiel = ({ materiel }) => {
    // Vérifiez si materiel est défini avant d'accéder à ses propriétés
    if (!materiel) {
        return null; // Ou affichez un message d'erreur ou un chargement en cours, selon votre logique.
    }

    return (
        <tr>
            <td>{materiel.num_serie}</td>
            <td>{materiel.type_materiel}</td>
            <td>{materiel.etat_materiel}</td>
            <td>
                <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
                    <NavLink to={`/admin/materiels/${materiel.num_serie}`}>
                        <button className="btn btn-primary btn-sm mr-2">
                            <UilEditAlt /> Modifier
                        </button>
                    </NavLink>
                </div>
                <div style={{ display: 'inline-block' }}>
                    <button className="btn btn-danger btn-sm">
                        <UilTrashAlt /> Supprimer
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default Materiel;
