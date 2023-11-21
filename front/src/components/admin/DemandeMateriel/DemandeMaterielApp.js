import React,{useState,useEffect} from 'react';
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import DemandeMaterielList from './DemandeMaterielList';
import axios from 'axios';

const DemandeMaterielApp = () => {
    

    
    const userRole = localStorage.getItem('role');

    let linkAdd = null;
    if(userRole === 'admin'){
        linkAdd = '/admin/demande/ajout';
    }else{
        linkAdd = '/Acceuil_client/demande_materiels/ajout';

    }
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Demande de Réparation de Matériel</h1>
            <p className="mb-5">
                Ne laissez pas votre appareil endommagé affecter votre quotidien. Notre équipe dévouée est là pour vous aider.
                <br />
                Faites dès maintenant une demande d'intervention pour réparer votre appareil et reprenez le contrôle de votre technologie.
            </p>
            <NavLink to={linkAdd}>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-primary mb-3">
                        <UilPlus size="20" /> Ajouter
                    </button>
                </div>
            </NavLink>
            <DemandeMaterielList />
        </div>
    );
};  

export default DemandeMaterielApp;
