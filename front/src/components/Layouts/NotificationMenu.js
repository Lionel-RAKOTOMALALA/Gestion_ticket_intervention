import React from 'react';
import { Paper, Typography, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Link } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationsMenu = ({ notifications }) => (
  <Paper sx={{ maxWidth: 300, position: 'absolute', right: 0, top: '64px', zIndex: 1200 }}>
    <List>
      <ListItem alignItems="center">
        <Typography variant="h6" gutterBottom sx={{ ml: 2 }}>
          Notifications
        </Typography>
        <NotificationsIcon fontSize="large" color="primary" sx={{ ml: 'auto', mr: 2 }} />
      </ListItem>
      <Divider />
      {notifications.map((notification, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar>{/* Add your avatar logic here */}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Link href="#" color="textPrimary">{notification.title}</Link>}
            secondary={notification.message}
          />
        </ListItem>
      ))}
      <ListItem
        component={Link}
        href="#"
        alignItems="center"
        sx={{ justifyContent: 'center', borderTop: '1px solid #ddd', paddingTop: 1, paddingBottom: 1 }}
      >
        <Typography variant="body2" color="textSecondary">
          Show All Alerts
        </Typography>
      </ListItem>
    </List>
  </Paper>
);

export default NotificationsMenu;
