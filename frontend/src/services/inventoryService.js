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

const updateItem = (id, itemData) => {
  return apiClient.put(`/inventory/items/${id}/`, itemData);
};

const deleteItem = (id) => {
  return apiClient.delete(`/inventory/items/${id}/`);
};

const getItemHistory = (id) => {
  return apiClient.get(`/inventory/items/${id}/history/`);
};

const inventoryService = {
  getItems,
  getCategories,
  getLocations,
  getVendors,
  addItem,
  updateItem,
  deleteItem,
  getItemHistory,
};

export default inventoryService; 