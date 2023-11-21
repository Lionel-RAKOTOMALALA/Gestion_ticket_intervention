import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toast() {
  const notify = () => toast.success('🚀 Wow, so easy to customize!', {
    position: 'bottom-left', // Position du toast
    autoClose: 3000,         // Durée d'affichage du toast en millisecondes
    hideProgressBar: false,   // Afficher ou masquer la barre de progression
    closeOnClick: true,       // Fermer le toast lorsqu'on clique dessus
    pauseOnHover: true,       // Mettre en pause le toast lorsqu'on survole
    draggable: true,          // Permettre de déplacer le toast
    progress: undefined,      // Progression personnalisée (par exemple, "0.5")
  });

  // Personnalisation des styles pour les toasts
  const customToastStyle = {
    background: 'black', // Fond noir
    color: 'white',      // Texte blanc
    borderRadius: '8px',  // Coins arrondis
    fontSize: '16px',    // Taille de la police
  };

  return (
    <div>
      <button onClick={notify}>Notify!</button>
      <ToastContainer
        toastStyle={customToastStyle}
        bodyClassName="custom-toast-body"
      />
    </div>
  );
}

export default Toast;
