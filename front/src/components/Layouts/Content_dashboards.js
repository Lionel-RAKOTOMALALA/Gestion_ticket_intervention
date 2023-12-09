import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Importer Axios
import './Dashboard.css';
import MyBox from './Boxs';
import Chart from './chart';
import Recap from './Recap';
import PostHeader from './PostHeader';

const Content_dashboard = () => {
  const [mostRequestedCompany, setMostRequestedCompany] = useState(null);
  const [nbrDmdTraiteAnnee, setNbrDmdTraiteAnnee] = useState(null);
  const [nbrDmdTraiteMois, setNbrDmdTraiteMois] = useState(null);
  const [total_demandes_annee,setTotal_demandes_annee] = useState(null);
  const [total_demandes_mois,setTotal_demandes_mois] = useState(null);


  useEffect(() => {
    // Récupérer le token depuis le stockage local ou tout autre endroit où vous le stockez
    const authToken = localStorage.getItem('auth_token');
  
    // Configurer l'objet de configuration de la requête avec l'en-tête d'autorisation
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    };
  
    // Utiliser Axios pour effectuer la requête à l'API avec l'objet de configuration
    axios.get('http://127.0.0.1:8000/api/dashboard', config)
      .then(response => {
        // Mettre à jour l'état avec les données de l'API
        setMostRequestedCompany(response.data.most_requested_company);
        setNbrDmdTraiteAnnee(response.data.taux_demande_traitee_annee);
        setNbrDmdTraiteMois(response.data.taux_demande_traitee_mois);
        setTotal_demandes_annee(response.data.total_demandes_annee);
        setTotal_demandes_mois(response.data.total_demandes_mois);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
      });
  }, []);
console.log(mostRequestedCompany);
  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <PostHeader />

      {/* Content Row */}
      <Recap mostRequestedCompany={mostRequestedCompany} nbrDmdTraiteAnnee={nbrDmdTraiteAnnee} nbrDmdTraiteMois={nbrDmdTraiteMois} total_demandes_annee = {total_demandes_annee} total_demandes_mois={total_demandes_mois}/>

      {/* Content Row */}
      {/* <Chart/> */}

      {/* Content Row */}
      <MyBox />
    </div>
  );
}

export default Content_dashboard;
