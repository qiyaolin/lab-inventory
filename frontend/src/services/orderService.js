import apiClient from './api';

const getMyRequests = () => {
  return apiClient.get('/orders/requests/');
};

const createRequest = (requestData) => {
  return apiClient.post('/orders/requests/', requestData);
};

const approveRequest = (id) => {
  return apiClient.post(`/orders/requests/${id}/approve/`);
};

const rejectRequest = (id) => {
  return apiClient.post(`/orders/requests/${id}/reject/`);
};

const orderService = {
  getMyRequests,
  createRequest,
  approveRequest, // Add this
  rejectRequest,  // Add this
};

export default orderService;