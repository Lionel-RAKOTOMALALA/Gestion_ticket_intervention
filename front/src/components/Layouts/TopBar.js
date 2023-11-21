import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Skeleton from '@mui/material/Skeleton'; 
import Box from '@mui/material/Box';
import Grid from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// or
 
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Badge from '@mui/material/Badge';
// import MailIcon from '@mui/icons-material/Mail'

const TopBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] =useState(true);
  const gradientBackground = {
    background: 'linear-gradient(180deg, #0369a1, #0369a1)'
  };
  useEffect(() => {
    // Effectuez une requête pour récupérer les données de l'utilisateur
    axios
      .get('http://127.0.0.1:8000/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false)
        console.log(user);
      })
      .catch((error) => {
        setLoading(false);
        // Gérer les erreurs de la requête de récupération des données de l'utilisateur
      });
  }, []);
  
      
  const logoutSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://127.0.0.1:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_name');
          swal('Success', res.data.message, 'success');
          // alert(localStorage.removeItem('auth_token'))
          navigate('/login');
          // alert( localStorage.getItem('auth_token'));
          //  window.location.reload();
          
        } else {
          // Gérer d'autres cas si nécessaire
        }
      })
      .catch((error) => {
        // Gérer les erreurs de la demande de déconnexion ici
      });
  };

  let AuthButtons = null;
  if (localStorage.getItem('auth_token')) {
    // Afficher le menu authentifié
    AuthButtons = (
      <ul className="navbar-nav">
        {/* Nav Item - Alerts */}
        <li className="nav-item dropdown no-arrow mx-1">
          <NavLink className="nav-link dropdown-toggle" to="#" id="alertsDropdown" role="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-bell fa-fw"></i>
            {/* Counter - Alerts */}
            <span className="badge badge-danger badge-counter">3+</span>
          </NavLink>
          {/* Dropdown - Alerts */}
          <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="alertsDropdown">
            <h6 className="dropdown-header">
              Notifications
            </h6>
            <NavLink className="dropdown-item d-flex align-items-center bg-white text-secondary" to="#">
              <div className="mr-3">
                <div className="icon-circle bg-primary">
                  <i className="fas fa-file-alt text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 12, 2019</div>
                <span className="font-weight-bold">A new monthly report is ready to download!</span>
              </div>
            </NavLink>
            <NavLink className="dropdown-item d-flex align-items-center bg-white text-secondary" to="#">
              <div className="mr-3">
                <div className="icon-circle bg-success">
                  <i className="fas fa-donate text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 7, 2019</div>
                $290.29 has been deposited into your account!
              </div>
            </NavLink>
            <NavLink className="dropdown-item d-flex align-items-center bg-white text-secondary" to="#">
              <div className="mr-3">
                <div className="icon-circle bg-warning">
                  <i className="fas fa-exclamation-triangle text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 2, 2019</div>
                Spending Alert: We've noticed unusually high spending for your account.
              </div>
            </NavLink>
            <NavLink className="dropdown-item text-center small text-gray-500 bg-white text-secondary" to="#">Show All Alerts</NavLink>
          </div>
        </li>

        <li className="nav-item dropdown no-arrow">
        <NavLink className="nav-link dropdown-toggle" to="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    {loading ? (
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} /> // Ajoutez une charge de contenu textuel avec une largeur simulée
    ) : (
        <span className="mr-2 d-none d-lg-inline text-white small">{user.username}</span>
    )}
    {loading ? (
        <Skeleton variant="circular" width={40} height={40} /> // Ajoutez une charge de contenu circulaire avec une largeur et une hauteur simulées
    ) : (
        <img
            src={"http://localhost:8000/uploads/users/" + user.photo_profil_user}
            alt="User Photo"
            className="rounded-circle mx-auto"
            style={{
                width: "3rem",
                height: "3rem",
            }}
        />
    )}
          </NavLink>
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in bg-white" aria-labelledby="userDropdown">
            <NavLink className="dropdown-item bg-white text-secondary" to="/admin/profile">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </NavLink>
            <NavLink className="dropdown-item bg-white text-secondary" to="#">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Paramètre
            </NavLink>
            <div className="dropdown-divider white-background"></div>
            <NavLink
              className="dropdown-item bg-white text-secondary"
              to="/"
              onClick={logoutSubmit}
            >
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Se déconnecter
            </NavLink>
          </div>
        </li>
      </ul>
    );
  } else {
    AuthButtons = (
      // Afficher le menu non authentifié
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/">
            Accueil
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/login" tabIndex="-1" aria-disabled="true">
            
            Se connecter
          </NavLink>
        </li>
      </ul>
    );
  }

  const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

  const changeStyle1 = () => {
    if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1");
    } else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-light text-white topbar mb-4 static-top shadow" style={gradientBackground}>
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3" onClick={changeStyle1}>
        <i className="fa fa-bars"></i>
      </button>
      <ul className="navbar-nav ml-auto">
        {AuthButtons}
      </ul>
    </nav>
  );
};

export default TopBar;
