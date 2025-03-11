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
  MenuItem,
  Grid
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = React.useRef(null);
  const [darkMode, setDarkMode] = useState(true);


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
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const formData = new FormData();
      formData.append('image', file);
      
      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        setSelectedImages(prev => [...prev, file.name]);
      });
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
  
    files.forEach(file => {
      const formData = new FormData();
      formData.append('image', file);
    
      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        setSelectedImages(prev => [...prev, file.name]);
      });
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = {
      ...formData,
      imageUrl: selectedImages[0]
    };

    try {
      const response = await fetch('http://localhost:5000/termekek/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData)
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

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: darkMode ? 'grey.500' : 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
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
                  <Grid container spacing={2}>
                    {selectedImages.map((image, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box
                          sx={{
                            position: 'relative',
                            height: '200px',
                            width: '100%',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={image}
                            alt={`Feltöltött kép ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography>
                      Húzd ide a képeket vagy kattints a feltöltéshez
                    </Typography>
                  </Box>
                )}
              </Box>

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
        </Card>
      </Box>
    </Container>
  );
}
// Add this inside the form, after the category Select: