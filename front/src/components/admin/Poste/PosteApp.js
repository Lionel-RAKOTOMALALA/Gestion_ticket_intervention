import React, { useState } from "react";
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import PosteList from "./PosteList";
import PosteForm from "./PosteForm"; // Importez votre composant PosteForm ici

const PosteApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Postes d'employés</h1>
            <p className="mb-5">
                Gérez les postes d'employés de votre entreprise ici.
            </p>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-primary mb-3" onClick={openModal}>
                    <UilPlus size="20" /> Ajouter un poste
                </button>
            </div>
            <PosteForm isOpen={isModalOpen} onRequestClose={closeModal} initialValues={{ nom_poste: '' }} />
            <PosteList />
        </div>
    );
};

export default PosteApp;
