import React from 'react';
import { Modal, Button, TextField, Typography } from '@mui/material';

const SimpleFaitModal = ({
  open,
  onClose,
  onValidation,
  interventionFaite,
  suiteDonnees,
  onInterventionFaiteChange,
  onSuiteDonneesChange,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ margin: '16px' }}>
        <Typography variant="h5">Validation de la réparation</Typography>
        <TextField
          label="Intervention Faite"
          fullWidth
          margin="normal"
          value={interventionFaite}
          onChange={(e) => onInterventionFaiteChange(e.target.value)}
        />
        <TextField
          label="Suite à Données"
          fullWidth
          margin="normal"
          value={suiteDonnees}
          onChange={(e) => onSuiteDonneesChange(e.target.value)}
        />
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" onClick={onValidation} style={{ marginLeft: '8px' }}>
            Valider
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SimpleFaitModal;
