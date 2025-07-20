import apiClient from './api';

const register = (username, email, password) => {
  return apiClient.post('/auth/users/', {
    username,
    email,
    password,
  });
};

const login = async (username, password) => {
  const response = await apiClient.post('/auth/jwt/create/', {
    username,
    password,
  });
  if (response.data.access) {
    // Upon successful login, get user details using the new token
    const userDetailsResponse = await apiClient.get('/auth/users/me/', {
      headers: {
        Authorization: `Bearer ${response.data.access}`,
      },
    });
    return { tokens: response.data, user: userDetailsResponse.data };
  }
  return response;
};

const authService = {
  register,
  login,
};

export default authService; 