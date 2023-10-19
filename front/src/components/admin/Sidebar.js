import React, { useState } from 'react';
import { NavLink,useLocation } from 'react-router-dom';

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
            {/* <!-- Sidebar - Brand --> */}
            <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to={location.pathname}>
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Copefrito</div>
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
                </div>
            </NavLink>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider my-0" />

            {/* <!-- Nav Item - Dashboard */}
            <li className="nav-item active">
                <NavLink className="nav-link" to="/admin">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Tableau de bord</span>
                </NavLink>
            </li>
            <li className="nav-item active">
                <NavLink className="nav-link" to="/admin/profile">
                    <i className="fas fa-fw fa-user-alt"></i>
                    <span>Profile</span>
                </NavLink>
            </li>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider" />

            {/* <!-- Heading */}
            <div className="sidebar-heading">Listes des données</div>

            {/* <!-- Nav Item - Pages Collapse Menu */}
            <li className="nav-item">
                <div
                    className="nav-link collapsed"
                    data-toggle="collapse"
                    data-target="#collapseTwo"
                    aria-expanded="true"
                    aria-controls="collapseTwo"
                    style={{ cursor: 'pointer' }}
                >
                    <i className="fas fa-fw fa-cube"></i>
                    <span>Matériels</span>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
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

            {/* <!-- Divider */}
            <hr className="sidebar-divider" />

            {/* <!-- Heading */}
            <div className="sidebar-heading">Autres éléments</div>

            {/* <!-- Divider */}
            <hr className="sidebar-divider d-none d-md-block" />
        </ul>
    );
}

export default Sidebar;
