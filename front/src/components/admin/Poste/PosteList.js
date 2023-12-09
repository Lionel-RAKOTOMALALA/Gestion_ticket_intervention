import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import { NavLink, useNavigate } from "react-router-dom";
import $ from 'jquery';

const PosteList = () => {
  const [postes, setPostes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const destroyDataTable = () => {
    if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
  };

  const refreshData = () => {
    destroyDataTable();
    axios.get("http://127.0.0.1:8000/api/postes")
      .then((response) => {
        setPostes(response.data.postes);
        setIsLoading(false);
        if (tableRef.current) {
          $(tableRef.current).DataTable({
            language: {
              search: 'Rechercher :',
              lengthMenu: 'Afficher _MENU_ éléments par page',
              info: 'Affichage de _START_ à _END_ sur _TOTAL_ éléments',
              infoEmpty: 'Aucun élément trouvé',
              infoFiltered: '(filtré de _MAX_ éléments au total)',
              paginate: {
                first: 'Premier',
                previous: 'Précédent',
                next: 'Suivant',
                last: 'Dernier'
              }
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const calculateSkeletonSize = (content) => {
    const defaultSize = 30;
    const contentLength = content ? content.toString().length : 0;

    return defaultSize + contentLength * 5;
  };

  const columns = [
    { field: "id_poste", headerName: "ID Poste", width: 150 },
    { field: "nom_poste", headerName: "Nom du Poste", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box>
          <NavLink to={`/admin/poste/edit/${params.row.id_poste}`}>
            <IconButton>
              <UilEditAlt />
            </IconButton>
          </NavLink>
          <IconButton onClick={() => deletePoste(params.row.id_poste)}>
            <UilTrashAlt />
          </IconButton>
        </Box>
      ),
    },
  ];

  const deletePoste = (id) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer ce poste ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true);
        axios.delete(`http://127.0.0.1:8000/api/postes/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData();
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/postes');
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }
    });
  };

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h6" component="h6" sx={{ textAlign: "center", mb: 3 }}>
        Liste des postes d'employés
      </Typography>
      {isLoading ? (
        <DataGrid
          columns={columns.map((col) => ({
            ...col,
            renderCell: (params) => (
              <Skeleton
                variant="rectangular"
                height={calculateSkeletonSize(params.value)}
                width="80%"
              />
            ),
          }))}
          rows={[...Array(5).keys()].map((rowId) => ({ id: rowId }))}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableSelectionOnClick
          disableMultipleSelection
          hideFooter
          sx={{ maxWidth: 2000 }} // Adjust the max width as needed
        />
      ) : (
        <DataGrid
          columns={columns}
          rows={postes}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          onCellEditCommit={(params) => console.log(params)}
          getRowId={(row) => row.id_poste}
          sx={{
            [`& .${gridClasses.row}`]: {
              bgcolor: (theme) => (theme.palette.mode === "light" ? "#eee" : "#333"),
            },
            maxWidth: 2000, // Adjust the max width as needed
          }}
        />
      )}
    </Box>
  );
};

export default PosteList;
