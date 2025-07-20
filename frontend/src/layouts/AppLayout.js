import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Menu, 
  MenuItem, 
  IconButton,
  Avatar,
  Chip,
  Divider,
  Badge,
  Paper
} from '@mui/material';
import { 
  AccountCircle,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Science as ScienceIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', color: '#3f51b5' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory', color: '#9c27b0' },
  ];

  const isCurrentPath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Modern Top Application Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScienceIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" noWrap component="div" fontWeight="bold">
              Lab Inventory System
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" size="large">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <Chip 
                label={user.username}
                avatar={<Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>{user.username?.[0]?.toUpperCase()}</Avatar>}
                onClick={handleMenu}
                sx={{ 
                  color: 'white', 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  cursor: 'pointer'
                }}
              />
              
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Signed in as
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {user.username}
                  </Typography>
                </Box>
                <MenuItem onClick={handleClose} sx={{ gap: 2 }}>
                  <SettingsIcon fontSize="small" />
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ gap: 2, color: 'error.main' }}>
                  <LogoutIcon fontSize="small" />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Modern Side Navigation Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            border: 'none',
            bgcolor: 'white',
            boxShadow: '0 0 20px rgba(0,0,0,0.05)'
          },
        }}
      >
        <Toolbar />
        
        <Box sx={{ p: 2, pt: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ px: 2, fontWeight: 600 }}>
            Navigation
          </Typography>
        </Box>
        
        <Box sx={{ overflow: 'auto', px: 2 }}>
          <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  selected={isCurrentPath(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: `${item.color}15`,
                      borderLeft: `3px solid ${item.color}`,
                      '& .MuiListItemIcon-root': {
                        color: item.color
                      },
                      '& .MuiListItemText-primary': {
                        color: item.color,
                        fontWeight: 600
                      }
                    },
                    '&:hover': {
                      bgcolor: `${item.color}08`,
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isCurrentPath(item.path) ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ p: 2 }}>
          <Paper 
            sx={{ 
              p: 2, 
              bgcolor: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Lab Inventory v1.0
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
              Modern laboratory management
            </Typography>
          </Paper>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: '#f8fafc',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout; 