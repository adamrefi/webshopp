const express = require('express');
const cors = require('cors');
const db = require('./database'); // Az adatbázis kapcsolatot külön fájlban kell definiálni

const app = express();
const PORT = 4000;

// Middleware-ek
app.use(cors());
app.use(express.json());

// Termékek lekérése csoport szerint vagy az összes termék
app.get('/products', (req, res) => {
  const groupId = req.query.cs || ''; // Csoport ID az URL query paraméteréből
  const subCategoryId = req.query.sub || ''; // Alkategória ID az URL query paraméteréből

  let query = 'SELECT * FROM termekek';
  const params = [];

  if (groupId) {
    query += ' WHERE csoport = ?'; // Szűrés a csoport oszlop szerint
    params.push(groupId);
  }

  if (subCategoryId) {
    if (groupId) {
      query += ' AND alkategoria = ?'; // Alkategória hozzáadása, ha már van csoport szűrés
    } else {
      query += ' WHERE alkategoria = ?'; // Alkategória szűrés, ha nincs csoport
    }
    params.push(subCategoryId);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Hiba a termékek lekérésekor:', err);
      return res.status(500).json({ error: 'Hiba történt a termékek lekérésekor.' });
    }

    res.json(results); // Visszaküldjük a lekérdezés eredményét
  });
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen`);
});
