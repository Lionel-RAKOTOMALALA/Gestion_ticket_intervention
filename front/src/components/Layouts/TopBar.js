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
} from '@mui/material';

const TopBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        setUser(response.data.user);

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
            <ListItem key={index} alignItems="flex-start" sx={{ borderBottom: '1px solid #ddd' }}>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#0369a1', color: '#fff' }}>
                  <img
                    src={"http://localhost:8000/uploads/users/" + user.photo_profil_user}
                    alt="User Photo"
                    className="rounded-circle mx-auto"
                    style={{
                      width: "2rem",
                      height: "2rem",
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
          <Badge badgeContent={notifications.length} color="error">
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
            src={"http://localhost:8000/uploads/users/" + user.user.photo_profil_user}
            alt="User Photo"
            className="rounded-circle mx-auto"
            style={{
                width: "3rem",
                height: "3rem",
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
                to="/admin/profile"
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
            <MenuItem onClick={handleUserMenuClose}>
              <Link
                component={NavLink}
                to="#"
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
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                <Typography variant="inherit">Paramètre</Typography>
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
          <Typography variant="h6">
            Accueil
          </Typography>
        </Link>
        <Link component={NavLink} to="/login" sx={{ textDecoration: 'none', color: '#fff', ml: 8, '&:hover': { textDecoration: 'none' } }}>
          <Typography variant="h6">
            Se connecter
          </Typography>
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
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
