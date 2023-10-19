import React from "react";
import "datatables.net-dt";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";

const Materiel = ({ materiel }) => {
    return (
        <tr>
            <td>{materiel.num_serie}</td>
            <td>{materiel.type_materiel}</td>
            <td>{materiel.etat_materiel}</td>
            <td>
                <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
                    <Link to={`/admin/materiels/${materiel.num_serie}`}>
                        <button className="btn btn-primary btn-sm mr-2">
                            <UilEditAlt /> Modifier
                        </button>
                    </Link>
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