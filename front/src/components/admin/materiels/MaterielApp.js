import React,{useState,useEffect} from 'react';
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import MaterielList from './MaterielList';
import axios from 'axios';

const MaterielApp = () => {
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
                // Affichez la valeur dans une alerte
                // alert(`Nombre d'apparition dans demandeurs : ${response.data.demandeur_count}`);
                console.log(`Nombre d'apparition dans demandeurs : ${response.data.demandeur_count}`);
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
                // Affichez la valeur dans une alerte
                // alert(`Nombre d'apparition dans technicien : ${response.data.technicien_count}`);
                console.log(`Nombre d'apparition dans technicien : ${response.data.technicien_count}`);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du nombre de demandeurs :', error);
            });
            
        }
    }, []);
    
    const userRole = localStorage.getItem('role');

    let linkAdd = null;
    if(userRole === 'admin'){
        linkAdd = '/admin/materiels/demande_reparation';
    }else{
        linkAdd = '/Acceuil_client/materiels/demande_reparation';

    }
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Materiels</h1>
      <p className="mb-5">
        Ne laissez pas votre appareil endommagé affecter votre quotidien. Notre équipe dévouée est là pour vous aider.
        <br />
        Faites dès maintenant une demande d'intervention pour réparer votre appareil et reprenez le contrôle de votre technologie.
      </p>
      <NavLink to={linkAdd}>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter
          </button>
        </div>
      </NavLink>
      <MaterielList />
    </div>
  );
};

export default MaterielApp;
