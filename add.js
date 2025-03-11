import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton,
  TextField,
  Paper,
  Container,
  FormGroup,
  FormControlLabel,
  Switch,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Badge,
  Grid,
  Card,
  CardContent,
  FormHelperText
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from './menu2';
import Footer from './footer';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function Add() {
 
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartItemCount = cartItems.reduce((total, item) => total + item.mennyiseg, 0);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [showUploadInfo, setShowUploadInfo] = useState(true);
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
  
    const termekAdatok = {
      kategoriaId: parseInt(selectedCategory),
      ar: parseInt(price),
      nev: title,
      leiras: description,
      meret: size,
      imageUrl: selectedImages[0],
      images: selectedImages
    };
  
    try {
      const response = await fetch('http://localhost:5000/usertermekek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(termekAdatok)
      });
  
      if (response.ok) {
        setTitle('');
        setPrice('');
        setDescription('');
        setSize('');
        setSelectedCategory('');
        setSelectedImages([]);
        alert('Sikeres feltöltés!');
        navigate('/vinted');
      } else {
        alert('Hiba történt a feltöltés során!');
      }
    } catch (error) {
      console.error('Hiba:', error);
      alert('Hiba történt a feltöltés során!');
    }
  };
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const fileInputRef = React.useRef(null);
  const anchorRef = React.useRef(null);

  const [errors, setErrors] = useState({
    title: false,
    price: false,
    description: false,
    size: false,
    selectedCategory: false,
    selectedImages: false
  });
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = true;
      isValid = false;
    }
    // Check price
  if (!price || price <= 0) {
    newErrors.price = true;
    isValid = false;
  }

  // Check description
  if (!description.trim()) {
    newErrors.description = true;
    isValid = false;
  }

  // Check size
  if (!size) {
    newErrors.size = true;
    isValid = false;
  }

  // Check category
  if (!selectedCategory) {
    newErrors.selectedCategory = true;
    isValid = false;
  }
   if (selectedImages.length < 2) {
    newErrors.selectedImages = true;
    isValid = false;
  }

  // Check images
  if (selectedImages.length === 0) {
    newErrors.selectedImages = true;
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
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

  useEffect(() => {
    setShowUploadInfo(true);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.log('Error:', error));
  }, []);

  // Adjuk hozzá ezt a useEffect-et
useEffect(() => {
  if (sideMenuActive) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}, [sideMenuActive]);

const [selectedImages, setSelectedImages] = useState([]);

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
        
        setSelectedImages(prev => [...prev, compressedImage]);
      };
    };
    reader.readAsDataURL(file);
  });
};const handleDragOver = (event) => {
  event.preventDefault();
};

const handleDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
};

const handleCartClick = () => {
    navigate('/kosar');
};

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    borderRadius: 2,
    color: darkMode ? '#fff' : '#000'
  },
  '& .MuiInputLabel-root': {
    color: darkMode ? '#fff' : '#000'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.3)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.5)'
  }
};

<input
    type="file"
    hidden
    multiple
    ref={fileInputRef}
    onChange={handleImageUpload}
    accept="image/*"
/>
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
    setShowLogoutAlert(true);
    setOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowLogoutAlert(false);
    navigate('/sign');
  };

  const toggleSideMenu = () => {
    setSideMenuActive((prev) => !prev);
  };
  

  return (
<div style={{
  backgroundColor: darkMode ? '#555' : '#f5f5f5',
  color: darkMode ? 'white' : 'black',
  minHeight: '100vh',
  paddingBottom: '100px'  // Új sor
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



   <Container maxWidth="lg" sx={{ mt: 10, mb: 2 }}>
  <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
    <Card elevation={8} sx={{
      flex: 2,
      backgroundColor: darkMode ? '#333' : '#fff',
      borderRadius: 3,
      padding: 4,
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: darkMode ? '#fff' : '#333',
        borderBottom: '2px solid',
        borderColor: darkMode ? '#555' : '#ddd',
        paddingBottom: 2,
        marginBottom: 4
      }}>
        Ruha feltöltése
      </Typography>

      <Box
  sx={{
    border: '2px dashed',
    borderColor: errors.selectedImages ? '#ff6b6b' : (darkMode ? 'grey.500' : 'grey.300'),
    borderRadius: 2,
    p: 3,
    mb: 3,
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
  }}
  onClick={() => fileInputRef.current.click()}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
>
  <input
    type="file"
    hidden
    multiple
    ref={fileInputRef}
    onChange={handleImageUpload}
    accept="image/*"
  />
  
  {selectedImages && selectedImages.length > 0 ? (
    <Grid container spacing={3}>
      {selectedImages.map((image, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box sx={{
            position: 'relative',
            height: '300px',
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <img
              src={image}
              alt={`Feltöltött kép ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Box>
      <CloudUploadIcon sx={{ fontSize: 60, mb: 2, color: darkMode ? 'grey.400' : 'grey.600' }} />
      <Typography sx={{ 
        color: errors.selectedImages ? '#ff6b6b' : (darkMode ? 'grey.400' : 'grey.600'),
        fontWeight: errors.selectedImages ? 'bold' : 'normal'
      }}>
        Legalább 2 kép feltöltése kötelező!
      </Typography>
    </Box>
  )}
</Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
       
        <TextField
  fullWidth
  label="Ruha neve"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  error={errors.title}
  helperText={errors.title ? "Kötelező mező!" : ""}
  sx={textFieldStyle}
/>

<TextField
  fullWidth
  label="Ár"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  error={errors.price}
  helperText={errors.price ? "Érvényes árat adjon meg!" : ""}
  type="number"
  sx={textFieldStyle}
/>

<TextField
  fullWidth
  label="Leírás"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  error={errors.description}
  helperText={errors.description ? "Kötelező mező!" : ""}
  sx={textFieldStyle}
/>

<FormControl fullWidth error={errors.size}>
  <InputLabel>Méret</InputLabel>
  <Select
    value={size}
    onChange={(e) => setSize(e.target.value)}
  >
    <MenuItem value="XS">XS</MenuItem>
    <MenuItem value="S">S</MenuItem>
    <MenuItem value="M">M</MenuItem>
    <MenuItem value="L">L</MenuItem>
    <MenuItem value="XL">XL</MenuItem>
    <MenuItem value="XXL">XXL</MenuItem>
  </Select>
  {errors.size && <FormHelperText>Válasszon méretet!</FormHelperText>}
</FormControl>

<FormControl fullWidth error={errors.selectedCategory}>
  <InputLabel>Kategória</InputLabel>
  <Select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    {categories.map((category) => (
      <MenuItem key={category.cs_azonosito} value={category.cs_azonosito}>
        {category.cs_nev}
      </MenuItem>
    ))}
  </Select>
  {errors.selectedCategory && <FormHelperText>Válasszon kategóriát!</FormHelperText>}
</FormControl>

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            py: 2,
            mt: 2,
            backgroundColor: darkMode ? '#90caf9' : '#1976d2',
            '&:hover': {
              backgroundColor: darkMode ? '#42a5f5' : '#1565c0',
              transform: 'translateY(-2px)',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          Feltöltés
        </Button>
      </Box>
    </Card>
  </Box>
</Container>
      {showLogoutAlert && (
  <Box
    sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1400,
      animation: 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      '@keyframes popIn': {
        '0%': {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.5)',
        },
        '50%': {
          transform: 'translate(-50%, -50%) scale(1.05)',
        },
        '100%': {
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)',
        },
      },
    }}
  >
    <Card
      sx={{
        minWidth: 350,
        backgroundColor: darkMode ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        color: darkMode ? '#fff' : '#000',
        boxShadow: darkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #00C853, #B2FF59)',
          animation: 'loadingBar 2s ease-in-out',
          '@keyframes loadingBar': {
            '0%': { width: '0%' },
            '100%': { width: '100%' }
          }
        }}
      />
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              mb: 1,
              background: darkMode 
              ? 'linear-gradient(45deg, #90caf9, #42a5f5)' 
              : 'linear-gradient(45deg, #1976d2, #1565c0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Kijelentkezés
          </Typography>
          <Typography variant="body1" sx={{ color: darkMode ? '#aaa' : '#666' }}>
            Biztosan ki szeretnél jelentkezni?
          </Typography>
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: 'space-between'
          }}
        >
          <Button
            onClick={() => setShowLogoutAlert(false)}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '12px',
              backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)',
              color: darkMode ? '#90caf9' : '#1976d2',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.2)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Mégse
          </Button>
          <Button
            onClick={confirmLogout}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '12px',
              background: darkMode 
              ? 'linear-gradient(45deg, #90caf9, #42a5f5)' 
              : 'linear-gradient(45deg, #1976d2, #1565c0)',
              color: '#fff',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              }
            }}
          >
            Kijelentkezés
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Box>
)}

{showUploadInfo && (
  <Box
    sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1400,
      width: '95%',
      maxWidth: 600,
    }}
  >
    <Card sx={{
      backgroundColor: darkMode ? 'rgba(45, 45, 45, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      color: darkMode ? '#fff' : '#000',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden'
    }}>
      <Box sx={{
        height: '4px',
        background: 'linear-gradient(90deg, #2196F3, #64B5F6)',
      }} />
      
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ 
          mb: 3, 
          fontWeight: 'bold',
          textAlign: 'center',
          color: darkMode ? '#90CAF9' : '#1976D2'
        }}>
          Feltöltési követelmények
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#81D4FA' : '#0D47A1' }}>
            Képfeltöltés:
          </Typography>
          <Box sx={{ pl: 2, mb: 2 }}>
            <Typography sx={{ mb: 1 }}>• Ajánlott képméret: 1200x1200 pixel</Typography>
            <Typography sx={{ mb: 1 }}>• Maximum fájlméret: 8MB</Typography>
            <Typography>• Elfogadott formátumok: JPG, PNG</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#81D4FA' : '#0D47A1' }}>
            Termékadatok:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography sx={{ mb: 1 }}>• Pontos terméknév megadása</Typography>
            <Typography sx={{ mb: 1 }}>• Valós ár feltüntetése</Typography>
            <Typography sx={{ mb: 1 }}>• Részletes termékleírás</Typography>
            <Typography>• Megfelelő méret kiválasztása</Typography>
          </Box>
        </Box>

        <Button 
          fullWidth
          variant="contained"
          onClick={() => setShowUploadInfo(false)}
          sx={{
            mt: 3,
            py: 2,
            backgroundColor: darkMode ? '#90CAF9' : '#1976D2',
            fontSize: '1.1rem',
            '&:hover': {
              backgroundColor: darkMode ? '#64B5F6' : '#1565C0',
              transform: 'translateY(-2px)',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          Értettem
        </Button>
      </Box>
    </Card>
  </Box>
)}

      <Footer />
    </div>
  );
}

export default Add;