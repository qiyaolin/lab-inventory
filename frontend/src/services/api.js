import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the tokens from localStorage
    const storedTokens = localStorage.getItem('tokens');
    if (storedTokens) {
      const tokens = JSON.parse(storedTokens);
      // Add the JWT to the Authorization header
      config.headers['Authorization'] = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient; 