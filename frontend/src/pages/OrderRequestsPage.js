import React, { useEffect, useState } from 'react';
    import { Box, Typography, Paper, Chip, IconButton, Tooltip } from '@mui/material';
    import { DataGrid } from '@mui/x-data-grid';
    import { CheckCircle as ApproveIcon, Cancel as RejectIcon } from '@mui/icons-material';
    import orderService from '../services/orderService';
    import { format } from 'date-fns';

    const OrderRequestsPage = () => {
      const [requests, setRequests] = useState([]);
      const [loading, setLoading] = useState(true);

      const fetchRequests = () => {
        setLoading(true);
        orderService.getMyRequests() // This endpoint returns all for managers
          .then(response => setRequests(response.data))
          .catch(error => console.error("Failed to fetch requests", error))
          .finally(() => setLoading(false));
      };

      useEffect(() => {
        fetchRequests();
      }, []);

      const handleApprove = (id) => {
        orderService.approveRequest(id).then(() => fetchRequests());
      };

      const handleReject = (id) => {
        orderService.rejectRequest(id).then(() => fetchRequests());
      };

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
        { field: 'requester_username', headerName: 'Requester', width: 130 },
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
        {
          field: 'actions',
          headerName: 'Actions',
          width: 120,
          sortable: false,
          renderCell: (params) => {
            if (params.row.status === 'Pending') {
              return (
                <Box>
                  <Tooltip title="Approve">
                    <IconButton color="success" onClick={() => handleApprove(params.row.id)}>
                      <ApproveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton color="error" onClick={() => handleReject(params.row.id)}>
                      <RejectIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              );
            }
            return null;
          },
        },
      ];

      return (
        <Box>
          <Typography variant="h4" gutterBottom>Manage Purchase Requests</Typography>
          <Paper sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={requests}
              columns={columns}
              loading={loading}
            />
          </Paper>
        </Box>
      );
    };

    export default OrderRequestsPage;