import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PrintIcon from '@mui/icons-material/Print';
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PDFFile from '../../Layouts/PDFFile';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const ExpandMore = styled((props) => <IconButton {...props} />)(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const StyledCard = styled(Card)({
  margin: '1rem',
});

const CollapseContent = styled(Paper)({
  height: '100%',
  overflowY: 'auto',
  padding: '16px',
});

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [favoriteColors, setFavoriteColors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await axios.get("http://127.0.0.1:8000/api/tickets", {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      setTickets(response.data.tickets);

      const initialExpandedState = {};
      const initialFavoriteColors = {};
      response.data.tickets.forEach((ticket) => {
        initialExpandedState[ticket.id_ticket] = false;
        initialFavoriteColors[ticket.id_ticket] = '#2f545d'; // initial color
      });
      setExpanded(initialExpandedState);
      setFavoriteColors(initialFavoriteColors);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = () => {
    setOpenModal(true);
    handleMenuClose();
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const loadImage = async (id, imageUrl) => {
    try {
      setImageLoading((prevImageLoading) => ({
        ...prevImageLoading,
        [id]: true,
      }));

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        setImageLoading((prevImageLoading) => ({
          ...prevImageLoading,
          [id]: false,
        }));
      };
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleExpandClick = async (id, imageUrl) => {
    try {
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [id]: !prevExpanded[id],
      }));

      if (expanded[id]) {
        if (!imageLoading[id]) {
          await loadImage(id, imageUrl);
        }
      }
    } catch (error) {
      setError(error);
      console.error("Error handling expand click:", error);
    }
  };

  const handleFavoriteClick = (id) => {
    setFavoriteColors((prevColors) => ({
      ...prevColors,
      [id]: prevColors[id] === '#2f545d' ? red[500] : '#2f545d',
    }));
  };

  return (
    <Grid container spacing={2}>
      {loading && <Typography color="#2f545d">Loading...</Typography>}
      {error && <Typography color="#2f545d">Error: {error.message}</Typography>}

      {/* Display message if no tickets available */}
      {!loading && !error && tickets.length === 0 && (
        <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '2rem' }}>
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: 60, color: '#f44336' }} />
          <Typography variant="h5" color="#f44336" sx={{ marginTop: '1rem' }}>
            Aucun ticket disponible pour le moment.
          </Typography>
        </Grid>
      )}

      {!loading && !error &&
        tickets.map((ticket) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={ticket.id_ticket}>
            <StyledCard>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">COP</Avatar>}
                action={
                  <div>
                    <IconButton aria-label="settings" onClick={handleMenuClick}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleOptionClick}>Ajoutez un commentaire</MenuItem>
                    </Menu>
                  </div>
                }
                title={<Typography color="#2f545d">{`Ticket #${ticket.id_ticket}`}</Typography>}
                subheader={<Typography color="#2f545d">{ticket.date_creation}</Typography>}
              />

              <CardMedia
                component="img"
                height="200"
                src={`http://localhost:8000/uploads/materiels/${ticket.image_materiel_url}`}
                alt="Materiel Photo"
              />
              <CardContent>
                <Typography variant="body2" color="#2f545d">
                  <strong>Technicien:</strong> {ticket.nom_technicien}
                  <br />
                  <strong>Urgence:</strong> {ticket.urgence}
                  <br />
                  <strong>Priorité:</strong> {ticket.priorite}
                  <br />
                  <strong>Statut:</strong> {ticket.statut_actuel}
                  <br />
                  <strong>Type de matériel:</strong> {ticket.type_materiel}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => handleFavoriteClick(ticket.id_ticket)}
                >
                  <FavoriteIcon sx={{ color: favoriteColors[ticket.id_ticket] }} />
                </IconButton>
                <PDFDownloadLink document={<PDFFile ticketData={ticket} />} fileName={`ticket_${ticket.id_ticket}.pdf`}>
                  {({ blob, url, loading, error }) => (
                    <IconButton aria-label="print" disabled={loading}>
                      <PrintIcon />
                    </IconButton>
                  )}
                </PDFDownloadLink>
                <ExpandMore
                  onClick={() => handleExpandClick(ticket.id_ticket, `http://localhost:8000/uploads/materiels/${ticket.image_materiel_url}`)}
                  aria-expanded={expanded[ticket.id_ticket]}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse in={expanded[ticket.id_ticket]} timeout="auto" unmountOnExit>
                <CollapseContent>
                  <Typography variant="h6" sx={{ color: '#2f545d' }}>Details:</Typography>
                  <Typography sx={{ color: '#2f545d' }}>
                    <strong>Statut actuel:</strong> {ticket.statut_actuel}
                    <br />
                    <strong>Date de résolution:</strong> {ticket.date_resolution || 'N/A'}
                    <br />
                    <strong>Intervention faite:</strong> {ticket.intervention_faite || 'N/A'}
                    <br />
                    <strong>Suite à donnée:</strong> {ticket.suite_a_donnee || 'N/A'}
                  </Typography>
                </CollapseContent>
              </Collapse>
            </StyledCard>
          </Grid>
        ))}

<Dialog open={openModal} onClose={handleModalClose} fullWidth maxWidth="md">
  <DialogTitle style={{ backgroundColor: 'rgba(33, 150, 243, 0.9)', color: '#fff' }}>Ajouter un commentaire</DialogTitle>
  <DialogContent>
    <Card style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', marginTop: '2%', border: 'none' }}>
      <CardContent>
        <TextField
          autoFocus
          margin="dense"
          label="Commentaire"
          type="text"
          fullWidth
          multiline
          rows={4}
          placeholder="Saisissez votre commentaire ici..."
        />
      </CardContent>
    </Card>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleModalClose} style={{ color: '#2196f3' }}>
      Annuler
    </Button>
    <Button onClick={handleModalClose} color="primary">
      Ajouter
    </Button>
  </DialogActions>
</Dialog>

    </Grid>
  );
}
