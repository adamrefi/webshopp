import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  Avatar,
  Grid,
  Paper,
  Divider,
  IconButton,
  FormGroup,
  FormControlLabel,
  Switch,
  Badge,
  Stack
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Menu from './menu2';

export default function Fiokom() {
  const [userData, setUserData] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const navigate = useNavigate();
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartItemCount = cartItems.reduce((total, item) => total + item.mennyiseg, 0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("Retrieved user data:", user); // Debug log
    if (user) {
      setUserData({
       
        email: user.email
      });
    }
  }, []);
  

  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const count = JSON.parse(localStorage.getItem('orderCount')) || 0;
    setOrderCount(count);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.f_azonosito) {  // Check if f_azonosito exists
        try {
          const response = await fetch(`http://localhost:5000/orders/${user.f_azonosito}`);
          const data = await response.json();
          setOrders(data);
          console.log("User ID:", user.f_azonosito); // Debug log
        } catch (error) {
          console.log('Error fetching orders:', error);
        }
      }
    };    fetchOrders();
  }, []);
  const toggleSideMenu = () => {
    setSideMenuActive(!sideMenuActive);
  };

  const handleCartClick = () => {
    navigate('/kosar');
  };

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#222' : '#f5f5f5',
      minHeight: '100vh',
      pb: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: darkMode ? 
          'linear-gradient(45deg, #2a2a2a 25%, transparent 25%, transparent 75%, #2a2a2a 75%, #2a2a2a), linear-gradient(45deg, #2a2a2a 25%, transparent 25%, transparent 75%, #2a2a2a 75%, #2a2a2a)' :
          'linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0), linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        opacity: 0.2,
        zIndex: 0
      }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        padding: '10px 20px',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <IconButton onClick={toggleSideMenu} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h1" sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 'bold',
          fontSize: '2rem',
          color: 'white',
          margin: 0,
        }}>
          Adali Clothing
        </Typography>

        <IconButton
          onClick={handleCartClick}
          sx={{
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <Badge 
            badgeContent={cartItemCount} 
            color="primary"
            sx={{ 
              '& .MuiBadge-badge': { 
                backgroundColor: '#fff', 
                color: '#333' 
              } 
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      <Box sx={{
        position: 'fixed',
        top: 0,
        left: sideMenuActive ? 0 : '-250px',
        width: '250px',
        height: '100%',
        backgroundColor: '#fff',
        transition: 'left 0.3s',
        zIndex: 1200,
      }}>
        <Menu sideMenuActive={sideMenuActive} toggleSideMenu={toggleSideMenu} />
      </Box>

      <FormGroup sx={{ position: 'absolute', top: 80, right: 20, zIndex: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
          }
          label={<Typography sx={{ color: darkMode ? 'white' : 'black' }}>Dark Mode</Typography>}
        />
      </FormGroup>

      <Container maxWidth="lg" sx={{ 
        mt: 8,
        backgroundColor: darkMode ? '#333' : '#f0f0f0',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              backgroundColor: darkMode ? '#1c1c1c' : 'white',
              color: darkMode ? 'white' : 'black',
              borderRadius: '16px'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    margin: '0 auto 20px',
                    backgroundColor: '#1976d2',
                    fontSize: '3rem'
                  }}
                >
                  {userData?.username?.charAt(0)?.toUpperCase() || 'A'}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {userData?.username || 'Felhasználó'}
                </Typography>
                
                <Typography variant="body1" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                  {userData?.email || 'Email cím nincs megadva'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Paper sx={{ 
                p: 3, 
                backgroundColor: darkMode ? '#1c1c1c' : 'white',
                color: darkMode ? 'white' : 'black',
                borderRadius: '16px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  color: '#1976d2'
                }}>
                  <PersonIcon /> Személyes Információk
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                      Felhasználónév
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {userData?.username || 'Nincs megadva'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                      Email Cím
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {userData?.email || 'Nincs megadva'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ 
                p: 3, 
                backgroundColor: darkMode ? '#1c1c1c' : 'white',
                color: darkMode ? 'white' : 'black',
                borderRadius: '16px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  color: '#1976d2'
                }}>
                  <SecurityIcon /> Fiók Statisztika
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={6} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocalShippingIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h6">{orderCount}</Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                        Rendelések
                    </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <FavoriteIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                      <Typography variant="h6">0</Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                        Kedvencek
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CalendarTodayIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                      <Typography variant="h6">
                        {new Date().toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                        Regisztráció
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
