import React from "react";
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import PosteList from "./PosteList";

const PosteApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Postes d'employés</h1>
      <p className="mb-5">
        Gérez les postes d'employés de votre entreprise ici.
      </p>
      <NavLink to="/admin/poste/ajout">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter un poste
          </button>
        </div>
      </NavLink>
      <PosteList />
    </div>
  );
};

export default PosteApp;
