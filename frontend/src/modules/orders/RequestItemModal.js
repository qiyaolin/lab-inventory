import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';
import orderService from '../../services/orderService';

const RequestItemModal = ({ open, onClose, item }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!item) return;
    const requestData = {
      item: item.id,
      quantity: quantity,
      notes: notes,
    };
    try {
      await orderService.createRequest(requestData);
      onClose(true); // Pass true to indicate success
    } catch (error) {
      console.error("Failed to create request", error);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Request Item</DialogTitle>
      <DialogContent>
        {item && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Vendor: {item.vendor_name || 'N/A'} | Catalog #: {item.catalog_number || 'N/A'}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Quantity to Request"
              type="number"
              fullWidth
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={{ mt: 3 }}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              margin="dense"
              label="Notes (optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit Request</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestItemModal;