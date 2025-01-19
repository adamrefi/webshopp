const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); // Az adatbázis kapcsolat

const app = express();
const PORT = 5000;

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

// Regisztrációs endpoint
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Hiányzó adatok!' });
  }

  // Ellenőrizzük, hogy létezik-e már a felhasználó
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Hiba a lekérdezés során:', err.message);
      return res.status(500).json({ error: 'Adatbázis hiba!' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Ez az e-mail már regisztrálva van!' });
    }

    // Felhasználó hozzáadása az adatbázishoz, jelszó titkosítása nélkül
    const sql = 'INSERT INTO user (email, jelszo) VALUES (?, ?)';
    db.query(sql, [email, password], (err, result) => {
      if (err) {
        console.error('Hiba az adatbázis művelet során:', err.message);
        return res.status(500).json({ error: 'Adatbázis hiba!' });
      }
      res.status(201).json({ message: 'Sikeres regisztráció!' });
    });
  });
});

// Bejelentkezési endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Hiányzó adatok!' });
  }

  // Ellenőrizzük, hogy létezik-e a felhasználó az adatbázisban
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Hiba a lekérdezés során:', err.message);
      return res.status(500).json({ error: 'Adatbázis hiba!' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Felhasználó nem található!' });
    }

    // A felhasználó megtalálva, ellenőrizzük a jelszót
    const user = results[0];

    // A beírt jelszó összehasonlítása a tárolt jelszóval
    if (user.jelszo !== password) {
      return res.status(400).json({ error: 'Hibás jelszó!' });
    }

    // Ha a jelszó helyes, visszaküldünk egy sikeres üzenetet
    res.status(200).json({ message: 'Sikeres bejelentkezés!', user: { id: user.sz_azonosito, email: user.email } });
  });
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`Szerver fut a következő porton: ${PORT}`);
});
