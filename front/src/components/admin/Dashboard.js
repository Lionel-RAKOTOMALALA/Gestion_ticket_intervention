import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Content_dashboard from '../admin/Content_dashboards';
import Content_profil from '../admin/Content_profil';
import TopBar from '../admin/TopBar';
import Sidebar from '../admin/Sidebar';
import ScrollBtn from '../admin/ScrollBtn';
import LogoutModal from '../admin/LogoutModal';
import Footer from '../admin/Footer';
import Materiel from './materiels/MaterielApp';
import MaterielAdd from './materiels/MaterielForm';
import EditMateriel from './materiels/EditMateriel';

function Dashboard() {
    const location = useLocation();
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (location.pathname === '/admin/dashboard') {
            setContent(<Content_dashboard />);
        } else if (location.pathname === '/admin/profile') {
            setContent(<Content_profil />);
        } else if (location.pathname === '/admin/materiels') {
            setContent(<Materiel />);
        } else if (location.pathname === '/admin/demande_reparation') {
            setContent(<MaterielAdd />);
        } else if (location.pathname.startsWith('/admin/materiels/')) {
            setContent(<EditMateriel />);
        } else {
            setContent(null);
        }
    }, [location.pathname]);

    return (
        <div>
            <body id="page-top">
                <div id="wrapper">
                    <Sidebar />
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <TopBar />
                            {content}
                        </div>
                        <Footer />
                    </div>
                </div>
                <ScrollBtn />
                <LogoutModal />
            </body>
        </div>
    );
}

export default Dashboard;
