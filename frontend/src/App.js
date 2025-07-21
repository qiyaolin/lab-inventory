import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage'; // Import the new page
import MyRequestsPage from './pages/MyRequestsPage'; // Import the new page
import OrderRequestsPage from './pages/OrderRequestsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout'; // Import the new layout

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          
          {/* Protected Routes inside AppLayout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
                      {/* The element for the parent route "/" is DashboardPage */}
          <Route index element={<DashboardPage />} /> 
          {/* Add the new inventory route */}
          <Route path="inventory" element={<InventoryPage />} />
          {/* Add the new requests route */}
          <Route path="my-requests" element={<MyRequestsPage />} />
          <Route path="manage-requests" element={<OrderRequestsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
