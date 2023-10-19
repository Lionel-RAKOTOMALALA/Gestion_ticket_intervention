import React from 'react';
import './App.css';
import Dashboard from './components/admin/Dashboard';
import Home from './components/FrontEnd/Home';
import Login from './components/FrontEnd/auth/Login';
import Register from './components/FrontEnd/auth/register';
import MaterielForm from './components/admin/materiels/MaterielForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Content_dashboard from './components/admin/Content_dashboards';
import Content_profil from './components/admin/Content_profil';
import EditMateriel from './components/admin/materiels/EditMateriel';
import Materiel from './components/admin/materiels/Materiel';
import MaterielApp from './components/admin/materiels/MaterielApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />}>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
