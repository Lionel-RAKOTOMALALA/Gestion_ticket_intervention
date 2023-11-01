import React, { useEffect, useState } from 'react';
import './App.css';
import swal from 'sweetalert';
import Dashboard from './components/Layouts/Dashboard';
import Home from './components/FrontEnd/Home';
import Login from './components/FrontEnd/auth/Login';
import Register from './components/FrontEnd/auth/register';
import MaterielForm from './components/admin/materiels/MaterielForm';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Content_dashboard from './components/Layouts/Content_dashboards';
import Content_profil from './components/Layouts/Content_profil';
import EditMateriel from './components/admin/materiels/EditMateriel';
import Materiel from './components/admin/materiels/Materiel';
import MaterielApp from './components/admin/materiels/MaterielApp';
import axios from 'axios';
import Technicien from './components/admin/Technicien/Technicien';
import TechnicienForm from './components/admin/Technicien/TechnicienForm';
import TechnicienApp from './components/admin/Technicien/TechnicienApp';
import EditTechnicien from './components/admin/Technicien/EditTechnicien';
import TicketApp from './components/admin/TicketReparation/TicketApp';
import TicketReparationForm from './components/admin/TicketReparation/TicketForm';
import EditTicket from './components/admin/TicketReparation/EditTicket';
import UserApp from './components/admin/User/UserApp';
import UserForm from './components/admin/User/UserForm';
import EditUser from './components/admin/User/EditUser';
import PosteApp from './components/admin/Poste/PosteApp';
import PosteForm from './components/admin/Poste/PosteForm';
import EditPoste from './components/admin/Poste/EditPoste';
import DemandeurApp from './components/admin/Demandeur/DemandeurApp';
import DemandeurForm from './components/admin/Demandeur/DemandeurForm';
import EditDemandeur from './components/admin/Demandeur/EditDemandeur';
import DemandeMaterielApp from './components/admin/DemandeMateriel/DemandeMaterielApp';
import DemandeMaterielForm from './components/admin/DemandeMateriel/DemandeMaterielForm';
import EditDemandeMateriel from './components/admin/DemandeMateriel/EditDemandeMateriel';
import PrivateRoute from './PrivateRoute';
import Page403 from './components/Layouts/403';
import Page404 from './components/Layouts/404';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={localStorage.getItem('auth_token') ? <Navigate to="/admin" /> : <Home />} />
        <Route path="/register" element={localStorage.getItem('auth_token') ? <Navigate to="/admin" /> : <Register />} />
        <Route path="/login" element={localStorage.getItem('auth_token') ? <Navigate to="/admin" /> : <Login />} />
        <Route path="/admin" element={<PrivateRoute />}>
          <Route index element={<Content_dashboard />} />
          <Route path="profile" element={<Content_profil />} />
          <Route path="materiels" element={<MaterielApp />}>
            <Route index element={<Materiel />} />
            <Route path="en-cours" element={<Materiel />} />
            <Route path="repare" element={<Materiel />} />
            <Route path="tous" element={<Materiel />} />
            <Route path="demande_reparation" element={<MaterielForm />} />
            <Route path=":id" element={<EditMateriel />} />
          </Route>
          <Route path="techniciens" element={<TechnicienApp />}>
            <Route index element={<Technicien />} />
            <Route path="ajout" element={<TechnicienForm />} />
            <Route path=":id" element={<EditTechnicien />} />
          </Route>
          <Route path="tickets" element={<TicketApp />} />
          <Route path="ticket/ajout" element={<TicketReparationForm />} />
          <Route path="ticket/edit/:id" element={<EditTicket />} />
          <Route path="users" element={<UserApp />} />
          <Route path="users/ajout" element={<UserForm />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="postes" element={<PosteApp />} />
          <Route path="poste/ajout" element={<PosteForm />} />
          <Route path="poste/edit/:id" element={<EditPoste />} />
          <Route path="demandeurs" element={<DemandeurApp />} />
          <Route path="demandeur/ajout" element={<DemandeurForm />} />
          <Route path="demandeur/edit/:id" element={<EditDemandeur />} />
          <Route path="demande_materiels" element={<DemandeMaterielApp />} />
          <Route path="demande/ajout" element={<DemandeMaterielForm />} />
          <Route path="demande/edit/:id" element={<EditDemandeMateriel />} />
        </Route>
          <Route path="403" element={<Page403 />} />
          <Route path="404" element={<Page404 />} />
          <Route path="*" element={<Page404 />} />
          <Route path="/Acceuil_client" element={<Dashboard/>}>
          <Route index element={<Content_dashboard />} />
          <Route path="profile" element={<Content_profil />} />
          <Route path="materiels" element={<MaterielApp />}>
            <Route index element={<Materiel />} />
            <Route path="en-cours" element={<Materiel />} />
            <Route path="repare" element={<Materiel />} />
            <Route path="tous" element={<Materiel />} />
            <Route path="demande_reparation" element={<MaterielForm />} />
            <Route path=":id" element={<EditMateriel />} />
          </Route>
          <Route path="techniciens" element={<TechnicienApp />}>
            <Route index element={<Technicien />} />
            <Route path="ajout" element={<TechnicienForm />} />
            <Route path=":id" element={<EditTechnicien />} />
          </Route>
          <Route path="tickets" element={<TicketApp />} />
          <Route path="ticket/ajout" element={<TicketReparationForm />} />
          <Route path="ticket/edit/:id" element={<EditTicket />} />
          <Route path="users" element={<UserApp />} />
          <Route path="users/ajout" element={<UserForm />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="postes" element={<PosteApp />} />
          <Route path="poste/ajout" element={<PosteForm />} />
          <Route path="poste/edit/:id" element={<EditPoste />} />
          <Route path="demandeurs" element={<DemandeurApp />} />
          <Route path="demandeur/ajout" element={<DemandeurForm />} />
          <Route path="demandeur/edit/:id" element={<EditDemandeur />} />
          <Route path="demande_materiels" element={<DemandeMaterielApp />} />
          <Route path="demande/ajout" element={<DemandeMaterielForm />} />
          <Route path="demande/edit/:id" element={<EditDemandeMateriel />} />
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
