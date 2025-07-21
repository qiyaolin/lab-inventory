import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Fade,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import inventoryService from '../services/inventoryService';
import InventoryTable from '../modules/inventory/InventoryTable';
import AddItemModal from '../modules/inventory/AddItemModal';
import EditItemModal from '../modules/inventory/EditItemModal';
import RequestItemModal from '../modules/orders/RequestItemModal';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    categories: 0,
    locations: 0
  });
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const [itemsRes, categoriesRes, locationsRes] = await Promise.all([
          inventoryService.getItems(),
          inventoryService.getCategories(),
          inventoryService.getLocations()
        ]);
        
        const itemsData = itemsRes.data.results || itemsRes.data || [];
        const categoriesData = categoriesRes.data.results || categoriesRes.data || [];
        const locationsData = locationsRes.data.results || locationsRes.data || [];
        
        setItems(itemsData);
        
        // Calculate statistics
        const lowStockItems = itemsData.filter(item => 
          parseFloat(item.quantity) <= parseFloat(item.stock_warning_threshold || 0)
        );
        
        setStats({
          totalItems: itemsData.length,
          lowStock: lowStockItems.length,
          categories: categoriesData.length,
          locations: locationsData.length
        });
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load inventory data. Please try again.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleItemAdded = (newItem) => {
    const updatedItems = [newItem, ...(items || [])];
    setItems(updatedItems);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalItems: prev.totalItems + 1,
      lowStock: updatedItems.filter(item => 
        parseFloat(item.quantity) <= parseFloat(item.stock_warning_threshold || 0)
      ).length
    }));
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleItemUpdated = (updatedItem) => {
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      lowStock: updatedItems.filter(item => 
        parseFloat(item.quantity) <= parseFloat(item.stock_warning_threshold || 0)
      ).length
    }));
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      await inventoryService.deleteItem(itemToDelete.id);
      
      const updatedItems = items.filter(item => item.id !== itemToDelete.id);
      setItems(updatedItems);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalItems: prev.totalItems - 1,
        lowStock: updatedItems.filter(item => 
          parseFloat(item.quantity) <= parseFloat(item.stock_warning_threshold || 0)
        ).length
      }));
      
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
      setError('Failed to delete item. Please try again.');
    }
  };

  const handleRequest = (item) => {
    console.log('Request button clicked for item:', item);
    setSelectedItem(item);
    setIsRequestModalOpen(true);
    console.log('isRequestModalOpen set to:', true);
  };

  const handleRequestModalClose = (success) => {
    setIsRequestModalOpen(false);
    if (success) {
      setRequestFeedback({ open: true, message: 'Request submitted successfully!', severity: 'success' });
    }
  };
  
  const handleFeedbackClose = () => {
    setRequestFeedback({ ...requestFeedback, open: false });
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.catalog_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statsCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: <InventoryIcon />,
      color: '#3f51b5',
      bgColor: '#3f51b515'
    },
    {
      title: 'Low Stock',
      value: stats.lowStock,
      icon: <WarningIcon />,
      color: '#f57c00',
      bgColor: '#f57c0015'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: <CheckCircleIcon />,
      color: '#4caf50',
      bgColor: '#4caf5015'
    },
    {
      title: 'Locations',
      value: stats.locations,
      icon: <TrendingUpIcon />,
      color: '#9c27b0',
      bgColor: '#9c27b015'
    }
  ];

  return (
    <Fade in timeout={300}>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Inventory Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your laboratory inventory items, track stock levels, and monitor usage
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Add New Item
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {card.title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: card.color }}>
                          {loading ? '...' : card.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: card.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: card.color
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Search and Filters */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search items by name, catalog number, category, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Filters
            </Button>
            {searchTerm && (
              <Chip
                label={`${filteredItems.length} items found`}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Paper>

        {/* Inventory Table */}
        <Paper 
          sx={{ 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}
        >
          <InventoryTable 
            items={filteredItems} 
            loading={loading} 
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onRequest={handleRequest} // Pass the handler function
          />
        </Paper>

        {/* Add Item Modal */}
        <AddItemModal 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onItemAdded={handleItemAdded}
        />

        {/* Edit Item Modal */}
        <EditItemModal 
          open={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }} 
          onItemUpdated={handleItemUpdated}
          item={selectedItem}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setDeleteConfirmOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDeleteItem} 
              variant="contained"
              color="error"
              sx={{ borderRadius: 2 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add the RequestItemModal */}
        <RequestItemModal
          open={isRequestModalOpen}
          onClose={handleRequestModalClose}
          item={selectedItem}
        />
        
        {/* Add the Snackbar for feedback */}
        <Snackbar open={requestFeedback.open} autoHideDuration={6000} onClose={handleFeedbackClose}>
          <Alert onClose={handleFeedbackClose} severity={requestFeedback.severity} sx={{ width: '100%' }}>
            {requestFeedback.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default InventoryPage; 