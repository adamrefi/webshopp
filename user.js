import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '../menu2';

export default function User() {
  const [products, setProducts] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nev: '',
    ar: '',
    leiras: '',
    meret: '',
    imageUrl: '',
    images: []
  });

  const toggleSideMenu = () => {
    setSideMenuActive(!sideMenuActive);
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

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setEditFormData({
      nev: product.nev || '',
      ar: product.ar || '',
      leiras: product.leiras || '',
      meret: product.meret || '',
      imageUrl: product.imageUrl || '',
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : []
    });
    setEditDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/${currentProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        // Frissítjük a termékek listáját
        const updatedProducts = products.map(product => 
          product.id === currentProduct.id ? { ...product, ...editFormData } : product
        );
        setProducts(updatedProducts);
        setEditDialogOpen(false);
      } else {
        console.log('Hiba a frissítés során');
      }
    } catch (error) {
      console.log('Szerkesztési hiba:', error);
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
                    alt={product.nev}
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
                      onClick={() => handleEdit(product)}
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
                    {product.nev}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.ar} Ft
                  </Typography>
                  <Typography variant="body2">
                    {product.leiras}
                  </Typography>
                  <Typography variant="body2">
                    Méret: {product.meret}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button
          onClick={() => navigate('/admin')}
          variant="contained"
          sx={{ 
            mt: 4,
            mb: 3,
            bgcolor: '#333',
            '&:hover': {
              bgcolor: '#555'
            }
          }}
        >
          Vissza az admin felületre
        </Button>
      </Container>

      {/* Szerkesztő dialógus */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Termék szerkesztése</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Termék neve"
              name="nev"
              value={editFormData.nev}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Ár (Ft)"
              name="ar"
              type="number"
              value={editFormData.ar}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Leírás"
              name="leiras"
              value={editFormData.leiras}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Méret"
              name="meret"
              value={editFormData.meret}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Kép URL"
              name="imageUrl"
              value={editFormData.imageUrl}
              onChange={handleInputChange}
              fullWidth
            />
            {editFormData.imageUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">Előnézet:</Typography>
                <img 
                  src={editFormData.imageUrl} 
                  alt="Előnézet" 
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Mégse</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">Mentés</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
