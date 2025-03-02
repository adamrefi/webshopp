
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  FormGroup,
  FormControlLabel,
  Switch,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from './menu2';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const anchorRef = React.useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        console.log('Fetching product ID:', id);
        const response = await fetch(`http://localhost:5000/products/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Product data received:', data);
        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserName(user.username || user.felhasznalonev || 'Felhasználó');
      }
    };
    checkLoginStatus();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event = {}) => {
    if (event.target && anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setOpen(false);
    navigate('/sign');
  };

  const toggleSideMenu = () => {
    setSideMenuActive((prev) => !prev);
  };

  const handleCartClick = () => {
    navigate('/kosar');
  };
    const addToCart = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/sign');
        return;
      }

      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItem = cartItems.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.mennyiseg += 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } else {
        const newItem = {
          ...product,
          mennyiseg: 1
        };
        cartItems.push(newItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }

      navigate('/kosar');
    };
  if (!product) return <div>Loading...</div>;

  return (
    <div style={{
      backgroundColor: darkMode ? '#555' : '#f5f5f5',
      color: darkMode ? 'white' : 'black',
      minHeight: '100vh',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: darkMode ? '#333' : '#333',
        padding: '10px 20px',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <IconButton
          onClick={toggleSideMenu}
          style={{ color: darkMode ? 'white' : 'white' }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h1"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 'bold',
            fontSize: '2rem',
            color: darkMode ? 'white' : 'white',
            margin: 0,
          }}
        >
          Adali Clothing
        </Typography>

        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <IconButton
                onClick={handleCartClick}
                sx={{
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ShoppingCartIcon />
              </IconButton>
              <Button
                ref={anchorRef}
                onClick={handleToggle}
                sx={{
                  color: '#fff',
                  zIndex: 1300,
                  border: '1px solid #fff',
                  borderRadius: '5px',
                  padding: '5px 10px',
                }}
              >
                Profil
              </Button>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 1300 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                          <MenuItem onClick={handleClose}>{userName} profilja</MenuItem>
                          <MenuItem onClick={handleClose}>Fiókom</MenuItem>
                          <MenuItem onClick={handleLogout}>Kijelentkezés</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          ) : (
            <>
              <Button
                component={Link}
                to="/sign"
                sx={{
                  color: '#fff',
                  border: '1px solid #fff',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#333',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                sx={{
                  color: '#fff',
                  border: '1px solid #fff',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#333',
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </div>

      <Box sx={{
        position: 'fixed',
        top: 0,
        left: sideMenuActive ? 0 : '-250px',
        width: '250px',
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 1200,
        transition: 'left 0.1s ease-in-out',
      }}>
        <Menu sideMenuActive={sideMenuActive} toggleSideMenu={toggleSideMenu} />
      </Box>

      <FormGroup sx={{ position: 'absolute', top: 60, right: 20 }}>
        <FormControlLabel
          control={
            <Switch
              color="default"
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
            />
          }
          label="Dark Mode"
        />
      </FormGroup>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Card sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          backgroundColor: darkMode ? '#333' : 'white',
          color: darkMode ? 'white' : 'black',
        }}>
          <CardMedia
            component="img"
            sx={{ 
              width: { md: '50%' },
              height: '600px',
              objectFit: 'contain'
            }}
            image={product.imageUrl}
            alt={product.nev}
          />
          <CardContent sx={{ 
            width: { md: '50%' },
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <Typography variant="h4" component="h1">
              {product.nev}
            </Typography>
            <Typography variant="h5" color="primary">
              {product.ar} Ft
            </Typography>
            <Typography variant="body1">
              {product.leiras}
            </Typography>
            <Typography variant="body1">
              Méret: {product.meret}
            </Typography>
            <Button 
  variant="contained" 
  size="large"
  onClick={addToCart}
  sx={{ 
    mt: 'auto',
    backgroundColor: darkMode ? '#555' : 'primary.main',
    '&:hover': {
      backgroundColor: darkMode ? '#666' : 'primary.dark',
    }
  }}
>
  Kosárba
</Button>

          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
