
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider
} from '@mui/material';

export default function Shipping() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice } = location.state;
  const [darkMode, setDarkMode] = useState(true);
  
  const [orderData, setOrderData] = useState({
    nev: '',
    telefonszam: '',
    email: '',
    irsz: '',
    telepules: '',
    kozterulet: ''
  });
    const handleSubmitOrder = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData.f_azonosito;
      
      try {
        const vevoResponse = await fetch('http://localhost:5000/vevo/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        const vevoResult = await vevoResponse.json();

        for (const item of cartItems) {
          const orderPayload = {
            termek: item.nev,
            statusz: 'Új rendelés',
            mennyiseg: item.mennyiseg,
            vevo_id: vevoResult.id,  // Use the newly created vevo ID
            rendeles_id: vevoResult.id  // Use the same vevo ID
          };

          await fetch('http://localhost:5000/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });
        }

        localStorage.removeItem('cartItems');
        alert('Rendelés sikeresen leadva!');
        navigate('/vinted');
      } catch (error) {
        console.error('Order error:', error);
        alert('Hiba történt a rendelés során!');
      }
    };
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: darkMode ? 'white' : 'black' }}>
        Szállítási adatok
      </Typography>
      
      <Card sx={{ 
        backgroundColor: darkMode ? '#333' : 'white',
        color: darkMode ? 'white' : 'black',
        mt: 4 
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Név"
              value={orderData.nev}
              onChange={(e) => setOrderData({...orderData, nev: e.target.value})}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#444' : '#fff',
                  color: darkMode ? '#fff' : '#000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : '#000'
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Telefonszám"
              value={orderData.telefonszam}
              onChange={(e) => setOrderData({...orderData, telefonszam: e.target.value})}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#444' : '#fff',
                  color: darkMode ? '#fff' : '#000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : '#000'
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Email"
              value={orderData.email}
              onChange={(e) => setOrderData({...orderData, email: e.target.value})}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#444' : '#fff',
                  color: darkMode ? '#fff' : '#000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : '#000'
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Irányítószám"
              value={orderData.irsz}
              onChange={(e) => setOrderData({...orderData, irsz: e.target.value})}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#444' : '#fff',
                  color: darkMode ? '#fff' : '#000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : '#000'
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Település"
              value={orderData.telepules}
              onChange={(e) => setOrderData({...orderData, telepules: e.target.value})}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#444' : '#fff',
                  color: darkMode ? '#fff' : '#000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : '#000'
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Közterület"
              value={orderData.kozterulet}
              onChange={(e) => setOrderData({...orderData, kozterulet: e.target.value})}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#444' : '#fff',
                  color: darkMode ? '#fff' : '#000'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : '#000'
                }
              }}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rendelés összegzése
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Részösszeg:</Typography>
              <Typography>{totalPrice.toLocaleString()} Ft</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Szállítási költség:</Typography>
              <Typography>1590 Ft</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6">Végösszeg:</Typography>
              <Typography variant="h6">
                {(totalPrice + 1590).toLocaleString()} Ft
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmitOrder}
            sx={{
              mt: 3,
              backgroundColor: darkMode ? '#666' : 'primary.main',
              '&:hover': {
                backgroundColor: darkMode ? '#777' : 'primary.dark'
              }
            }}
          >
            Rendelés véglegesítése
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
