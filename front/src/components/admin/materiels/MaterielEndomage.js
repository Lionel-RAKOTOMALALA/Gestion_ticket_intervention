import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import EditMateriel from './EditMateriel';
import { useLocation, useNavigate } from 'react-router-dom';

const MaterielEndomage = () => {
  const [materiels, setMateriels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    refreshData();

    const fetchDataInterval = setInterval(() => {
      refreshData();
    }, 3000);

    return () => {
      clearInterval(fetchDataInterval);
    };
  }, []);

  const authToken = localStorage.getItem('auth_token');
  const refreshData = () => {
    axios
      .get('http://127.0.0.1:8000/api/materiel_endomage', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setMateriels(response.data.materiels);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const pathname = location.pathname;
    const match = pathname.match(/\/Accueil_client\/materiels\/edit\/(\d+)/);
    if (match) {
      const num_serie = parseInt(match[1], 10);
      const selected = materiels.find((materiel) => materiel.num_serie === num_serie);
      setSelectedMateriel(selected);
      setIsEditModalOpen(true);
    }
  }, [location.pathname, materiels]);

  const handleCloseEditModal = () => {
    setSelectedMateriel(null);
    setIsEditModalOpen(false);
    refreshData();
  };

  const columns = [
    { field: 'num_serie', headerName: 'Numero de serie', width: 150 },
    { field: 'type_materiel', headerName: 'Type du materiel', width: 150 },
   
  ];

  const handleEdit = (num_serie) => {
    const selected = materiels.find((materiel) => materiel.num_serie === num_serie);
    setSelectedMateriel(selected);
    setIsEditModalOpen(true);
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
        Liste des matériels en cours de réparation
      </Typography>
      {isLoading ? (
        <p>Loading...</p>
      ) : materiels.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Numero de serie du materiel</TableCell>
                <TableCell>Type du materiel</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materiels.map((materiel) => (
                <TableRow key={materiel.num_serie}>
                  <TableCell>{materiel.num_serie}</TableCell>
                  <TableCell>{materiel.type_materiel}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(materiel.num_serie)}>
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
          Aucun matériel endommagé en cours de réparation.
        </Typography>
      )}
     
    </Box>
  );
};

export default MaterielEndomage;
