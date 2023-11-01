import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../Layouts/TopBar';
import Sidebar from '../Layouts/Sidebar';
import ScrollBtn from '../Layouts/ScrollBtn';
import LogoutModal from '../Layouts/LogoutModal';
import Footer from '../Layouts/Footer';

function Dashboard() {
    return (
        <div>
            <body id="page-top">
                <div id="wrapper">
                    <Sidebar />
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <TopBar />
                            <Outlet /> 
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
