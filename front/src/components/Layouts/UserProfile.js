import React from 'react';
import { useUser } from '../UserContext'; // Importez le contexte

const UserProfile = () => {
  const { userData } = useUser();

  return (
    <div className="profile-container">
      {userData ? (
        <div className="profile">
          <div className="profile-photo">
            <img src={userData.photo_profil_user} alt="Photo de profil" />
          </div>
          <div className="profile-info">
            <h2>{userData.username}</h2>
            <p>Email : {userData.email}</p>
            <p>Role : {userData.role}</p>
            <p>Nom de l'entreprise : {userData.nom_entreprise}</p>
            {/* Ajoutez d'autres données de l'utilisateur ici */}
          </div>
        </div>
      ) : (
        <p>Aucun utilisateur connecté.</p>
      )}
    </div>
  );
};

export default UserProfile;
