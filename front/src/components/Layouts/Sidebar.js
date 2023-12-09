import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import SvgIcon from '@mui/material/SvgIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ComputerIcon from '@mui/icons-material/Computer';
import HelpIcon from '@mui/icons-material/Help';
import EventIcon from '@mui/icons-material/Event';


function Sidebar() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
  const [demandeurVerifCount, setDemandeurVerifCount] = useState(null);
  const [technicienVerifCount, setTechnicienVerifCount] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      axios
        .get('http://127.0.0.1:8000/api/countDemandeurForAuthenticatedUser', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        })
        .then(response => {
          setDemandeurVerifCount(response.data.demandeur_count);
          setLoading(false);
          localStorage.setItem('demandeurExist', response.data.demandeur_count);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du nombre de demandeurs :', error);
        });

      axios
        .get('http://127.0.0.1:8000/api/countTechnicienForAuthenticatedUser', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        })
        .then(response => {
          setTechnicienVerifCount(response.data.technicien_count);
          setLoading(false);
          localStorage.setItem('technicienExist', response.data.technicien_count);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du nombre de demandeurs :', error);
        });

      axios
        .get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        })
        .then(res => {
          setUser(res.data.user);
        })
        .catch(error => {
          // Gérer les erreurs de la requête de récupération des données de l'utilisateur
        });
    }
  }, []);

  const changeStyle = () => {
    setStyle(style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" ? "navbar-nav bg-gradient-primary sidebar sidebarDark accordion toggled" : "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
  };

  const location = useLocation();
  const gradientBackground = {
    color:'white',
    background: 'linear-gradient(180deg, #0369a1,#082f49)',
  };

  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const isUserSimple = userRole === 'userSimple';

  const linkRoot = isAdmin ? '/admin' : isUserSimple ? '/Acceuil_client' : '';

  let menuItems = null;

  if (isAdmin) {
    if (demandeurVerifCount === 1 || technicienVerifCount === 1) {
      menuItems = (
        <>
          <li className="nav-item">
            <div className="nav-link collapsed"
              data-toggle="collapse"
              data-target="#collapseMatériels"
              aria-expanded="true"
              aria-controls="collapseMatériels"
              style={{ cursor: 'pointer' }}
            >
              <SvgIcon component={ComputerIcon} />
              <span>Utilisateur</span>
            </div>
            <div id="collapseMatériels" className="collapse" aria-labelledby="headingMatériels" data-parent="#accordionSidebar">
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Listes des Utilisateurs</h6>
                <NavLink className="collapse-item" to={`${linkRoot}/demandeurs`}>
                  Demandeurs
                </NavLink>
                <NavLink className="collapse-item" to={`${linkRoot}/techniciens`}>
                  Techniciens
                </NavLink>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/postes`}>
              <SvgIcon component={AssignmentIndIcon} />
              <span>Postes</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/demande_materiels`}>
            <AssignmentIndIcon/>
              <span>Demande de réparation</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/tickets`}>
              <SvgIcon component={EventIcon} />
              <span>Tickets de réparation</span>
            </NavLink>
          </li>
        </>
      );
    } else if (demandeurVerifCount === 1) {
      menuItems = (
        <>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/demande_materiels`}>
            <AssignmentIndIcon/>
              <span>Demande de réparation</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <div className="nav-link collapsed"
              data-toggle="collapse"
              data-target="#collapseMatériels"
              aria-expanded="true"
              aria-controls="collapseMatériels"
              style={{ cursor: 'pointer' }}
            >
              <SvgIcon component={ComputerIcon} />
              <span>Matériels</span>
            </div>
            <div id="collapseMatériels" className="collapse" aria-labelledby="headingMatériels" data-parent="#accordionSidebar">
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Listes des Matériels</h6>
                <NavLink className="collapse-item" to={`${linkRoot}/materiels/en-cours`}>
                  En cours de réparation
                </NavLink>
                <NavLink className="collapse-item" to={`${linkRoot}/materiels/repare`}>
                  Réparé
                </NavLink>
                <NavLink className="collapse-item" to={`${linkRoot}/materiels`}>
                  Tous
                </NavLink>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/tickets`}>
              <SvgIcon component={EventIcon} />
              <span>Tickets de réparation</span>
            </NavLink>
          </li>
        </>
      );
    } else if (demandeurVerifCount === 0) {
      menuItems = (
        <>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/demandeurs`}>
              <SvgIcon component={ComputerIcon} />
              <span>Demandeur</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/users`}>
              <SvgIcon component={ComputerIcon} />
              <span>Utilisateur</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/postes`}>
              <SvgIcon component={AssignmentIndIcon} />
              <span>Postes</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/techniciens`}>
              <SvgIcon component={ComputerIcon} />
              <span>Technicien</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/demande_materiels`}>
            <AssignmentIndIcon/>
              <span>Demande de réparation</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/tickets`}>
              <SvgIcon component={EventIcon} />
              <span>Tickets de réparation</span>
            </NavLink>
          </li>
        </>
      );
    }
  } else if (isUserSimple) {
    if (demandeurVerifCount === 1) {
      menuItems = (
        <>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/demande_materiels`}>
            <AssignmentIndIcon/>
              <span>Demande de réparation</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <div className="nav-link collapsed"
              data-toggle="collapse"
              data-target="#collapseMatériels"
              aria-expanded="true"
              aria-controls="collapseMatériels"
              style={{ cursor: 'pointer' }}
            >
              <SvgIcon component={ComputerIcon} />
              <span>Matériels</span>
            </div>
            <div id="collapseMatériels" className="collapse" aria-labelledby="headingMatériels" data-parent="#accordionSidebar">
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Listes des Matériels</h6>
                <NavLink className="collapse-item" to={`${linkRoot}/materiels/en-cours`}>
                  En cours de réparation
                </NavLink>
                <NavLink className="collapse-item" to={`${linkRoot}/materiels/repare`}>
                  Réparé
                </NavLink>
                <NavLink className="collapse-item" to={`${linkRoot}/materiels`}>
                  Tous
                </NavLink>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/tickets`}>
              <SvgIcon component={EventIcon} />
              <span>Tickets de réparation</span>
            </NavLink>
          </li>
        </>
      );
    } else if (technicienVerifCount === 1) {
      menuItems = (
        <>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/demande_materiels`}>
            <AssignmentIndIcon/>
              <span>Demande de réparation</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/tickets`}>
              <SvgIcon component={EventIcon} />
              <span>Tickets de réparation</span>
            </NavLink>
          </li>
        </>
      );
    }
  }

  return (
    <ul className={style} id="accordionSidebar" style={gradientBackground}>
      <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to={location.pathname}>
        <div className="sidebar-brand-icon rotate-n-15">
          <SvgIcon component={ComputerIcon} />
        </div>
        <div className="sidebar-brand-text mx-3">{user.nom_entreprise}</div>
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
        </div>
      </NavLink>

      <hr className="sidebar-divider my-0" />

      <li className="nav-item">
        {loading ? (
          <Skeleton variant="text" width={150} height={40}/>
          ) : (
            <NavLink className="nav-link" to={linkRoot || '/'} onClick={changeStyle}>
              <SvgIcon component={DashboardIcon} />
              <span>Dashboard</span>
            </NavLink>
          )}
        </li>
  
        {/* Display Menu Items based on user role and verification count */}
        {menuItems}
  
        <hr className="sidebar-divider d-none d-md-block" />
  
        
      </ul>
    );
  }
  
  export default Sidebar;
  