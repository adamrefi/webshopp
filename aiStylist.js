import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Button, 
  Paper,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Divider,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useNavigate, Link } from 'react-router-dom';
import Footer from './footer';
import Menu from './menu2';
import axios from 'axios';

// Stílusozott komponensek - javítva a darkMode prop hibát
const StyledSection = styled(Box)(({ theme, isDarkMode }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
  backgroundImage: isDarkMode 
    ? 'radial-gradient(#444 1px, transparent 1px)'
    : 'radial-gradient(#e0e0e0 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  transition: 'all 0.3s ease-in-out',
}));

const StyledCard = styled(Card)(({ theme, isDarkMode }) => ({
  backgroundColor: isDarkMode ? 'rgba(51, 51, 51, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: isDarkMode
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transform: 'translateY(0)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: isDarkMode
      ? '0 12px 40px rgba(0, 0, 0, 0.4)'
      : '0 12px 40px rgba(0, 0, 0, 0.15)'
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AIStylist = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Animált megjelenés
  const fadeIn = {
    opacity: 0,
    animation: 'fadeIn 0.8s forwards',
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    }
  };

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("A kép mérete nem lehet nagyobb 5MB-nál!");
        setOpenSnackbar(true);
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null); // Reset previous results
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current.click();
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      setError("Kérjük, tölts fel egy képet az elemzéshez!");
      setOpenSnackbar(true);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Kép konvertálása base64 formátumba
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result.split(',')[1];
          resolve(base64data);
        };
      });
      reader.readAsDataURL(selectedImage);
      const base64Image = await base64Promise;
      
      // API hívás a backend szerveren keresztül
      const response = await axios.post(
        'http://localhost:5000/api/analyze-image',
        { image: base64Image },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Válasz feldolgozása
      let aiResponse;
      try {
        // Próbáljuk meg JSON-ként értelmezni a választ
        const content = response.data.choices[0].message.content;
        aiResponse = JSON.parse(content);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        
        // Próbáljuk meg kinyerni a JSON részt a szöveges válaszból
        const content = response.data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          try {
            aiResponse = JSON.parse(jsonMatch[0]);
          } catch (e) {
            throw new Error("Nem sikerült feldolgozni az AI válaszát");
          }
        } else {
          throw new Error("Az AI válasza nem tartalmaz JSON adatot");
        }
      }
      
      // Ellenőrizzük, hogy a válasz tartalmazza-e a szükséges mezőket
      if (!aiResponse.colorPalette || !aiResponse.bodyType || !aiResponse.seasonType || 
          !aiResponse.recommendations || !aiResponse.personalizedAdvice) {
        throw new Error("Az AI válasza hiányos");
      }
      
      setAnalysisResult(aiResponse);
      
    } catch (err) {
      console.error("AI elemzési hiba:", err);
      setError("Hiba történt az elemzés során. Kérjük, próbáld újra később!");
      setOpenSnackbar(true);
      
      // Fallback: ha hiba történt, használjunk egy alapértelmezett választ
      const fallbackResult = {
        colorPalette: ["#2E4053", "#F1C40F", "#ECF0F1", "#8E44AD"],
        bodyType: "Homokóra",
        seasonType: "Tél",
        recommendations: {
          colors: ["Mély kék", "Lila", "Smaragdzöld", "Piros"],
          styles: ["Testhezálló felsők", "A-vonalú szoknyák", "Magas derekú nadrágok"],
          avoidStyles: ["Bő, formátlan ruhák", "Vízszintes csíkok"],
          accessories: ["Ezüst ékszerek", "Kontrasztos övek"]
        },
        personalizedAdvice: "A képed alapján a téli színtípusba tartozol, ami azt jelenti, hogy a hideg, élénk és kontrasztos színek állnak neked a legjobban. A homokóra testalkatodhoz jól illenek a testhezálló felsők és a magas derekú nadrágok, amelyek kiemelik a derékvonaladat. Kerüld a túl bő, formátlan ruhákat, amelyek elrejtik az alakodat."
      };
      
      setAnalysisResult(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
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
            <>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white',
                  display: { xs: 'none', sm: 'block' },
                  mr: 1
                }}
              >
                Üdv, {userName}!
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
                <ShoppingCartIcon />
              </IconButton>
              <Button
                onClick={handleLogout}
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
                  minWidth: {
                    xs: '50px',
                    sm: '80px',
                    md: '90px'
                  },
                  display: { xs: 'none', sm: 'block' },
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#333',
                  },
                }}
              >
                Kijelentkezés
              </Button>
            </>
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
      <StyledSection isDarkMode={darkMode}>
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
              AI Stílustanácsadó
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
              Tölts fel egy képet magadról, és az AI személyre szabott stílustanácsokat ad neked
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} sx={{ ...fadeIn, animationDelay: '0.3s' }}>
              <StyledCard isDarkMode={darkMode}>
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
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
                    Kép feltöltése
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 300, 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      borderRadius: '16px',
                      mb: 3,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {previewImage ? (
                      <Box 
                        component="img" 
                        src={previewImage} 
                        alt="Feltöltött kép" 
                        sx={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          p: 2
                        }}
                      />
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <CloudUploadIcon sx={{ fontSize: 60, color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}>
                          Húzd ide a képet, vagy kattints a feltöltés gombra
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        backgroundColor: darkMode ? '#8E44AD' : '#9C27B0',
                        '&:hover': {
                          backgroundColor: darkMode ? '#6C3483' : '#7B1FA2',
                        }
                      }}
                    >
                      Kép feltöltése
                      <VisuallyHiddenInput 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      onClick={handleCameraCapture}
                      sx={{
                        borderColor: darkMode ? '#8E44AD' : '#9C27B0',
                        color: darkMode ? '#fff' : '#9C27B0',
                        '&:hover': {
                          borderColor: darkMode ? '#6C3483' : '#7B1FA2',
                          backgroundColor: darkMode ? 'rgba(142, 68, 173, 0.1)' : 'rgba(156, 39, 176, 0.1)',
                        }
                      }}
                    >
                      Kamera használata
                    </Button>
                    <VisuallyHiddenInput 
                      type="file" 
                      accept="image/*"
                      capture="environment"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!selectedImage || isAnalyzing}
                    onClick={handleAnalyzeImage}
                    sx={{
                      mt: 3,
                      backgroundColor: darkMode ? '#2E86C1' : '#2196F3',
                      '&:hover': {
                        backgroundColor: darkMode ? '#1A5276' : '#1565C0',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      }
                    }}
                  >
                    {isAnalyzing ? (
                      <CircularProgress size={24} sx={{ color: darkMode ? '#fff' : '#fff' }} />
                    ) : (
                      'Elemzés indítása'
                    )}
                  </Button>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6} sx={{ ...fadeIn, animationDelay: '0.5s' }}>
              <StyledCard isDarkMode={darkMode}>
                <CardContent sx={{ p: 4 }}>
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
                    Stílus elemzés
                  </Typography>
                  
                  {!analysisResult && !isAnalyzing ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '400px',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body1" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', mb: 2 }}>
                        Tölts fel egy képet, és indítsd el az elemzést a személyre szabott stílustanácsokért.
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>
                        Az AI elemzi a megjelenésedet, és javaslatokat tesz a hozzád legjobban illő ruhákra, színekre és stílusokra.
                      </Typography>
                    </Box>
                  ) : isAnalyzing ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '400px'
                    }}>
                      <CircularProgress size={60} sx={{ color: darkMode ? '#8E44AD' : '#9C27B0', mb: 3 }} />
                      <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#333', mb: 1 }}>
                        Elemzés folyamatban...
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
                        Az AI elemzi a képedet és személyre szabott stílustanácsokat készít. Ez néhány másodpercet vesz igénybe.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ height: '400px', overflow: 'auto' }}>
                      <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#333', mb: 2 }}>
                        Személyes stíluselemzés
                      </Typography>
                      
                      <Typography variant="body1" sx={{ color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)', mb: 3 }}>
                        {analysisResult.personalizedAdvice}
                      </Typography>
                      
                      <Divider sx={{ my: 2, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                      
                      <Typography variant="subtitle1" sx={{ color: darkMode ? '#fff' : '#333', fontWeight: 600, mb: 1 }}>
                        Színtípus: <Box component="span" sx={{ fontWeight: 400 }}>{analysisResult.seasonType}</Box>
                      </Typography>
                      
                      <Typography variant="subtitle1" sx={{ color: darkMode ? '#fff' : '#333', fontWeight: 600, mb: 1 }}>
                        Testalkat: <Box component="span" sx={{ fontWeight: 400 }}>{analysisResult.bodyType}</Box>
                      </Typography>
                      
                      <Typography variant="subtitle1" sx={{ color: darkMode ? '#fff' : '#333', fontWeight: 600, mb: 2 }}>
                        Ajánlott színpaletta:
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                        {analysisResult.colorPalette.map((color, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              backgroundColor: color,
                              borderRadius: '50%',
                              border: '2px solid',
                              borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                            }} 
                          />
                        ))}
                      </Box>
                      
                      <Divider sx={{ my: 2, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                      
                      <Typography variant="subtitle1" sx={{ color: darkMode ? '#fff' : '#333', fontWeight: 600, mb: 1 }}>
                        Ajánlott stílusok:
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        {analysisResult.recommendations.styles.map((style, index) => (
                          <Typography key={index} variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', mb: 0.5 }}>
                            • {style}
                          </Typography>
                        ))}
                      </Box>
                      
                      <Typography variant="subtitle1" sx={{ color: darkMode ? '#fff' : '#333', fontWeight: 600, mb: 1 }}>
                        Kerülendő stílusok:
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        {analysisResult.recommendations.avoidStyles.map((style, index) => (
                                                   <Typography key={index} variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', mb: 0.5 }}>
                                                   • {style}
                                                 </Typography>
                                               ))}
                                             </Box>
                                             
                                             <Button
                                               variant="contained"
                                               sx={{
                                                 mt: 2,
                                                 backgroundColor: darkMode ? '#27AE60' : '#4CAF50',
                                                 '&:hover': {
                                                   backgroundColor: darkMode ? '#1E8449' : '#388E3C',
                                                 }
                                               }}
                                               component={Link}
                                               to="/oterm"
                                             >
                                               Böngéssz a neked ajánlott termékek között
                                             </Button>
                                           </Box>
                                         )}
                                       </CardContent>
                                     </StyledCard>
                                   </Grid>
                                 </Grid>
                               </Container>
                             </StyledSection>
                       
                             {/* How it Works Section */}
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
                                   Hogyan működik?
                                 </Typography>
                               </Box>
                       
                               <Grid container spacing={4}>
                                 <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '0.9s' }}>
                                   <StyledCard isDarkMode={darkMode}>
                                     <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                         <Box 
                                           sx={{ 
                                             width: 80, 
                                             height: 80, 
                                             borderRadius: '50%', 
                                             backgroundColor: darkMode ? 'rgba(142, 68, 173, 0.2)' : 'rgba(156, 39, 176, 0.1)',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center'
                                           }}
                                         >
                                           <CloudUploadIcon sx={{ fontSize: 40, color: darkMode ? '#8E44AD' : '#9C27B0' }} />
                                         </Box>
                                       </Box>
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
                                           textAlign: 'center'
                                         }}
                                       >
                                         1. Tölts fel egy képet
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
                                           flex: 1,
                                           textAlign: 'center'
                                         }}
                                       >
                                         Tölts fel egy jó minőségű, teljes alakos képet magadról természetes fényben. Minél jobb a kép minősége, annál pontosabb lesz az elemzés.
                                       </Typography>
                                     </CardContent>
                                   </StyledCard>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '1.1s' }}>
                                   <StyledCard isDarkMode={darkMode}>
                                     <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                         <Box 
                                           sx={{ 
                                             width: 80, 
                                             height: 80, 
                                             borderRadius: '50%', 
                                             backgroundColor: darkMode ? 'rgba(46, 134, 193, 0.2)' : 'rgba(33, 150, 243, 0.1)',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center'
                                           }}
                                         >
                                           <Box component="span" sx={{ fontSize: 40, color: darkMode ? '#2E86C1' : '#2196F3' }}>AI</Box>
                                         </Box>
                                       </Box>
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
                                           textAlign: 'center'
                                         }}
                                       >
                                         2. AI elemzés
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
                                           flex: 1,
                                           textAlign: 'center'
                                         }}
                                       >
                                         A fejlett mesterséges intelligencia elemzi a bőrtónusodat, testalkatodat és egyéb jellemzőidet, hogy meghatározza, milyen színek és stílusok illenek hozzád a legjobban.
                                       </Typography>
                                     </CardContent>
                                   </StyledCard>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={4} sx={{ ...fadeIn, animationDelay: '1.3s' }}>
                                   <StyledCard isDarkMode={darkMode}>
                                     <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                         <Box 
                                           sx={{ 
                                             width: 80, 
                                             height: 80, 
                                             borderRadius: '50%', 
                                             backgroundColor: darkMode ? 'rgba(39, 174, 96, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center'
                                           }}
                                         >
                                           <ShoppingCartIcon sx={{ fontSize: 40, color: darkMode ? '#27AE60' : '#4CAF50' }} />
                                         </Box>
                                       </Box>
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
                                           textAlign: 'center'
                                         }}
                                       >
                                         3. Személyre szabott ajánlások
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
                                           flex: 1,
                                           textAlign: 'center'
                                         }}
                                       >
                                         Megkapod a személyre szabott stílustanácsokat és ajánlásokat, amelyek segítenek kiválasztani a hozzád legjobban illő ruhákat és kiegészítőket az Adali Clothing kínálatából.
                                       </Typography>
                                     </CardContent>
                                   </StyledCard>
                                 </Grid>
                               </Grid>
                             </Container>
                           </Box>
                       
                           {/* FAQ Section */}
                           <StyledSection isDarkMode={darkMode}>
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
                                   Gyakori kérdések
                                 </Typography>
                               </Box>
                       
                               <Grid container spacing={3}>
                                 <Grid item xs={12} md={6} sx={{ ...fadeIn, animationDelay: '1.7s' }}>
                                   <Paper
                                     elevation={0}
                                     sx={{
                                       p: 3,
                                       borderRadius: '16px',
                                       backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                       mb: 3
                                     }}
                                   >
                                     <Typography 
                                       variant="h6" 
                                       sx={{ 
                                         fontWeight: 600,
                                         color: darkMode ? '#fff' : '#333',
                                         mb: 1
                                       }}
                                     >
                                       Biztonságos a képem feltöltése?
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
                                       Igen, a feltöltött képeket bizalmasan kezeljük, és csak a stíluselemzéshez használjuk fel. A képeket nem tároljuk hosszú távon, és nem osztjuk meg harmadik féllel.
                                     </Typography>
                                   </Paper>
                                   
                                   <Paper
                                     elevation={0}
                                     sx={{
                                       p: 3,
                                       borderRadius: '16px',
                                       backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                       mb: 3
                                     }}
                                   >
                                     <Typography 
                                       variant="h6" 
                                       sx={{ 
                                         fontWeight: 600,
                                         color: darkMode ? '#fff' : '#333',
                                         mb: 1
                                       }}
                                     >
                                       Mennyire pontosak az ajánlások?
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
                                       Az AI stílustanácsadónk a legmodernebb technológiát használja, és folyamatosan fejlesztjük. Az ajánlások pontossága függ a feltöltött kép minőségétől és a látható részletektől.
                                     </Typography>
                                   </Paper>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6} sx={{ ...fadeIn, animationDelay: '1.9s' }}>
                                   <Paper
                                     elevation={0}
                                     sx={{
                                       p: 3,
                                       borderRadius: '16px',
                                       backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                       mb: 3
                                     }}
                                   >
                                     <Typography 
                                       variant="h6" 
                                       sx={{ 
                                         fontWeight: 600,
                                         color: darkMode ? '#fff' : '#333',
                                         mb: 1
                                       }}
                                     >
                                       Milyen képet töltsek fel a legjobb eredményért?
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
                                       A legjobb eredmény érdekében tölts fel egy teljes alakos képet természetes fényben, semleges háttér előtt. Viselj egyszerű, egyszínű ruhát, és állj egyenesen, hogy az AI pontosan láthassa a testalkatodat.
                                     </Typography>
                                   </Paper>
                                   
                                   <Paper
                                     elevation={0}
                                     sx={{
                                       p: 3,
                                       borderRadius: '16px',
                                       backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                       mb: 3
                                     }}
                                   >
                                     <Typography 
                                       variant="h6" 
                                       sx={{ 
                                         fontWeight: 600,
                                         color: darkMode ? '#fff' : '#333',
                                         mb: 1
                                       }}
                                     >
                                       Mennyibe kerül a szolgáltatás használata?
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
                                       Az AI stílustanácsadó szolgáltatás teljesen ingyenes az Adali Clothing vásárlói számára. Használd bátran, hogy megtaláld a hozzád legjobban illő ruhákat!
                                     </Typography>
                                   </Paper>
                                 </Grid>
                               </Grid>
                             </Container>
                           </StyledSection>
                       
                           {/* Snackbar for errors */}
                           <Snackbar
                             open={openSnackbar}
                             autoHideDuration={6000}
                             onClose={handleCloseSnackbar}
                             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                           >
                             <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                               {error}
                             </Alert>
                           </Snackbar>
                       
                           {/* Footer */}
                           <Footer />
                         </Box>
                       );
                       };
                       
                       export default AIStylist;
                       
