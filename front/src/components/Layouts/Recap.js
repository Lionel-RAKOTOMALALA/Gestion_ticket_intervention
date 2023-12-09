import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Typography from '@mui/material/Typography';
import DashboardCard from './DashboardCard';
const Recap = ({ mostRequestedCompany,nbrDmdTraiteAnnee,nbrDmdTraiteMois,total_demandes_annee,total_demandes_mois })=>{
const [choix, setChoix] = useState('mois');

  return (
    <div className="row">
      {/* Total Demandes Année Card Example */}
      <DashboardCard
  title="Total Demandes Année"
  value={total_demandes_annee}
  
  icon="description"
/>

<DashboardCard
  title="Total Demandes Mois"
  value={total_demandes_mois}
  icon="description"
/>


    
      <div className="col-xl-3 col-md-6 mb-4">
  <div className="card border-left-info shadow h-100 py-2">
    <div className="card-body">
      <div className="row no-gutters align-items-center">
        <div className="col mr-2">
          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
            Taux de demande Traité
          </div>
          <div className="row no-gutters align-items-center mt-2">
            <div className="col-auto text-center">
              <div className="h5 mb-0 ml-2 font-weight-bold text-gray-800">
                {choix === 'annee' ? `${nbrDmdTraiteAnnee}%` : `${nbrDmdTraiteMois}%`}
              </div>
            </div>
            <div className="col">
              <div className="progress progress-sm mr-2">
                <div
                  className="progress-bar bg-info a1"
                  role="progressbar"
                  style={{ width: `${choix === 'annee' ? nbrDmdTraiteAnnee : nbrDmdTraiteMois}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-auto">
          <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
        </div>
      </div>
      <div className="text-right">
        <IconButton onClick={() => setChoix((prev) => (prev === 'mois' ? 'annee' : 'mois'))}>
          <ShowChartIcon color="inherit" />
        </IconButton>
        <span className="text-gray-500 ml-1">{choix === 'annee' ? 'Année' : 'Mois'}</span>
      </div>
    </div>
  </div>
</div>


   {/* Pending Requests Card Example */}
   <div className="col-xl-3 col-md-6 mb-4">
        <div className="card border-left-warning shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Demandes en Attente
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {mostRequestedCompany ? mostRequestedCompany.nombre_demandes : 'Loading...'}
                </div>
                <div className="text-xs text-gray-500">
                  {mostRequestedCompany ? `Entreprise la plus demandée : ${mostRequestedCompany.entreprise_la_plus_demandeuse}` : 'Chargement...'}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-comments fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recap;