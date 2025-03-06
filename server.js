import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'webshoppp',
  password: 'Premo900',
  database: 'webshoppp'
});

db.connect((err) => {
  if (err) {
    console.log('Hiba az adatbázis kapcsolódásnál:', err);
    return;
  }
  console.log('MySQL adatbázis kapcsolódva');
});

// Kategóriák lekérése
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM kategoriak';
  db.query(query, (err, results) => {
    if (err) {
      console.log('Hiba a kategóriák lekérésénél:', err);
      res.status(500).json({ error: 'Adatbázis hiba' });
      return;
    }
    res.json(results);
  });
});

app.get('/products', (req, res) => {
  const query = 'SELECT * FROM usertermekek';
  db.query(query, (err, results) => {
    console.log('Lekért adatok:', results); // Ellenőrzéshez
    res.json(results);
  });
});

app.get('/termekekk', (req, res) => {
  const query = 'SELECT * FROM termekek';
  db.query(query, (err, results) => {
    console.log('Lekért adatok:', results); // Ellenőrzéshez
    res.json(results);
  });
});


// Új termék mentése
app.post('/usertermekek', (req, res) => {
  const { kategoriaId, ar, nev, leiras, meret, imageUrl, images } = req.body;
  
  const query = `
    INSERT INTO usertermekek 
    (kategoriaId, ar, nev, leiras, meret, imageUrl, images) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [kategoriaId, ar, nev, leiras, meret, imageUrl, JSON.stringify(images)], (err, result) => {
    if (err) {
      console.log('SQL error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id: result.insertId });
  });
});
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  
  const query = 'DELETE FROM usertermekek WHERE id = ?';
  
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.log('Hiba a termék törlésénél:', err);
      res.status(500).json({ error: 'Hiba a törlés során' });
      return;
    }
    res.json({ message: 'Termék sikeresen törölve' });
  });
});

app.get('/products/:id', (req, res) => {
  console.log('Requested product ID:', req.params.id);
  const query = 'SELECT * FROM usertermekek WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    console.log('Query results:', results);
    if (err) {
      console.log('Database error:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results[0]);
  });
});


app.post('/vevo/create', (req, res) => {
  const { nev, telefonszam, email, irsz, telepules, kozterulet } = req.body;
  
  const query = `
    INSERT INTO vevo 
    (nev, telefonszam, email, irsz, telepules, kozterulet) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [nev, telefonszam, email, irsz, telepules, kozterulet], (err, result) => {
    if (err) {
      console.log('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      success: true,
      id: result.insertId 
    });
  });
});

app.post('/orders/create', (req, res) => {
  const { termek, statusz, mennyiseg, vevo_id } = req.body;
  
  const query = `
    INSERT INTO rendeles 
    (termek, statusz, mennyiseg, vevo_id) 
    VALUES (?, ?, ?, ?)
  `;
  
  db.query(query, [termek, statusz, mennyiseg, vevo_id], (err, result) => {
    if (err) {
      console.log('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      success: true,
      orderId: result.insertId
    });
  });
});
app.get('/termekek/:id', (req, res) => {
  console.log('Kért termék ID:', req.params.id); // Ellenőrzéshez hozzáadjuk
  const query = 'SELECT * FROM termekek WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.log('Adatbázis hiba:', err);
      return res.status(500).json({ error: 'Adatbázis hiba' });
    }
    console.log('Találat:', results); // Ellenőrzéshez hozzáadjuk
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Termék nem található' });
    }
    return res.json(results[0]);
  });
});

app.post('/termekek/create', (req, res) => {
  const { nev, ar, termekleiras, kategoria, imageUrl, kategoriaId } = req.body;
  
  const query = `
    INSERT INTO termekek 
    (nev, ar, termekleiras, kategoria, imageUrl, kategoriaId) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [nev, ar, termekleiras, kategoria, imageUrl, kategoriaId], (err, result) => {
    if (err) {
      console.log('SQL error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      success: true,
      id: result.insertId,
      message: 'Termék sikeresen létrehozva' 
    });
  });
});



app.get('/termekek', (req, res) => {
  const query = 'SELECT * FROM termekek';
  db.query(query, (err, results) => {
    if (err) {
      console.log('Hiba a termékek lekérésénél:', err);
      res.status(500).json({ error: 'Adatbázis hiba' });
      return;
    }
    console.log('Lekért termékek:', results);
    res.json(results);
  });
});

app.put('/termekek/:id', (req, res) => {
  const { id } = req.params;
  const { ar, termekleiras } = req.body;
  
  const query = 'UPDATE termekek SET ar = ?, termekleiras = ? WHERE id = ?';
  
  db.query(query, [ar, termekleiras, id], (err, result) => {
    if (err) {
      console.log('Hiba a termék frissítésénél:', err);
      res.status(500).json({ error: 'Hiba a frissítés során' });
      return;
    }
    res.json({ message: 'Termék sikeresen frissítve' });
  });
});

app.delete('/termekek/:id', (req, res) => {
  const productId = req.params.id;
  
  const query = 'DELETE FROM termekek WHERE id = ?';
  
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.log('Hiba a termék törlésénél:', err);
      res.status(500).json({ error: 'Hiba a törlés során' });
      return;
    }
    res.json({ message: 'Termék sikeresen törölve' });
  });
});


const port = 5000;
app.listen(port, () => {
  console.log(`Server fut a ${port} porton`);
});




