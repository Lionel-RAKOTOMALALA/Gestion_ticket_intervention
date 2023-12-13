// MaterielTable.jsx
import React, { useState, useEffect } from 'react';
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

const MaterielTable = ({ apiEndpoint, title, columns }) => {
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
      .get(apiEndpoint, {
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

  const handleEdit = (num_serie) => {
    const selected = materiels.find((materiel) => materiel.num_serie === num_serie);
    setSelectedMateriel(selected);
    setIsEditModalOpen(true);
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
        {title}
      </Typography>
      {isLoading ? (
        <p>Loading...</p>
      ) : materiels.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materiels.map((materiel) => (
                <TableRow key={materiel.num_serie}>
                  {columns.map((column) => (
                    <TableCell key={column.field}>{materiel[column.field]}</TableCell>
                  ))}
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
          Aucun matériel disponible.
        </Typography>
      )}

      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isEditModalOpen}>
          <div>
            {selectedMateriel && (
              <EditMateriel
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                id={selectedMateriel.num_serie}
              />
            )}
          </div>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MaterielTable;
