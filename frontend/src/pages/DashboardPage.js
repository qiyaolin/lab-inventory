import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Fade,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import inventoryService from '../services/inventoryService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    expiringItems: 0,
    categories: 0,
    locations: 0,
    vendors: 0
  });
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itemsRes, categoriesRes, locationsRes, vendorsRes] = await Promise.all([
          inventoryService.getItems(),
          inventoryService.getCategories(),
          inventoryService.getLocations(),
          inventoryService.getVendors()
        ]);
        
        const itemsData = itemsRes.data.results || itemsRes.data || [];
        const categoriesData = categoriesRes.data.results || categoriesRes.data || [];
        const locationsData = locationsRes.data.results || locationsRes.data || [];
        const vendorsData = vendorsRes.data.results || vendorsRes.data || [];
        
        // Calculate statistics
        const lowStockItems = itemsData.filter(item => 
          parseFloat(item.quantity) <= parseFloat(item.stock_warning_threshold || 0)
        );
        
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expiringItems = itemsData.filter(item => 
          item.expiration_date && new Date(item.expiration_date) <= thirtyDaysFromNow
        );
        
        setStats({
          totalItems: itemsData.length,
          lowStock: lowStockItems.length,
          expiringItems: expiringItems.length,
          categories: categoriesData.length,
          locations: locationsData.length,
          vendors: vendorsData.length
        });
        
        // Get recent items (latest 5)
        const sortedItems = itemsData
          .sort((a, b) => new Date(b.date_added) - new Date(a.date_added))
          .slice(0, 5);
        setRecentItems(sortedItems);
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const dashboardCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: <InventoryIcon />,
      color: '#3f51b5',
      bgColor: '#3f51b515',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStock,
      icon: <WarningIcon />,
      color: '#f57c00',
      bgColor: '#f57c0015',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringItems,
      icon: <ScheduleIcon />,
      color: '#e91e63',
      bgColor: '#e91e6315',
      trend: '+2%',
      trendUp: true
    },
    {
      title: 'Active Categories',
      value: stats.categories,
      icon: <AssessmentIcon />,
      color: '#4caf50',
      bgColor: '#4caf5015',
      trend: '+8%',
      trendUp: true
    }
  ];

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Fade in timeout={300}>
      <Box>
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {getGreeting()}, {user?.username}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's what's happening in your laboratory today
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardCards.map((card, index) => (
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
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
                    <Chip
                      label={card.trend}
                      size="small"
                      icon={card.trendUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      color={card.trendUp ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: card.color, mb: 1 }}>
                    {loading ? '...' : card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity and Quick Actions */}
        <Grid container spacing={3}>
          {/* Recent Items */}
          <Grid item xs={12} md={8}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Recently Added Items
              </Typography>
              <Box sx={{ mt: 2 }}>
                {loading ? (
                  <LinearProgress sx={{ borderRadius: 1 }} />
                ) : recentItems.length > 0 ? (
                  recentItems.map((item, index) => (
                    <Box 
                      key={item.id}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        py: 2,
                        borderBottom: index < recentItems.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem'
                          }}
                        >
                          {item.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.category_name} • {item.quantity} {item.units}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.date_added).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">No items added yet</Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Quick Overview
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Storage Locations</Typography>
                  <Chip label={stats.locations} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Active Vendors</Typography>
                  <Chip label={stats.vendors} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Item Categories</Typography>
                  <Chip label={stats.categories} size="small" />
                </Box>
              </Box>
              
              {stats.lowStock > 0 && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant="body2">
                    {stats.lowStock} items are running low on stock
                  </Typography>
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default DashboardPage; 