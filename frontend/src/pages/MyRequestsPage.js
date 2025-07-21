import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import orderService from '../services/orderService';
import { format } from 'date-fns';

const getStatusChip = (status) => {
  const colors = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'error',
    Ordered: 'info',
  };
  return <Chip label={status} color={colors[status] || 'default'} size="small" />;
};

const columns = [
  {
    field: 'item_name',
    headerName: 'Item',
    width: 300,
    valueGetter: (params) => params.row.item_name || params.row.new_item_name,
  },
  { field: 'quantity', headerName: 'Quantity', width: 100 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => getStatusChip(params.value),
  },
  {
    field: 'date_requested',
    headerName: 'Date Requested',
    width: 180,
    valueGetter: (params) => format(new Date(params.value), 'PPpp'),
  },
   { field: 'notes', headerName: 'Notes', width: 350 },
];


const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyRequests()
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => console.error("Failed to fetch requests", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Purchase Requests</Typography>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={requests}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
        />
      </Paper>
    </Box>
  );
};

export default MyRequestsPage;