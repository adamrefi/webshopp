import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  Grid,
} from '@mui/material';

export default function Termadmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = async (productId) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
      try {
        const response = await fetch(`http://localhost:5000/termekek/${productId}`, {
          method: 'DELETE'
        });
  
        if (response.ok) {
          setProducts(products.filter(p => p.id !== productId));
          alert('Termék sikeresen törölve!');
        }
      } catch (error) {
        console.log('Törlési hiba:', error);
      }
    }
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/termekek');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log('Hiba:', error);
      }
    };
    fetchProducts();
  }, []);
  
  const handleEdit = (product) => {
    setEditingProduct({
      id: product.id,
      nev: product.nev,
      ar: product.ar,
      termekleiras: product.termekleiras
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/termekek/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ar: editingProduct.ar,
          termekleiras: editingProduct.termekleiras
        }),
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === editingProduct.id ? editingProduct : p
        ));
        setEditingProduct(null);
        alert('Termék sikeresen frissítve!');
      }
    } catch (error) {
      console.log('Hiba:', error);
    }
  };
    return (
      <Box sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#333',
        backgroundImage: 'radial-gradient(#444 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        pt: 4,
        pb: 4
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 4 }}>
            Termékek szerkesztése
          </Typography>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} md={6} key={product.id}>
                <Card sx={{ 
                  p: 3, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {editingProduct?.id === product.id ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Ár"
                        type="number"
                        value={editingProduct.ar}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          ar: e.target.value
                        })}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Leírás"
                        multiline
                        rows={4}
                        value={editingProduct.termekleiras}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          termekleiras: e.target.value
                        })}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={handleSave}
                          sx={{ flex: 1 }}
                        >
                          Mentés
                        </Button>
                        <Button 
                          variant="contained"
                          onClick={() => handleDelete(product.id)}
                          color="error"
                          sx={{ flex: 1 }}
                        >
                          Törlés
                        </Button>
                        <Button 
                          variant="outlined"
                          onClick={() => setEditingProduct(null)}
                          sx={{ flex: 1 }}
                        >
                          Mégse
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                        {product.nev}
                      </Typography>
                      <Typography sx={{ mb: 2, color: '#666' }}>
                        Ár: {product.ar} Ft
                      </Typography>
                      <Typography sx={{ mb: 3, flex: 1 }}>
                        Leírás: {product.leiras}
                      </Typography>
                      <Button 
                        variant="contained" 
                        onClick={() => handleEdit(product)}
                        sx={{ 
                          mt: 'auto',
                          bgcolor: '#333',
                          '&:hover': {
                            bgcolor: '#555'
                          }
                        }}
                      >
                        Szerkesztés
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
      
          <Button
            onClick={() => navigate('/user')}
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
      </Box>
    );}