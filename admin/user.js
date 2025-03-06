import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from '../menu2';


export default function User() {
  const [products, setProducts] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const anchorRef = useRef(null);

  const toggleSideMenu = () => {
    setSideMenuActive(!sideMenuActive);
  };

  const handleCartClick = () => {
    navigate('/kosar');
  };

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

  useEffect(() => {
    const handleKeyPress = (event) => {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      if (event.ctrlKey && event.shiftKey && event.key === 'Q') {
        if (user && user.email === 'adaliclothing@gmail.com') {
          navigate('/vinted');
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
  

   
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch('http://localhost:5000/products');
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.log('Hiba:', error);
        }
      };
      fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
      const megerosites = window.confirm("Biztosan törölni szeretnéd ezt a terméket?");
    
      if (megerosites) {
        try {
          const response = await fetch(`http://localhost:5000/products/${productId}`, {
            method: 'DELETE'
          });
        
          if (response.ok) {
            setProducts(products.filter(product => product.id !== productId));
          }
        } catch (error) {
          console.log('Törlési hiba:', error);
        }
      }
    };
  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#333' : '#f5f5f5',
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
            color: 'white',
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
                  <Grow {...TransitionProps}>
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
                to="/tadmin"
                sx={{
                  color: '#fff',
                  border: '1px solid #fff',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  marginRight: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Új termék feltöltése
              </Button>

              <Button
                component={Link}
                to="/termadmin"
                sx={{
                  color: '#fff',
                  border: '1px solid #fff',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  marginRight: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Termékek szerkesztése
              </Button>
              <Button component={Link} to="/sign" sx={{ color: 'white', border: '1px solid white' }}>
                Sign In
              </Button>
              <Button component={Link} to="/signup" sx={{ color: 'white', border: '1px solid white' }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </div>

      {/* Side Menu */}
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

      {/* Rest of the content */}
      <Container>
        <Typography variant="h4" sx={{ mb: 4, color: darkMode ? 'white' : 'black' }}>
          Admin Felület
        </Typography>

        <FormGroup sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </FormGroup>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ 
                height: '500px',
                backgroundColor: darkMode ? '#444' : 'white',
                color: darkMode ? 'white' : 'black'
              }}>
                <Box sx={{ position: 'relative', height: '350px' }}>
                  <CardMedia
                    component="img"
                    sx={{ 
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain'
                    }}
                    image={product.imageUrl}
                    alt={product.title}
                  />
                  <Box sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1
                  }}>
                    <IconButton
                      onClick={() => handleDelete(product.id)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { backgroundColor: 'red', color: 'white' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { backgroundColor: 'blue', color: 'white' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6">
                    {product.title}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.price} Ft
                  </Typography>
                  <Typography variant="body2">
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}