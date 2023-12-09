import React, { useEffect, useState } from 'react';
import { Avatar, Paper, Typography, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledPaper = styled(Paper)({
  maxWidth: 600,
  margin: 'auto',
  marginTop: (theme) => theme.spacing(4),
  padding: (theme) => theme.spacing(3),
  textAlign: 'center',
});

const StyledAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  margin: 'auto',
});

const Content_profil = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const authToken = localStorage.getItem('auth_token');

        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <StyledPaper elevation={3}>
      {userProfile ? (
        <>
          <StyledAvatar alt="User Avatar" src={`http://localhost:8000/uploads/users/${userProfile.user.photo_profil_user}`} />
          <Typography variant="h5" gutterBottom>
            {userProfile.user.username}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {userProfile.user.email}
          </Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>ID</Avatar>
              </ListItemAvatar>
              <ListItemText primary="User ID" secondary={userProfile.user.id} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>Sexe</Avatar>
              </ListItemAvatar>
              <ListItemText primary="Sexe" secondary={userProfile.user.sexe} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>Role</Avatar>
              </ListItemAvatar>
              <ListItemText primary="Role" secondary={userProfile.user.role_user === '1' ? 'Admin' : 'Utilisateur'} />
            </ListItem>
            {userProfile.entreprise && (
              <ListItem>
                <ListItemAvatar>
                  <img src={`http://localhost:8000/uploads/logo/${userProfile.entreprise[0].logo}`} alt="" style={{ marginRight: 8, width: 80 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={`Entreprise: ${userProfile.entreprise[0].nom_entreprise}`}
                  secondary={`Adresse: ${userProfile.entreprise[0].adresse}`}
                />
              </ListItem>
            )}
          </List>
        </>
      ) : (
        <Typography variant="h6" color="error">
          Loading...
        </Typography>
      )}
    </StyledPaper>
  );
};

export default Content_profil;