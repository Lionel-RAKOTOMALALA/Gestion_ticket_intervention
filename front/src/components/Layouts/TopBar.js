import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Modal from '@mui/material/Modal';
import Badge from '@mui/material/Badge';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Grid,
  DialogActions,
  Button,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const TopBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [getRows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        setUser(response.data.user);
        setRows(response.data.count_notif);
        setLoading(false);

        if (response.data.notification) {
          setNotifications(response.data.notification);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications :', error);
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const isUserSimple = userRole === 'userSimple';


  const linkRoot =  isUserSimple ? '/Acceuil_client': isAdmin ? '/admin' : '';
  console.log('linkRoot:', linkRoot);

  const handleNotificationClick = (notificationId) => {
    const clickedNotification = notifications.find(
      (notification) => notification.id_notif === notificationId
    );

    if (clickedNotification) {
      setSelectedNotification(clickedNotification);
      setIsModalOpen(true);

      // Close modal after a certain time
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedNotification(null); // Reset selected notification
      }, 3000);

      // Update Notification table
      axios
        .put(`http://localhost:8000/api/update-notif/${notificationId}`)
        .then((result) => {
          setOpen(false);
          toast.success('Notification lue avec succès!', {
            position: 'bottom-left',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch(() => {
          alert('Error in the Code');
        });
    }
  };

  const logoutSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://127.0.0.1:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_name');
          swal('Success', res.data.message, 'success');
          navigate('/login');
        } else {
          // Handle other cases if necessary
        }
      })
      .catch(() => {
        // Handle logout request errors here
      });
  };

  const NotificationsMenu = (
    <Paper
      sx={{
        maxWidth: 300,
        position: 'fixed',
        right: 16,
        top: 64,
        zIndex: 1200,
        background: '#fff',
        boxShadow: 3,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 64px)',
      }}
    >
      <Box p={2}>
  <Typography variant="h6" gutterBottom style={{ color: '#0369a1' }}>
    Notifications
  </Typography>
  <Divider />
  <List>
    {notifications.map((notification, index) => (
      <ListItem
        key={index}
        alignItems="flex-start"
        style={{
          backgroundColor: notification.status_notif === 0 ? '#ccffcc' : 'white',
          cursor: 'pointer', // Ajoutez cette ligne pour définir le curseur comme pointeur
        }}
        sx={{ borderBottom: '1px solid #ddd' }}
        onClick={() => handleNotificationClick(notification.id_notif)}
      >
        <ListItemAvatar>
          <Avatar sx={{ backgroundColor: '#0369a1', color: '#fff' }}>
            <img
              src={`http://localhost:8000/uploads/users/${user.photo_profil_user}`}
              alt="User Photo"
              className="rounded-circle mx-auto"
              style={{
                width: '2rem',
                height: '2rem',
              }}
            />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Link href="#" color="textPrimary" sx={{ fontWeight: 'bold' }}>
              {notification.type_notif}
            </Link>
          }
          secondary={
            <Typography variant="body2" color="textSecondary">
              {notification.phrase}
            </Typography>
          }
        />
      </ListItem>
    ))}
    <ListItem
      component={Link}
      href="#"
      alignItems="center"
      sx={{
        justifyContent: 'center',
        borderTop: '1px solid #ddd',
        paddingTop: 1,
        paddingBottom: 1,
        color: '#0369a1',
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#fff',
        zIndex: 1201,
        cursor: 'pointer', 
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Voir plus
      </Typography>
    </ListItem>
  </List>
</Box>

    </Paper>
  );

  let AuthButtons = null;
  if (localStorage.getItem('auth_token')) {
    AuthButtons = (
      <Box display="flex" alignItems="center">
        <IconButton color="inherit" className="mx-1" onClick={handleOpen}>
          <Badge badgeContent={getRows === '0' ? '0' : getRows} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Modal open={open} onClose={handleClose}>
          {NotificationsMenu}
        </Modal>

        <div>
          <IconButton
            id="userDropdown"
            aria-controls="user-menu"
            aria-haspopup="true"
            color="inherit"
            onClick={handleUserMenuClick}
            sx={{ ml: 2 }}
          >
            {loading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : (
              <img
                src={`http://localhost:8000/uploads/users/${user.photo_profil_user}`}
                alt="User Photo"
                className="rounded-circle mx-auto"
                style={{
                  width: '3rem',
                  height: '3rem',
                }}
              />
            )}
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <Link
                component={NavLink}
                to={`${linkRoot}/profile`}
                sx={{
                  textDecoration: 'none',
                  color: '#0369a1',
                  '&:hover': {
                    textDecoration: 'none',
                    color: '#0369a1',
                    filter: 'brightness(0.7)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                <Typography variant="inherit">Profile</Typography>
              </Link>
            </MenuItem>
            
            <Divider />
            <MenuItem onClick={handleUserMenuClose}>
              <Link
                component={NavLink}
                to="/"
                onClick={logoutSubmit}
                sx={{
                  textDecoration: 'none',
                  color: '#0369a1',
                  '&:hover': {
                    textDecoration: 'none',
                    color: '#0369a1',
                    filter: 'brightness(0.7)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                <Typography variant="inherit">Se déconnecter</Typography>
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </Box>
    );
  } else {
    AuthButtons = (
      <Box display="flex" alignItems="center">
        <Link component={NavLink} to="/" sx={{ textDecoration: 'none', color: '#fff', '&:hover': { textDecoration: 'none' } }}>
          <Typography variant="h6">Accueil</Typography>
        </Link>
        <Link component={NavLink} to="/login" sx={{ textDecoration: 'none', color: '#fff', ml: 8, '&:hover': { textDecoration: 'none' } }}>
          <Typography variant="h6">Se connecter</Typography>
        </Link>
      </Box>
    );
  }

  return (
    <AppBar
      position="static"
      className="text-white topbar mb-4 static-top shadow"
      sx={{ background: 'linear-gradient(180deg, #0369a1, #0369a1)' }}
    >
      <Toolbar>
        <IconButton color="inherit" id="sidebarToggleTop" edge="start" className="btn btn-link d-md-none rounded-circle mr-3">
          <MenuIcon />
        </IconButton>
        <Box ml="auto">{AuthButtons}</Box>
        <ToastContainer />
      </Toolbar>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: 'rgba(33, 150, 243, 0.9)', color: '#fff' }}>Détails de la notification</DialogTitle>
        <DialogContent>
          <Card style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', marginTop : '2%', border: 'none' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">{`Type de notification: ${selectedNotification?.type_notif}`}</Typography>
                  <Typography variant="body1">{`Phrase: ${selectedNotification?.phrase}`}</Typography>
                  <Typography variant="body1">{`Phrase: ${selectedNotification?.created_at}`}</Typography>
                  {/* Add more information as needed */}
                </Grid>
                <Grid item xs={6}>
                  {/* Add more fields if necessary */}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button style={{ color: '#2196f3' }} onClick={() => setIsModalOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default TopBar;
