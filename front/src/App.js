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
        <Route index element={<Content_dashboard />} /> {/* Utilisez l'index pour /admin/dashboard */}
          <Route path="profile" element={<Content_profil />} />
          <Route
            path="materiels"
            element={<MaterielApp />}
          />
          <Route path="materiels/en-cours" element={<Materiel />} />
          <Route path="materiels/repare" element={<Materiel />} />
          <Route path="materiels/tous" element={<Materiel />} />
          <Route path="materiels/demande_reparation" element={<MaterielForm />} />
          <Route path="materiels/:id" element={<EditMateriel />} />
          <Route path='techniciens' element={<TechnicienApp/>}/>
          <Route path='/admin/technicien/ajout' element={<TechnicienForm/>}/>
          <Route path='/admin/techniciens/:id' element={<EditTechnicien/>}/>
          <Route path='/admin/tickets' element={<TicketApp/>}/>
          <Route path='/admin/ticket/ajout' element={<TicketReparationForm/>}/>
          <Route path='/admin/ticket/edit/:id' element={<EditTicket/>}/>
          <Route path='/admin/users' element={<UserApp/>}/>
          <Route path='/admin/users/ajout' element={<UserForm/>}/>
          <Route path='/admin/users/edit/:id' element={<EditUser/>}/>
          <Route path='/admin/postes' element={<PosteApp/>}/>
          <Route path='/admin/poste/ajout' element={<PosteForm/>}/>
          <Route path='/admin/poste/edit/:id' element={<EditPoste/>}/>
          <Route path='/admin/demandeurs' element={<DemandeurApp/>}/>
          <Route path='/admin/demandeur/ajout' element={<DemandeurForm/>}/>
          <Route path='/admin/demandeur/edit/:id' element={<EditDemandeur/>}/>
          <Route path='/admin/demande_materiels' element={<DemandeMaterielApp/>}/>
          <Route path='/admin/demande/ajout' element={<DemandeMaterielForm/>}/>
          <Route path='/admin/demande/edit/:id' element={<EditDemandeMateriel/>}/>
        </Route>
          <Route path="403" element={<Page403 />} />
          <Route path="404" element={<Page404 />} />
          <Route path="*" element={<Page404 />} />
          <Route path="/Acceuil_client" element={<Dashboard/>}>
          <Route index element={<Content_dashboard />} /> {/* Utilisez l'index pour /admin/dashboard */}
          <Route path="profile" element={<Content_profil />} />
          <Route
            path="materiels"
            element={<MaterielApp />}
          />
          <Route path="materiels/en-cours" element={<Materiel />} />
          <Route path="materiels/repare" element={<Materiel />} />
          <Route path="materiels/tous" element={<Materiel />} />
          <Route path="materiels/demande_reparation" element={<MaterielForm />} />
          <Route path="materiels/:id" element={<EditMateriel />} />
          <Route path='techniciens' element={<TechnicienApp/>}/>
          <Route path='/Acceuil_client/technicien/ajout' element={<TechnicienForm/>}/>
          <Route path='/Acceuil_client/techniciens/:id' element={<EditTechnicien/>}/>
          <Route path='/Acceuil_client/tickets' element={<TicketApp/>}/>
          <Route path='/Acceuil_client/ticket/ajout' element={<TicketReparationForm/>}/>
          <Route path='/Acceuil_client/ticket/edit/:id' element={<EditTicket/>}/>
          <Route path='/Acceuil_client/users' element={<UserApp/>}/>
          <Route path='/Acceuil_client/users/ajout' element={<UserForm/>}/>
          <Route path='/Acceuil_client/users/edit/:id' element={<EditUser/>}/>
          <Route path='/Acceuil_client/postes' element={<PosteApp/>}/>
          <Route path='/Acceuil_client/poste/ajout' element={<PosteForm/>}/>
          <Route path='/Acceuil_client/poste/edit/:id' element={<EditPoste/>}/>
          <Route path='/Acceuil_client/demandeurs' element={<DemandeurApp/>}/>
          <Route path='/Acceuil_client/demandeur/ajout' element={<DemandeurForm/>}/>
          <Route path='/Acceuil_client/demandeur/edit/:id' element={<EditDemandeur/>}/>
          <Route path='/Acceuil_client/demande_materiels' element={<DemandeMaterielApp/>}/>
          <Route path='/Acceuil_client/demande/ajout' element={<DemandeMaterielForm/>}/>
          <Route path='/Acceuil_client/demande/edit/:id' element={<EditDemandeMateriel/>}/>
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
