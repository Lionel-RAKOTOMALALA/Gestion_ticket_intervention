import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UilUserCircle,UilTicket  } from '@iconscout/react-unicons';

function Sidebar() {
    const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

    const changeStyle = () => {
        if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
        } else {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
        }
    };
    const location = useLocation();

    return (
        <ul className={style} id="accordionSidebar">
            {/* Sidebar - Brand */}
            <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to={location.pathname}>
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Copefrito</div>
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
                </div>
            </NavLink>

            {/* Divider */}
            <hr className="sidebar-divider my-0" />

            {/* Nav Item - Dashboard */}
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

            {/* Matériels */}
            <li className="nav-item">
                <div
                    className="nav-link collapsed"
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

            {/* Divider */}
            <hr className="sidebar-divider" />

            {/* Autres éléments */}
            <div className="sidebar-heading">Autres éléments</div>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/techniciens">
                    <UilUserCircle/>
                    <span>Technicien</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/users">
                    <UilUserCircle/>
                    <span>Utilisateur</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/demande_materiels">
                    <UilUserCircle/>
                    <span>Demande de réparation</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/demandeurs">
                    <UilUserCircle/>
                    <span>Demandeur</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/postes">
                    <UilUserCircle/>
                    <span>Postes</span>
                </NavLink>
            </li>

            {/* Ticket d'intervention */}
            <li className="nav-item">
                <div
                    className="nav-link collapsed"
                    data-toggle="collapse"
                    data-target="#collapseTickets"
                    aria-expanded="true"
                    aria-controls="collapseTickets"
                    style={{ cursor: 'pointer' }}
                >
                    <UilTicket/>
                    <span>Ticket d'intervention</span>
                </div>
                <div id="collapseTickets" className="collapse" aria-labelledby="headingTickets" data-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <h6 className="collapse-header">Listes des tickets </h6>
                        <NavLink className="collapse-item" to="/admin/tickets/nouveau">
                            Nouveau
                        </NavLink>
                        <NavLink className="collapse-item" to="/admin/tickets/traite">
                            Traité
                        </NavLink>
                        <NavLink className="collapse-item" to="/admin/tickets/en-attente">
                            En attente
                        </NavLink>
                        <NavLink className="collapse-item" to="/admin/tickets">
                            Tous
                        </NavLink>
                    </div>
                </div>
            </li>
        </ul>
    );
}

export default Sidebar;
