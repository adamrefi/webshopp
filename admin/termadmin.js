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
  

// Add inside the component:
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
  };  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Termékek szerkesztése
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} md={6} key={product.id}>
            <Card sx={{ p: 3 }}>
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
                  />
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleSave}
                    >
                      Mentés
                    </Button>
                    <Button 
    variant="contained"
    onClick={() => handleDelete(product.id)}
    color="error"
  >
    Törlés
  </Button>
                    <Button 
                      variant="outlined"
                      onClick={() => setEditingProduct(null)}
                    >
                      Mégse
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6">{product.nev}</Typography>
                  <Typography>Ár: {product.ar} Ft</Typography>
                  <Typography>Leírás: {product.leiras}</Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => handleEdit(product)}
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
    mb: 3,
    backgroundColor: '#333',
    '&:hover': {
      backgroundColor: '#555'
    }
  }}
>
  Vissza az admin felületre
</Button>
    </Container>
  );
}
