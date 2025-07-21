import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Item Name', width: 200, flex: 1 },
  { field: 'catalog_number', headerName: 'Catalog #', width: 120 },
  { field: 'category_name', headerName: 'Category', width: 130 },
  { 
    field: 'quantity', 
    headerName: 'Qty', 
    type: 'number', 
    width: 80, 
    valueFormatter: (params) => {
      if (!params || params.value === null || params.value === undefined) return '0';
      return parseFloat(params.value).toFixed(2);
    }
  },
  { field: 'units', headerName: 'Units', width: 80 },
  { field: 'location_name', headerName: 'Location', width: 120 },
  { field: 'vendor_name', headerName: 'Vendor', width: 130 },
  { 
    field: 'stock_warning_threshold', 
    headerName: 'Min Stock', 
    type: 'number', 
    width: 90, 
    valueFormatter: (params) => {
      if (!params || params.value === null || params.value === undefined) return '0';
      return parseFloat(params.value).toFixed(2);
    }
  },
  { 
    field: 'expiration_date', 
    headerName: 'Expires', 
    width: 100, 
    valueFormatter: (params) => {
      if (!params || !params.value) return 'N/A';
      try {
        return new Date(params.value).toLocaleDateString();
      } catch (error) {
        return 'N/A';
      }
    }
  },
  { field: 'added_by_username', headerName: 'Added By', width: 100 },
  { 
    field: 'date_added', 
    headerName: 'Date Added', 
    width: 110, 
    valueFormatter: (params) => {
      if (!params || !params.value) return '';
      try {
        return new Date(params.value).toLocaleDateString();
      } catch (error) {
        return '';
      }
    }
  },
];

const InventoryTable = ({ items, loading, onEditItem, onDeleteItem, onRequest }) => {
  const columnsWithActions = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150, // Increase width to fit the new button
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Add this new IconButton for requesting */}
          <Tooltip title="Request Item">
            <IconButton color="primary" onClick={() => onRequest(params.row)}>
              <AddShoppingCartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Item">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEditItem(params.row);
              }}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.50'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Item">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(params.row);
              }}
              sx={{
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.50'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={items}
        columns={columnsWithActions}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        sx={{
          border: 'none',
          '& .MuiDataGrid-main': {
            borderRadius: 0,
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'grey.50',
            borderBottom: '2px solid',
            borderColor: 'divider',
            fontWeight: 600,
            fontSize: '0.9rem',
            '& .MuiDataGrid-columnHeader': {
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'grey.100',
            py: 1,
            '&:focus': {
              outline: 'none'
            }
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              bgcolor: 'grey.50',
              cursor: 'pointer'
            },
            '&.Mui-selected': {
              bgcolor: 'primary.50',
              '&:hover': {
                bgcolor: 'primary.100'
              }
            }
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '2px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50'
          },
          '& .MuiDataGrid-selectedRowCount': {
            visibility: 'hidden'
          }
        }}
      />
    </Box>
  );
};

export default InventoryTable; 