import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UilUserCircle, UilTicket } from '@iconscout/react-unicons';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton'; 


function Sidebar() {
    
  const [user, setUser] = useState({});
  const [loading, setLoading] =useState(true);
    const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");



    const [demandeurVerifCount, setDemandeurVerifCount] = useState(null);
    const [technicienVerifCount, setTechnicienVerifCount] = useState(null);

    useEffect(() => {
        // Récupérez le token d'authentification depuis le localStorage
        const authToken = localStorage.getItem('auth_token');

        // Assurez-vous que le token est disponible
        if (authToken) {
            // Utilisez Axios pour faire une requête à la route API
            axios.get("http://127.0.0.1:8000/api/countDemandeurForAuthenticatedUser", {
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Ajoutez le token Bearer
                }
            })
            .then(response => {
                setDemandeurVerifCount(response.data.demandeur_count);
                setLoading(false)
                // Affichez la valeur dans une alerte
                // alert(`Nombre d'apparition dans demandeurs : ${response.data.demandeur_count}`);
                console.log(`Nombre d'apparition dans demandeurs : ${response.data.demandeur_count}`);
                localStorage.setItem('demandeurExist',response.data.demandeur_count);

            })
            .catch(error => {
                console.error('Erreur lors de la récupération du nombre de demandeurs :', error);
            });
            axios.get("http://127.0.0.1:8000/api/countTechnicienForAuthenticatedUser", {
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Ajoutez le token Bearer
                }
            })
            .then(response => {
                setTechnicienVerifCount(response.data.demandeur_count);
                setLoading(false)
                // Affichez la valeur dans une alerte
                // alert(`Nombre d'apparition dans technicien : ${response.data.technicien_count}`);
                console.log(`Nombre d'apparition dans technicien : ${response.data.technicien_count}`);
                localStorage.setItem('technicienExist',response.data.technicien_count);

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
      .then((res) => {
        setUser(res.data.user);
        console.log(user);
      })
      .catch((error) => {
        // Gérer les erreurs de la requête de récupération des données de l'utilisateur
      });
        }
    }, []);

    const changeStyle = () => {
        if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
        } else {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
        }
    }
    const location = useLocation();
    const gradientBackground = {
        background: 'linear-gradient(180deg, #0369a1,#082f49)',
    };
    // Récupérez le rôle de l'utilisateur à partir du local storage
    const userRole = localStorage.getItem('role');

    // Variables pour stocker les éléments à afficher en fonction des conditions
    let menuItems = null;
if(userRole === 'admin' && technicienVerifCount === 1 ){
    menuItems = (
        
        <>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/demandeurs">
                    <UilUserCircle />
                    <span>Demandeur</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/postes">
                    <UilUserCircle />
                    <span>Postes</span>
                </NavLink>
            </li>
            <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/users">
                        <UilUserCircle />
                        <span>Utilisateur</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/postes">
                        <UilUserCircle />
                        <span>Postes</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/techniciens">
                        <UilUserCircle />
                        <span>Technicien</span>
                    </NavLink>
                </li>

            </>
    )
}
    if (userRole === 'admin' && demandeurVerifCount === 1) {
        
        menuItems = (
            <>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/demandeurs">
                        <UilUserCircle />
                        <span>Demandeur</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/postes">
                        <UilUserCircle />
                        <span>Postes</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/demande_materiels">
                        <UilUserCircle />
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
                        <i className="fas fa-fw fa-cube"></i>
                        <span>Matériels</span>
                    </div>
                    <div id="collapseMatériels" className="collapse" aria-labelledby="headingMatériels" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Listes des Matériels</h6>
                            <NavLink className="collapse-item" to="/admin/materiels/en-cours">
                                En cours de réparation
                            </NavLink>
                            <NavLink className="collapse-item" to="/admin/materiels/repare">
                                Réparé
                            </NavLink>
                            <NavLink className="collapse-item" to="/admin/materiels">
                                Tous
                            </NavLink>
                        </div>
                    </div>
                </li>
            </>
        );
    } else if (userRole === 'admin' && demandeurVerifCount === 0) {
        menuItems = (
            <>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/demandeurs">
                    <UilUserCircle />
                    <span>Demandeur</span>
                </NavLink>
            </li>
            <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/users">
                        <UilUserCircle />
                        <span>Utilisateur</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/postes">
                        <UilUserCircle />
                        <span>Postes</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/techniciens">
                        <UilUserCircle />
                        <span>Technicien</span>
                    </NavLink>
                </li>

            </>
        );
    } else if (userRole === 'admin' && demandeurVerifCount === 0 && technicienVerifCount === 0) {
        menuItems = (
            <>
               <li className="nav-item">
  <NavLink className="nav-link" to="/admin/demandeurs">
    <UilUserCircle />
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Demandeur</span>
    )}
  </NavLink>
</li>
<li className="nav-item">
  <NavLink className="nav-link" to="/admin/users">
    <UilUserCircle />
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Utilisateur</span>
    )}
  </NavLink>
</li>
<li className="nav-item">
  <NavLink className="nav-link" to="/admin/postes">
    <UilUserCircle />
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Postes</span>
    )}
  </NavLink>
</li>
<li className="nav-item">
  <NavLink className="nav-link" to="/admin/techniciens">
    <UilUserCircle />
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Technicien</span>
    )}
  </NavLink>
</li>
<li className="nav-item">
  <div className="nav-link collapsed" data-toggle="collapse" data-target="#collapseTickets" aria-expanded="true" aria-controls="collapseTickets" style={{ cursor: 'pointer' }}>
    <UilTicket />
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Ticket d'intervention</span>
    )}
  </div>
  <div id="collapseTickets" className="collapse" aria-labelledby="headingTickets" data-parent="#accordionSidebar">
    <div className="bg-white py-2 collapse-inner rounded">
      <h6 className="collapse-header">Listes des tickets</h6>
      <NavLink className="collapse-item" to="/admin/tickets/nouveau">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>Nouveau</span>
        )}
      </NavLink>
      <NavLink className="collapse-item" to="/admin/tickets/traite">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>Traité</span>
        )}
      </NavLink>
      <NavLink className="collapse-item" to="/admin/tickets/en-attente">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>En attente</span>
        )}
      </NavLink>
      <NavLink className="collapse-item" to="/admin/tickets">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>Tous</span>
        )}
      </NavLink>
    </div>
  </div>
</li>

            </>
        );
    } else if (userRole === 'userSimple' && demandeurVerifCount === 1) {
        menuItems = (
            <>
              <li className="nav-item">
  <NavLink className="nav-link" to="/Acceuil_client/demande_materiels">
    <UilUserCircle />
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Demande de réparation</span>
    )}
  </NavLink>
</li>
<li className="nav-item">
  <div className="nav-link collapsed" data-toggle="collapse" data-target="#collapseMatériels" aria-expanded="true" aria-controls="collapseMatériels" style={{ cursor: 'pointer' }}>
    <i className="fas fa-fw fa-cube"></i>
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Matériels</span>
    )}
  </div>
  <div id="collapseMatériels" className="collapse" aria-labelledby="headingMatériels" data-parent="#accordionSidebar">
    <div className="bg-white py-2 collapse-inner rounded">
      <h6 className="collapse-header">Listes des Matériels</h6>
      <NavLink className="collapse-item" to="/Acceuil_client/materiels/en-cours">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>En cours de réparation</span>
        )}
      </NavLink>
      <NavLink className="collapse-item" to="/Acceuil_client/materiels/repare">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>Réparé</span>
        )}
      </NavLink>
      <NavLink className="collapse-item" to="/Acceuil_client/materiels">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>Tous</span>
        )}
      </NavLink>
    </div>
  </div>
</li>

            </>
        );
    } else if (userRole === 'userSimple' && technicienVerifCount === 1) {
        menuItems = (
            <>
                <li className="nav-item">
  <NavLink className="nav-link" to="/Acceuil_client/demande_materiels">
    <UilUserCircle />
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Demande de réparation</span>
    )}
  </NavLink>
</li>
<li className="nav-item">
  <div className="nav-link collapsed" data-toggle="collapse" data-target="#collapseTickets" aria-expanded="true" aria-controls="collapseTickets" style={{ cursor: 'pointer' }}>
    <UilTicket />
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
    ) : (
      <span>Ticket d'intervention</span>
    )}
  </div>
  <div id="collapseTickets" className="collapse" aria-labelledby="headingTickets" data-parent="#accordionSidebar">
    <div className="bg-white py-2 collapse-inner rounded">
      <h6 className="collapse-header">Listes des tickets</h6>
      <NavLink className="collapse-item" to="/Acceuil_client/tickets/nouveau">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>Nouveau</span>
        )}
      </NavLink>
      <NavLink className="collapse-item" to="/Acceuil_client/tickets/traite">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>Traité</span>
        )}
      </NavLink>
      <NavLink className="collapse-item" to="/Acceuil_client/tickets/en-attente">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>En attente</span>
        )}
      </NavLink>
      <NavLink className="collapse-item" to="/Acceuil_client/tickets">
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
        ) : (
          <span>Tous</span>
        )}
      </NavLink>
    </div>
  </div>
</li>

            </>
        );
    }

    return (
        <ul className={style} id="accordionSidebar" style={gradientBackground}>
            {/* Sidebar - Brand */}
            <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to={location.pathname}>
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">{user.nom_entreprise}</div>
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
                </div>
            </NavLink>

            {/* Divider */}
            <hr className="sidebar-divider my-0" />

            {/* Nav Item - Dashboard (toujours visible) */}
            <li className="nav-item">
                <NavLink className="nav-link text-white" to="/admin">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Tableau de bord</span>
                </NavLink>
            </li>

            {/* Divider */}
            <hr className="sidebar-divider" />

            {/* Listes des données */}
            <div className="sidebar-heading">Listes des données</div>
            {/* ... */}
            {menuItems}
            {/* ... */}
        </ul>
    );
}

export default Sidebar;
