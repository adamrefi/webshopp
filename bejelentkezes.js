const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mysql = require('mysql2'); // Az adatbázis kapcsolat

const app = express();
const PORT = 4000;

// Middleware a JSON-adatok kezeléséhez
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // A frontend URL-je
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Fontos, ha session-t használunk
}));

// Adatbázis kapcsolat beállítása
const db = mysql.createConnection({
  host: 'localhost',
  user: 'webshoppp',
  password: 'Premo900',
  database: 'webshoppp',
});

db.connect((err) => {
  if (err) {
    console.error('Hiba az adatbázishoz való kapcsolódás során:', err.message);
    return;
  }
  console.log('Sikeresen csatlakoztál az adatbázishoz!');
});

// Bejelentkezési endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Hiányzó adatok!' });
    }
  
    try {
      // Ellenőrizzük, hogy létezik-e a felhasználó
      db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err) {
          console.error('Hiba a lekérdezés során:', err.message);
          return res.status(500).json({ error: 'Adatbázis hiba!' });
        }
  
        if (results.length === 0) {
          return res.status(400).json({ error: 'Felhasználó nem található!' });
        }
  
        const user = results[0];
  
        // A jelszó összehasonlítása
        const isMatch = await bcrypt.compare(password, user.jelszo);
  
        if (!isMatch) {
          return res.status(400).json({ error: 'Hibás jelszó!' });
        }
  
        res.status(200).json({ message: 'Sikeres bejelentkezés!', user: { id: user.sz_azonosito, email: user.email } });
      });
    } catch (error) {
      console.error('Hiba a bejelentkezés során:', error.message);
      res.status(500).json({ error: 'Hiba a bejelentkezés során!' });
    }
  });
// Szerver indítása
app.listen(PORT, () => {
  console.log(`Szerver fut a következő porton: ${PORT}`);
});
