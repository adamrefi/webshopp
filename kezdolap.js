import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  IconButton, 
  FormGroup, 
  FormControlLabel, 
  Switch, 
  Box,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Stack,
  Container,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo2 from './logo2.png';
import Menu from './menu2';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartItemCount = cartItems.reduce((total, item) => total + item.mennyiseg, 0);

  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event = {}) => {
    // In the MenuList component, update the "Fiókom" MenuItem:
  
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

  useEffect(() => {
    if (sideMenuActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [sideMenuActive]);

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

  return (
    <div style={{
      backgroundColor: darkMode ? '#555' : '#f5f5f5',
      color: darkMode ? 'white' : 'black',
      minHeight: '100vh',
    }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: sideMenuActive ? 0 : '-250px',
          width: '250px',
          height: '100%',
          backgroundColor: '#fff',
          boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 1200,
          transition: 'left 0.1s ease-in-out',
        }}
      >
        <IconButton
          onClick={toggleSideMenu}
          sx={{
            position: 'absolute',
            zIndex: 1300,
            top: '10px',
            right: '10px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Menu sideMenuActive={sideMenuActive} toggleSideMenu={toggleSideMenu} />
      </Box>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: darkMode ? '#333' : '#333',
          padding: '10px 20px',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
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
                  sx={{ zIndex: 1300 }}  // Ez az érték magasabb mint a dark mode switch z-indexe
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
                            <MenuItem onClick={() => {
      handleClose();
      navigate('/fiokom');
    }}>
      Fiókom
    </MenuItem>
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

      <FormGroup
        sx={{
          position: 'absolute',
          top: 60,
          right: 20,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              color="default"
              sx={{
                color: 'black',
              }}
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
            />
          }
          label="Dark Mode"
        />
      </FormGroup>

      <div
        style={{
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <Typography
          variant="h1"
          style={{
            fontSize: '36px',
          }}
        >
          Üdvözlünk az Adali Clothing Webáruházban
        </Typography>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          padding: '20px',
          backgroundColor: darkMode ? '#444' : '#fafafa',
        }}
      >
        <div
          style={{
            flex: '1 1 300px',
            maxWidth: '600px',
            textAlign: 'center',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            backgroundColor: darkMode ? '#555' : '#fff',
          }}
        >
          <Link to="/collection">
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={logo2}
                alt="Collection"
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
          </Link>
          <Typography
            variant="body1"
            style={{
              fontSize: '18px',
              padding: '10px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              marginTop: '10px',
            }}
          >
            Nézd meg az új kollekciónkat
          </Typography>
        </div>

        <div
          style={{
            flex: '1 1 300px',
            maxWidth: '600px',
            textAlign: 'center',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            backgroundColor: darkMode ? '#555' : '#fff',
          }}
        >
          <Link to="/oterm">
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={logo2}
                alt="All Products"
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
          </Link>
          <Typography
            variant="body1"
            style={{
              fontSize: '18px',
              padding: '10px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              marginTop: '10px',
            }}
          >
            Nézd meg az összes termékünket
          </Typography>
        </div>

        <div
          style={{
            flex: '1 1 300px',
            maxWidth: '600px',
            textAlign: 'center',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            backgroundColor: darkMode ? '#555' : '#fff',
          }}
        >
          <Link to="/add">
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src={logo2}
              alt="Empty"
              style={{
                width: '100%',
                height: '500px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>
          </Link>
          <Typography
            variant="body1"
            style={{
              fontSize: '18px',
              padding: '10px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              marginTop: '10px',
            }}
          >
            Töltsd fel a ruháidat
          </Typography>
        </div>
      </div>

      <Box 
        sx={{ 
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          position: 'relative',
          marginTop: '50px',
          backgroundColor: darkMode ? '#444' : '#f0f0f0'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            position: 'absolute',
            whiteSpace: 'nowrap',
            animation: 'slideAnimation 20s linear infinite'
          }}
        >
          {[...Array(6)].map((_, index) => (
            <Box 
              key={index}
              component="img" 
              src={logo2} 
              sx={{ 
                height: 180, 
                m: 1,
                filter: darkMode ? 'brightness(0.8)' : 'none'
              }} 
            />
          ))}
        </Box>
        <style>
          {`
            @keyframes slideAnimation {
              from { transform: translateX(100%); }
              to { transform: translateX(-100%); }
            }
          `}
        </style>
      </Box>
    </div>
  );
};

export default Home;