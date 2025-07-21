import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Typography, 
  Box,
  Divider,
  Paper,
  Chip,
  IconButton,
  Alert,
  Autocomplete
} from '@mui/material';
import { 
  Close as CloseIcon,
  Edit as EditIcon,
  Science as ScienceIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import inventoryService from '../../services/inventoryService';

const EditItemModal = ({ open, onClose, onItemUpdated, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    units: '',
    category: '',
    location: '',
    vendor: '',
    catalog_number: '',
    stock_warning_threshold: '',
    expiration_date: '',
  });
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pre-fill form data when item prop changes
  useEffect(() => {
    if (item && open) {
      setFormData({
        name: item.name || '',
        quantity: item.quantity || '',
        units: item.units || '',
        category: item.category || '',
        location: item.location || '',
        vendor: item.vendor || '',
        catalog_number: item.catalog_number || '',
        stock_warning_threshold: item.stock_warning_threshold || '',
        expiration_date: item.expiration_date || '',
      });
    }
  }, [item, open]);

  useEffect(() => {
    if (open) {
      // Fetch dropdown data when the modal opens
      inventoryService.getCategories()
        .then(res => setCategories(res.data.results || res.data || []))
        .catch(err => {
          console.error('Failed to load categories:', err);
          setCategories([]);
        });
      
      inventoryService.getLocations()
        .then(res => setLocations(res.data.results || res.data || []))
        .catch(err => {
          console.error('Failed to load locations:', err);
          setLocations([]);
        });
      
      inventoryService.getVendors()
        .then(res => setVendors(res.data.results || res.data || []))
        .catch(err => {
          console.error('Failed to load vendors:', err);
          setVendors([]);
        });
    }
  }, [open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    
    if (!formData.units.trim()) {
      newErrors.units = 'Units are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Convert empty strings to null for optional fields
      const submitData = {
        ...formData,
        category: formData.category || null,
        location: formData.location || null,
        vendor: formData.vendor || null,
        catalog_number: formData.catalog_number || '',
        stock_warning_threshold: formData.stock_warning_threshold || 0,
        expiration_date: formData.expiration_date || null,
      };
      
      const response = await inventoryService.updateItem(item.id, submitData);
      onItemUpdated(response.data); // Pass updated item back to the parent
      
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to update item:', error);
      setSubmitError('Failed to update item. Please check your input and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setSubmitError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Custom Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 3,
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EditIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Edit Inventory Item
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Update the details for "{item?.name || 'this item'}"
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {submitError && (
          <Alert severity="error" sx={{ m: 3, mb: 0 }}>
            {submitError}
          </Alert>
        )}
        
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <ScienceIcon color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Basic Information
                  </Typography>
                  <Chip label="Required" size="small" color="error" variant="outlined" />
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Item Name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required
                      error={!!errors.name}
                      helperText={errors.name || "Enter the full name of the inventory item"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Quantity" 
                      name="quantity" 
                      type="number" 
                      value={formData.quantity} 
                      onChange={handleChange} 
                      required
                      error={!!errors.quantity}
                      helperText={errors.quantity || "Current quantity available"}
                      inputProps={{ min: 0, step: 0.01 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      freeSolo
                      options={['mL', 'L', 'g', 'kg', 'mg', 'units', 'kits', 'boxes', 'pieces']}
                      value={formData.units}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, units: newValue || '' }));
                        if (errors.units) {
                          setErrors(prev => ({ ...prev, units: '' }));
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params}
                          fullWidth 
                          label="Units" 
                          name="units"
                          required
                          error={!!errors.units}
                          helperText={errors.units || "e.g., mL, g, kg, units, kits"}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Catalog Number" 
                      name="catalog_number" 
                      value={formData.catalog_number} 
                      onChange={handleChange}
                      helperText="Manufacturer's catalog/part number (optional)"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Classification Section */}
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <LocationIcon color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Classification & Location
                  </Typography>
                  <Chip label="Optional" size="small" color="info" variant="outlined" />
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select 
                        name="category" 
                        value={formData.category} 
                        label="Category" 
                        onChange={handleChange}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">
                          <em>Select Category</em>
                        </MenuItem>
                        {(categories || []).map(cat => (
                          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Location</InputLabel>
                      <Select 
                        name="location" 
                        value={formData.location} 
                        label="Location" 
                        onChange={handleChange}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">
                          <em>Select Location</em>
                        </MenuItem>
                        {(locations || []).map(loc => (
                          <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Vendor</InputLabel>
                      <Select 
                        name="vendor" 
                        value={formData.vendor} 
                        label="Vendor" 
                        onChange={handleChange}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">
                          <em>Select Vendor</em>
                        </MenuItem>
                        {(vendors || []).map(ven => (
                          <MenuItem key={ven.id} value={ven.id}>{ven.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Additional Information Section */}
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <WarningIcon color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Stock Management
                  </Typography>
                  <Chip label="Optional" size="small" color="info" variant="outlined" />
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Stock Warning Threshold" 
                      name="stock_warning_threshold" 
                      type="number" 
                      value={formData.stock_warning_threshold} 
                      onChange={handleChange}
                      inputProps={{ min: 0, step: 0.01 }}
                      helperText="Alert when quantity falls below this level"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Expiration Date" 
                      name="expiration_date" 
                      type="date" 
                      value={formData.expiration_date} 
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText="Leave blank if item doesn't expire"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Custom Footer */}
      <Box sx={{ 
        p: 3, 
        bgcolor: 'grey.50', 
        borderTop: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="body2" color="text.secondary">
          * Required fields
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={isSubmitting}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              }
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Item'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditItemModal;