  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Card,
    FormControl,
    InputLabel,
    Select,
    MenuItem
  } from '@mui/material';

  export default function Tadmin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      nev: '',
      ar: '',
      termekleiras: '',
      kategoria: '',
      imageUrl: '',
      kategoriaId: ''
    });

    const kategoriak = [
      { id: 2, name: 'Nadrágok' },
      { id: 4, name: 'Pólók' },
      { id: 5, name: 'Pulóverek' }
    ];

    const handleChange = (e) => {
      if (e.target.name === 'kategoria') {
        const selectedKategoria = kategoriak.find(k => k.name === e.target.value);
        setFormData({
          ...formData,
          kategoria: e.target.value,
          kategoriaId: selectedKategoria.id
        });
      } else {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await fetch('http://localhost:5000/termekek/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
      
        if (data.success) {
          alert('Termék sikeresen hozzáadva!');
          setFormData({
            nev: '',
            ar: '',
            termekleiras: '',
            kategoria: '',
            imageUrl: '',
            kategoriaId: ''
          });
        }
      } catch (error) {
        console.error('Hiba történt:', error);
      }
    };

    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Új termék hozzáadása
          </Typography>
        
          <Card sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  name="nev"
                  label="Termék neve"
                  value={formData.nev}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  name="ar"
                  label="Ár"
                  type="number"
                  value={formData.ar}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  name="termekleiras"
                  label="Termék leírása"
                  multiline
                  rows={4}
                  value={formData.termekleiras}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Kategória</InputLabel>
                  <Select
                    name="kategoria"
                    value={formData.kategoria}
                    onChange={handleChange}
                    required
                  >
                    {kategoriak.map((kategoria) => (
                      <MenuItem key={kategoria.id} value={kategoria.name}>
                        {kategoria.name} (ID: {kategoria.id})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                <InputLabel>Kategória ID</InputLabel>
                <Select
                    name="kategoriaId"
                    value={formData.kategoriaId}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value={2}>2 - Nadrágok</MenuItem>
                    <MenuItem value={4}>4 - Pólók</MenuItem>
                    <MenuItem value={5}>5 - Pulóverek</MenuItem>
                </Select>
                </FormControl>


                <TextField
                  name="imageUrl"
                  label="Kép URL"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  fullWidth
                  helperText="Például: fehpolo.png"
                />

                <Button 
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Termék hozzáadása
                </Button>
              </Box>
            </form>
          </Card>
        </Box>
      </Container>
    );
  }

// Add this inside the form, after the category Select:

