import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";
import { UilEditAlt, UilTrashAlt, UilEye,UilCheckCircle  } from "@iconscout/react-unicons";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TicketReparation = ({ ticket, refreshData }) => {
  const navigate = useNavigate();

  if (!ticket) {
    return null;
  }

  const deleteTicket = (e, id) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer ce ticket d\'intervention ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/tickets/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData();
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/tickets'); // Assurez-vous d'utiliser la bonne URL
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`ID: ${ticket.id_ticket}`}
        subheader={`Date de création: ${ticket.date_creation}`}
      />
      <CardMedia
        component="img"
        height="194"
        image={ticket.image_materiel_url}
        alt="Image du matériel"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {ticket.type_materiel}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="show more" onClick={deleteTicket}>
          <UilTrashAlt /> Supprimer
        </IconButton>
        <NavLink to={`/admin/tickets/${ticket.id_ticket}`}>
          <IconButton aria-label="show more">
            <UilEye /> Voir
          </IconButton>
        </NavLink>
        <IconButton aria-label="show more">
          <UilCheckCircle /> Valider
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TicketReparation;
