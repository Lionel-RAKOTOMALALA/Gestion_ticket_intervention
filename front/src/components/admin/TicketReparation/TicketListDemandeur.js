// TicketList.js
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
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PrintIcon from '@mui/icons-material/Print';
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PDFFile from '../../Layouts/PDFFile';

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
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tickets");
      setTickets(response.data.tickets);

      const initialExpandedState = {};
      response.data.tickets.forEach((ticket) => {
        initialExpandedState[ticket.id_ticket] = false;
      });
      setExpanded(initialExpandedState);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 60000); 

    return () => clearInterval(intervalId); 
  }, []);

  const handleExpandClick = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tickets/${id}`);
      const updatedTicket = response.data.ticket;

      console.log("Ticket cliqué :", updatedTicket);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id_ticket === updatedTicket.id_ticket ? updatedTicket : ticket
        )
      );

      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [id]: !prevExpanded[id],
      }));

      setSelectedTicketId(id);
    } catch (error) {
      setError(error);
      console.error("Error fetching updated data:", error);
    }
  };

  return (
    <Grid container spacing={2}>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography>Error: {error.message}</Typography>}
      {!loading && !error &&
        tickets
          .filter((ticket) => selectedTicketId === null || ticket.id_ticket === selectedTicketId)
          .map((ticket) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={ticket.id_ticket}>
              <StyledCard>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">COP</Avatar>}
                  action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
                  title={`Ticket #${ticket.id_ticket}`}
                  subheader={ticket.date_creation}
                />
                <CardMedia
                  component="img"
                  height="200"
                  src={`http://localhost:8000/uploads/materiels/${ticket.image_materiel_url}`}
                  alt="Materiel Photo"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
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
                  <IconButton aria-label="add to favorites"><FavoriteIcon /></IconButton>
                  <PDFDownloadLink document={<PDFFile ticketData={ticket} />} fileName={`ticket_${ticket.id_ticket}.pdf`}>
                    {({ blob, url, loading, error }) => (
                      <IconButton aria-label="print" disabled={loading}>
                        <PrintIcon />
                      </IconButton>
                    )}
                  </PDFDownloadLink>
                  <ExpandMore
                    onClick={() => handleExpandClick(ticket.id_ticket)}
                    aria-expanded={expanded[ticket.id_ticket]}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded[ticket.id_ticket]} timeout="auto" unmountOnExit>
                  <CollapseContent>
                    <Typography paragraph>Details:</Typography>
                    {/* Add more details as needed */}
                  </CollapseContent>
                </Collapse>
              </StyledCard>
            </Grid>
          ))}
    </Grid>
  );
}
