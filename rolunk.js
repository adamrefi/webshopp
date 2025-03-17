import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  IconButton,
  Button,
  Divider,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate, Link } from 'react-router-dom';
import Footer from './footer';
import Menu from './menu2';
import logo2 from './logo2.png';
import mutyImage from './muty.jpeg';
import adamImage from './adam.jpeg';

// Stílusos komponensek
const StyledSection = styled(Box)(({ theme, darkMode }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: darkMode ? '#333' : '#f5f5f5',
  backgroundImage: darkMode 
    ? 'radial-gradient(#444 1px, transparent 1px)'
    : 'radial-gradient(#e0e0e0 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  transition: 'all 0.3s ease-in-out',
}));

const StyledCard = styled(Card)(({ theme, darkMode }) => ({
  backgroundColor: darkMode ? 'rgba(51, 51, 51, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: darkMode
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transform: 'translateY(0)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: darkMode
      ? '0 12px 40px rgba(0, 0, 0, 0.4)'
      : '0 12px 40px rgba(0, 0, 0, 0.15)'
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const TeamMember = styled(Box)(({ theme, darkMode }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
  }
}));

const AboutUs = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

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

  const toggleSideMenu = () => {
    setSideMenuActive((prev) => !prev);
  };

  const handleCartClick = () => {
    navigate('/kosar');
  };

  // Animált megjelenés
  const fadeIn = {
    opacity: 0,
    animation: 'fadeIn 0.8s forwards',
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    }
  };

  return (
    <Box sx={{
      backgroundColor: darkMode ? '#333' : '#f5f5f5',
      backgroundImage: darkMode 
        ? 'radial-gradient(#444 1px, transparent 1px)'
        : 'radial-gradient(#e0e0e0 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      color: darkMode ? 'white' : 'black',
      minHeight: '100vh',
      transition: 'all 0.3s ease-in-out'
    }}>
      {/* Side Menu */}
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

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#333',
          padding: '10px 20px',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          borderBottom: '3px solid #ffffff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '10px',
        }}
      >
        <IconButton
          onClick={toggleSideMenu}
          sx={{ color: 'white' }}
        >
          <MenuIcon />
        </IconButton>
      
        <Typography 
          variant="h1"
          sx={{
            fontWeight: 'bold',
            fontSize: {
              xs: '1.1rem',
              sm: '1.5rem',
              md: '2rem'
            },
            textAlign: 'center',
            color: 'white',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            pointerEvents: 'none'
          }}
        >
          Adali Clothing
        </Typography>

        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isLoggedIn ? (
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
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: {
                xs: 'flex-end',
                sm: 'flex-end'
              },
              gap: {
                xs: '5px',
                sm: '10px'
              }
            }}>
              <Button
                component={Link}
                to="/sign"
                sx={{
                  color: '#fff',
                  border: '1px solid #fff',
                  borderRadius: '5px',
                  padding: {
                    xs: '2px 6px',
                    sm: '4px 9px',
                    md: '5px 10px'
                  },
                  fontSize: {
                    xs: '0.65rem',
                    sm: '0.85rem',
                    md: '0.875rem'
                  },
                  margin: {
                    xs: '0 2px',
                    sm: '0 7px',
                    md: '0 10px'
                  },
                  minWidth: {
                    xs: '50px',
                    sm: '80px',
                    md: '90px'
                  },
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
                  padding: {
                    xs: '2px 6px',
                    sm: '4px 9px',
                    md: '5px 10px'
                  },
                  fontSize: {
                    xs: '0.65rem',
                    sm: '0.85rem',
                    md: '0.875rem'
                  },
                  margin: {
                    xs: '0 2px',
                    sm: '0 7px',
                    md: '0 10px'
                  },
                  minWidth: {
                    xs: '50px',
                    sm: '80px',
                    md: '90px'
                  },
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#333',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Hero Section */}
      <StyledSection darkMode={darkMode}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            ...fadeIn,
            animationDelay: '0.1s'
          }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem',
                  md: '3rem'
                },
                mb: 2,
                background: darkMode
                  ? 'linear-gradient(45deg, #fff, #ccc)'
                  : 'linear-gradient(45deg, #333, #666)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Rólunk
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: darkMode ? '#ccc' : '#666',
                maxWidth: '800px',
                margin: '0 auto',
                fontSize: {
                  xs: '1rem',
                  sm: '1.25rem',
                  md: '1.5rem'
                },
              }}
            >
              Ismerd meg az Adali Clothing történetét és küldetését
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} sx={{ ...fadeIn, animationDelay: '0.3s' }}>
              <Box 
                component="img" 
                src={logo2} 
                alt="Adali Clothing" 
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: darkMode
                    ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ ...fadeIn, animationDelay: '0.5s' }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 3,
                    fontWeight: 600,
                    color: darkMode ? '#fff' : '#333',
                    fontSize: {
                      xs: '1.5rem',
                      sm: '1.75rem',
                      md: '2rem'
                    },
                  }}
                >
                  Történetünk
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    color: darkMode ? '#ccc' : '#666',
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                      md: '1.2rem'
                    },
                    lineHeight: 1.8
                  }}
                >
                  Az Adali Clothing 2020-ban indult, amikor alapítóink felismerték, hogy a divatipar fenntarthatóbb és etikusabb megközelítést igényel. Célunk kezdettől fogva az volt, hogy olyan ruhákat kínáljunk, amelyek nem csak stílusosak, hanem környezetbarát anyagokból készülnek és fair trade elvek mentén gyártjuk őket.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#ccc' : '#666',
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                      md: '1.2rem'
                    },
                    lineHeight: 1.8
                  }}
                >
                  Az évek során kis vállalkozásból országos ismertségű márkává nőttünk, de alapértékeink változatlanok maradtak: minőség, fenntarthatóság és a vásárlóink elégedettsége.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </StyledSection>

      {/* Mission Section */}
      <Box sx={{ 
        backgroundColor: darkMode ? '#2d2d2d' : '#fff',
        py: 8,
        transition: 'all 0.3s ease-in-out'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            ...fadeIn,
            animationDelay: '0.7s'
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                color: darkMode ? '#fff' : '#333',
                fontSize: {
                  xs: '1.75rem',
                  sm: '2.25rem',
                  md: '2.5rem'
                },
              }}
              >
              Küldetésünk és Értékeink
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '0.9s' }}>
              <StyledCard darkMode={darkMode}>
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: darkMode ? '#fff' : '#333',
                      fontSize: {
                        xs: '1.25rem',
                        sm: '1.5rem'
                      },
                    }}
                  >
                    Fenntarthatóság
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: darkMode ? '#ccc' : '#666',
                      fontSize: {
                        xs: '0.9rem',
                        sm: '1rem'
                      },
                      lineHeight: 1.7,
                      flex: 1
                    }}
                  >
                    Elkötelezettek vagyunk a környezetvédelem mellett. Ruháink nagy része újrahasznosított vagy organikus anyagokból készül, és folyamatosan dolgozunk azon, hogy csökkentsük ökológiai lábnyomunkat a gyártási folyamat minden szakaszában.
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '1.1s' }}>
              <StyledCard darkMode={darkMode}>
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: darkMode ? '#fff' : '#333',
                      fontSize: {
                        xs: '1.25rem',
                        sm: '1.5rem'
                      },
                    }}
                  >
                    Minőség
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: darkMode ? '#ccc' : '#666',
                      fontSize: {
                        xs: '0.9rem',
                        sm: '1rem'
                      },
                      lineHeight: 1.7,
                      flex: 1
                    }}
                  >
                    Minden termékünket gondosan tervezzük és készítjük, hogy tartós és időtálló legyen. Hisszük, hogy a minőségi ruhadarabok nemcsak jobban néznek ki, de hosszabb élettartamuk révén környezetbarátabbak is.
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '1.3s' }}>
              <StyledCard darkMode={darkMode}>
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: darkMode ? '#fff' : '#333',
                      fontSize: {
                        xs: '1.25rem',
                        sm: '1.5rem'
                      },
                    }}
                  >
                    Közösség
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: darkMode ? '#ccc' : '#666',
                      fontSize: {
                        xs: '0.9rem',
                        sm: '1rem'
                      },
                      lineHeight: 1.7,
                      flex: 1
                    }}
                  >
                    Az Adali Clothing több mint egy ruhamárka - egy közösség vagyunk. Támogatjuk a helyi kezdeményezéseket, és bevételeink egy részét jótékonysági szervezeteknek adományozzuk, hogy pozitív változást hozzunk a világba.
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <StyledSection darkMode={darkMode}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            ...fadeIn,
            animationDelay: '1.5s'
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                color: darkMode ? '#fff' : '#333',
                fontSize: {
                  xs: '1.75rem',
                  sm: '2.25rem',
                  md: '2.5rem'
                },
              }}
            >
              Csapatunk
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: darkMode ? '#ccc' : '#666',
                maxWidth: '800px',
                margin: '0 auto',
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.1rem'
                },
              }}
            >
              Ismerd meg a szenvedélyes szakembereket, akik az Adali Clothing mögött állnak
            </Typography>
          </Box>

          <Grid 
  container 
  spacing={2} 
  sx={{ 
    justifyContent: 'center',  // Ez középre igazítja a Grid elemeket vízszintesen
    mb: 4  // Kis alsó margó a jobb elrendezésért
  }}
>
  <Grid item xs={12} sm={6} md={3} sx={{ ...fadeIn, animationDelay: '1.9s' }}>
    <TeamMember darkMode={darkMode}>
      <Avatar
        sx={{
          width: 120,
          height: 120,
          margin: '0 auto 16px',
          border: darkMode ? '4px solid rgba(255,255,255,0.1)' : '4px solid rgba(0,0,0,0.05)'
        }}
        alt="Réfi Ádám"
        src={adamImage} 
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: darkMode ? '#fff' : '#333',
          mb: 1
        }}
      >
        Réfi Ádám
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: darkMode ? '#aaa' : '#666',
          mb: 2
        }}
      >
        Üzleti Igazgató
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
  <IconButton 
    size="small" 
    sx={{ color: darkMode ? '#aaa' : '#666' }}
    component="a"
    href="https://www.facebook.com/ref.adam_"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FacebookIcon fontSize="small" />
  </IconButton>
  <IconButton size="small" sx={{ color: darkMode ? '#aaa' : '#666' }}>
    <TwitterIcon fontSize="small" />
  </IconButton>
  <IconButton size="small" sx={{ color: darkMode ? '#aaa' : '#666' }}>
    <LinkedInIcon fontSize="small" />
  </IconButton>
</Box>
    </TeamMember>
  </Grid>

  <Grid item xs={12} sm={6} md={3} sx={{ ...fadeIn, animationDelay: '2.1s' }}>
    <TeamMember darkMode={darkMode}>
      <Avatar
        sx={{
          width: 120,
          height: 120,
          margin: '0 auto 16px',
          border: darkMode ? '4px solid rgba(255,255,255,0.1)' : '4px solid rgba(0,0,0,0.05)'
        }}
        alt="Csali Máté"
        src={mutyImage} 
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: darkMode ? '#fff' : '#333',
          mb: 1
        }}
      >
        Csali Máté
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: darkMode ? '#aaa' : '#666',
          mb: 2
        }}
      >
        Technológiai Vezető
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
  <IconButton 
    size="small" 
    sx={{ color: darkMode ? '#aaa' : '#666' }}
    component="a"
    href="https://www.instagram.com/csl._.mate/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <InstagramIcon fontSize="small" />
  </IconButton>
  <IconButton size="small" sx={{ color: darkMode ? '#aaa' : '#666' }}>
    <TwitterIcon fontSize="small" />
  </IconButton>
  <IconButton size="small" sx={{ color: darkMode ? '#aaa' : '#666' }}>
    <LinkedInIcon fontSize="small" />
  </IconButton>
</Box>

    </TeamMember>
  </Grid>
</Grid>

        </Container>
      </StyledSection>

      {/* Milestones Section */}
      <Box sx={{ 
        backgroundColor: darkMode ? '#2d2d2d' : '#fff',
        py: 8,
        transition: 'all 0.3s ease-in-out'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            ...fadeIn,
            animationDelay: '2.5s'
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                color: darkMode ? '#fff' : '#333',
                fontSize: {
                  xs: '1.75rem',
                  sm: '2.25rem',
                  md: '2.5rem'
                },
              }}
            >
              Mérföldköveink
            </Typography>
          </Box>

          <Box sx={{ 
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: { xs: '20px', md: '50%' },
              width: '4px',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              transform: { md: 'translateX(-50%)' }
            }
          }}>
            {/* 2020 */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              mb: 6,
              position: 'relative',
              ...fadeIn,
              animationDelay: '2.7s'
            }}>
                          <Box sx={{
                flex: { xs: '1', md: '0 0 50%' },
                textAlign: { xs: 'left', md: 'right' },
                pr: { md: 4 },
                pl: { xs: 5, md: 0 },
                position: 'relative'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: darkMode ? '#fff' : '#333',
                    mb: 1,
                    fontSize: {
                      xs: '1.25rem',
                      sm: '1.5rem'
                    },
                  }}
                >
                  2020
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#ccc' : '#666',
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem'
                    },
                    lineHeight: 1.7
                  }}
                >
                  Az Adali Clothing megalapítása. Első kollekciónk bemutatása, amely 15 fenntartható alapdarabból állt.
                </Typography>
                <Box sx={{
                  position: 'absolute',
                  left: { xs: '-40px', md: 'auto' },
                  right: { md: '-52px' },
                  top: '0',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#fff' : '#333',
                  border: darkMode ? '4px solid #333' : '4px solid #fff',
                  zIndex: 1
                }} />
              </Box>
              <Box sx={{ 
                flex: { xs: '1', md: '0 0 50%' },
                pl: { md: 4 },
                pl: { xs: 5, md: 4 },
                display: { xs: 'none', md: 'block' }
              }} />
            </Box>

            {/* 2021 */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              mb: 6,
              position: 'relative',
              ...fadeIn,
              animationDelay: '2.9s'
            }}>
              <Box sx={{ 
                flex: { xs: '1', md: '0 0 50%' },
                pr: { md: 4 },
                pl: { xs: 5, md: 0 },
                display: { xs: 'none', md: 'block' }
              }} />
              <Box sx={{
                flex: { xs: '1', md: '0 0 50%' },
                textAlign: { xs: 'left', md: 'left' },
                pl: { md: 4 },
                pl: { xs: 5, md: 4 },
                position: 'relative'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: darkMode ? '#fff' : '#333',
                    mb: 1,
                    fontSize: {
                      xs: '1.25rem',
                      sm: '1.5rem'
                    },
                  }}
                >
                  2021
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#ccc' : '#666',
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem'
                    },
                    lineHeight: 1.7
                  }}
                >
                  Első üzletünk megnyitása Budapesten. Elindítottuk online webáruházunkat, hogy országszerte elérhetővé tegyük termékeinket.
                </Typography>
                <Box sx={{
                  position: 'absolute',
                  left: { xs: '-40px', md: '-52px' },
                  top: '0',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#fff' : '#333',
                  border: darkMode ? '4px solid #333' : '4px solid #fff',
                  zIndex: 1
                }} />
              </Box>
            </Box>

            {/* 2022 */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              mb: 6,
              position: 'relative',
              ...fadeIn,
              animationDelay: '3.1s'
            }}>
              <Box sx={{
                flex: { xs: '1', md: '0 0 50%' },
                textAlign: { xs: 'left', md: 'right' },
                pr: { md: 4 },
                pl: { xs: 5, md: 0 },
                position: 'relative'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: darkMode ? '#fff' : '#333',
                    mb: 1,
                    fontSize: {
                      xs: '1.25rem',
                      sm: '1.5rem'
                    },
                  }}
                >
                  2022
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#ccc' : '#666',
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem'
                    },
                    lineHeight: 1.7
                  }}
                >
                  Elnyertük az "Év Fenntartható Divatmárkája" díjat. Kollekciónk kibővült, és megkezdtük a nemzetközi terjeszkedést.
                </Typography>
                <Box sx={{
                  position: 'absolute',
                  left: { xs: '-40px', md: 'auto' },
                  right: { md: '-52px' },
                  top: '0',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#fff' : '#333',
                  border: darkMode ? '4px solid #333' : '4px solid #fff',
                  zIndex: 1
                }} />
              </Box>
              <Box sx={{ 
                flex: { xs: '1', md: '0 0 50%' },
                pl: { md: 4 },
                pl: { xs: 5, md: 4 },
                display: { xs: 'none', md: 'block' }
              }} />
            </Box>

            {/* 2023 */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              mb: 6,
              position: 'relative',
              ...fadeIn,
              animationDelay: '3.3s'
            }}>
              <Box sx={{ 
                flex: { xs: '1', md: '0 0 50%' },
                pr: { md: 4 },
                pl: { xs: 5, md: 0 },
                display: { xs: 'none', md: 'block' }
              }} />
              <Box sx={{
                flex: { xs: '1', md: '0 0 50%' },
                textAlign: { xs: 'left', md: 'left' },
                pl: { md: 4 },
                pl: { xs: 5, md: 4 },
                position: 'relative'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: darkMode ? '#fff' : '#333',
                    mb: 1,
                    fontSize: {
                      xs: '1.25rem',
                      sm: '1.5rem'
                    },
                  }}
                >
                  2023
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#ccc' : '#666',
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem'
                    },
                    lineHeight: 1.7
                  }}
                >
                  Elindítottuk "Zöld Jövő" programunkat, amelynek keretében minden eladott termék után egy fát ültetünk. Megnyitottuk második üzletünket Debrecenben.
                </Typography>
                <Box sx={{
                  position: 'absolute',
                  left: { xs: '-40px', md: '-52px' },
                  top: '0',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#fff' : '#333',
                  border: darkMode ? '4px solid #333' : '4px solid #fff',
                  zIndex: 1
                }} />
              </Box>
            </Box>

            {/* 2024 */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              position: 'relative',
              ...fadeIn,
              animationDelay: '3.5s'
            }}>
              <Box sx={{
                flex: { xs: '1', md: '0 0 50%' },
                textAlign: { xs: 'left', md: 'right' },
                pr: { md: 4 },
                pl: { xs: 5, md: 0 },
                position: 'relative'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: darkMode ? '#fff' : '#333',
                    mb: 1,
                    fontSize: {
                      xs: '1.25rem',
                      sm: '1.5rem'
                    },
                  }}
                >
                  2024
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#ccc' : '#666',
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem'
                    },
                    lineHeight: 1.7
                  }}
                >
                  Jelenleg azon dolgozunk, hogy 2025-re teljesen karbonsemlegessé váljunk. Új, innovatív anyagokkal kísérletezünk, és bővítjük termékpalettánkat.
                </Typography>
                <Box sx={{
                  position: 'absolute',
                  left: { xs: '-40px', md: 'auto' },
                  right: { md: '-52px' },
                  top: '0',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#fff' : '#333',
                  border: darkMode ? '4px solid #333' : '4px solid #fff',
                  zIndex: 1
                }} />
              </Box>
              <Box sx={{ 
                flex: { xs: '1', md: '0 0 50%' },
                pl: { md: 4 },
                pl: { xs: 5, md: 4 },
                display: { xs: 'none', md: 'block' }
              }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <StyledSection darkMode={darkMode}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            ...fadeIn,
            animationDelay: '3.7s'
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                color: darkMode ? '#fff' : '#333',
                fontSize: {
                  xs: '1.75rem',
                  sm: '2.25rem',
                  md: '2.5rem'
                },
              }}
            >
              Vásárlóink Mondták
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '3.9s' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  height: '100%',
                  position: 'relative',
                  '&::before': {
                    content: '"-"',
                    position: 'absolute',
                    top: '10px',
                    left: '15px',
                    fontSize: '60px',
                    color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1
                  }
                }}
              >
                <Box sx={{ pl: 4, pt: 3 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: darkMode ? '#ccc' : '#666',
                      fontSize: {
                        xs: '0.9rem',
                        sm: '1rem'
                      },
                      lineHeight: 1.7,
                      mb: 2,
                      fontStyle: 'italic'
                    }}
                  >
                    "Az Adali Clothing ruhái nemcsak gyönyörűek, hanem rendkívül kényelmesek is. Szeretem, hogy vásárlásommal a környezetet is támogatom."
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: darkMode ? '#fff' : '#333'
                    }}
                  >
                    Horváth Júlia
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? '#aaa' : '#888'
                    }}
                  >
                    Törzsvásárló
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '4.1s' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  height: '100%',
                  position: 'relative',
                  '&::before': {
                    content: '"-"',
                    position: 'absolute',
                    top: '10px',
                    left: '15px',
                    fontSize: '60px',
                    color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1
                  }
                }}
              >
                <Box sx={{ pl: 4, pt: 3 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: darkMode ? '#ccc' : '#666',
                      fontSize: {
                        xs: '0.9rem',
                        sm: '1rem'
                      },
                      lineHeight: 1.7,
                      mb: 2,
                      fontStyle: 'italic'
                    }}
                  >
                    "Imádom az Adali Clothing filozófiáját és termékeiket. A pulóverek minősége kiemelkedő, és már három éve hordom őket, még mindig úgy néznek ki, mint újkorukban."
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: darkMode ? '#fff' : '#333'
                    }}
                  >
                    Molnár Gábor
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? '#aaa' : '#888'
                    }}
                  >
                    Divattervező
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '4.3s' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  height: '100%',
                  position: 'relative',
                  '&::before': {
                    content: '"-"',
                    position: 'absolute',
                    top: '10px',
                    left: '15px',
                    fontSize: '60px',
                    color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1
                  }
                }}
              >
                <Box sx={{ pl: 4, pt: 3 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: darkMode ? '#ccc' : '#666',
                      fontSize: {
                        xs: '0.9rem',
                        sm: '1rem'
                      },
                      lineHeight: 1.7,
                      mb: 2,
                      fontStyle: 'italic'
                    }}
                  >
                    "Az Adali Clothing ügyfélszolgálata kiváló. Amikor problémám volt egy rendeléssel, azonnal segítettek és megoldották. Ritka az ilyen odafigyelés manapság."
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: darkMode ? '#fff' : '#333'
                    }}
                  >
                    Kiss Bence
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? '#aaa' : '#888'
                    }}
                  >
                    Marketing szakember
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </StyledSection>

      {/* Contact Section */}
      <Box sx={{ 
        backgroundColor: darkMode ? '#2d2d2d' : '#fff',
        py: 8,
        transition: 'all 0.3s ease-in-out'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            ...fadeIn,
            animationDelay: '4.5s'
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                color: darkMode ? '#fff' : '#333',
                fontSize: {
                  xs: '1.75rem',
                  sm: '2.25rem',
                  md: '2.5rem'
                },
              }}
            >
              Kapcsolat
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: darkMode ? '#ccc' : '#666',
                maxWidth: '800px',
                margin: '0 auto',
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.1rem'
                },
              }}
            >
              Kérdésed van? Vedd fel velünk a kapcsolatot!
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} sx={{ ...fadeIn, animationDelay: '4.7s' }}>
              <StyledCard darkMode={darkMode}>
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600,
                      color: darkMode ? '#fff' : '#333',
                      fontSize: {
                        xs: '1.25rem',
                        sm: '1.5rem'
                      },
                    }}
                  >
                    Elérhetőségeink
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#fff' : '#333',
                        mb: 1
                      }}
                    >
                      Központi Iroda
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: darkMode ? '#ccc' : '#666',
                        fontSize: {
                          xs: '0.9rem',
                          sm: '1rem'
                        },
                        lineHeight: 1.7
                      }}
                    >
                     Káptalanfa: 8471 Budapest, Dózsa utca 10.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#fff' : '#333',
                        mb: 1
                      }}
                    >
                      Üzleteink
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: darkMode ? '#ccc' : '#666',
                        fontSize: {
                          xs: '0.9rem',
                          sm: '1rem'
                        },
                        lineHeight: 1.7,
                        mb: 1
                      }}
                    >
                     Káptalanfa: 8471 Budapest, Dózsa utca 10.
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: darkMode ? '#ccc' : '#666',
                        fontSize: {
                          xs: '0.9rem',
                          sm: '1rem'
                        },
                        lineHeight: 1.7
                      }}
                    >
                      Balatonederics: 8312 Balatonederics, Piac utca 25.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#fff' : '#333',
                        mb: 1
                      }}
                    >
                      Ügyfélszolgálat
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: darkMode ? '#ccc' : '#666',
                        fontSize: {
                          xs: '0.9rem',
                          sm: '1rem'
                        },
                        lineHeight: 1.7,
                        mb: 1
                      }}
                    >
                      Telefon: +36306456285
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: darkMode ? '#ccc' : '#666',
                        fontSize: {
                          xs: '0.9rem',
                          sm: '1rem'
                        },
                        lineHeight: 1.7
                      }}
                    >
                      Email: adaliclothing@gmail.com
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#fff' : '#333',
                        mb: 1
                      }}
                    >
                      Kövess minket
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton sx={{ color: darkMode ? '#aaa' : '#666' }}>
                        <FacebookIcon />
                      </IconButton>
                      <IconButton sx={{ color: darkMode ? '#aaa' : '#666' }}>
                        <InstagramIcon />
                      </IconButton>
                      <IconButton sx={{ color: darkMode ? '#aaa' : '#666' }}>
                        <TwitterIcon />
                      </IconButton>
                      <IconButton sx={{ color: darkMode ? '#aaa' : '#666' }}>
                        <LinkedInIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6} sx={{ ...fadeIn, animationDelay: '4.9s' }}>
            <Box
  component="iframe"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2731.0576093774766!2d17.22589631560648!3d47.18967797915868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476bd7f5f8e5f8a7%3A0xb5c111a298c5d90!2zS8OhcHRhbGFuZmEsIETDs3pzYSBHecO2cmd5IHV0Y2E!5e0!3m2!1shu!2shu!4v1716212345678!5m2!1shu!2shu"
  sx={{
    width: '100%',
    height: '400px',
    border: 0,
    borderRadius: '16px',
    boxShadow: darkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default AboutUs;
