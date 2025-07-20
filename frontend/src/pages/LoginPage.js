import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Link as MuiLink, 
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { 
  Link,
  Visibility,
  VisibilityOff,
  Science as ScienceIcon,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { user, tokens } = await authService.login(username, password);
      login(user, tokens);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <ScienceIcon sx={{ fontSize: 48 }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Lab Inventory System
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Sign in to manage your laboratory inventory
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.12)'
                  }
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Chip label="Demo Credentials" size="small" />
              </Divider>

              <Box 
                sx={{ 
                  bgcolor: 'grey.50', 
                  p: 2, 
                  borderRadius: 2,
                  mb: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Demo Account
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  Username: <code>admin</code>
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  Password: <code>admin123</code>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <MuiLink 
                  component={RouterLink} 
                  to="/register" 
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Don't have an account? Sign Up
                </MuiLink>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 