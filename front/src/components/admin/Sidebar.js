import React, { useState } from 'react';
import { useLocation, Link  } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

    const changeStyle = () => {
        if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
        } else {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
        }
    };

    return (
        <ul className={style} id="accordionSidebar">
            {/* <!-- Sidebar - Brand --> */}
            <Link className="sidebar-brand d-flex align-items-center justify-content-center" to={location.pathname}>
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Copefrito</div>
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
                </div>
            </Link>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider my-0" />

            {/* <!-- Nav Item - Dashboard */}
            <li className="nav-item active">
                <Link className="nav-link" to="/admin/dashboard">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Tableau de bord</span>
                </Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/admin/profile">
                    <i className="fas fa-fw fa-user-alt"></i>
                    <span>Profile</span>
                </Link>
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
                        <Link className="collapse-item" href="buttons.html">
                            En cours de reparation
                        </Link>
                        <Link className="collapse-item" href="cards.html">
                            Réparé
                        </Link>
                        <Link className="collapse-item" to="/admin/materiels">
                            Tous
                        </Link>
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
