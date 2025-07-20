import apiClient from './api';

const getItems = () => {
  return apiClient.get('/inventory/items/');
};

const getCategories = () => {
  return apiClient.get('/inventory/categories/');
};

const getLocations = () => {
  return apiClient.get('/inventory/locations/');
};

const getVendors = () => {
  return apiClient.get('/inventory/vendors/');
};

const addItem = (itemData) => {
  return apiClient.post('/inventory/items/', itemData);
};

const inventoryService = {
  getItems,
  getCategories,
  getLocations,
  getVendors,
  addItem,
};

export default inventoryService; 