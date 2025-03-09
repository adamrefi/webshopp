import express from 'express';
import mysql from 'mysql2/promise'; 
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// 📌 Adatbázis kapcsolat
const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'webshoppp',
  password: process.env.DB_PASS || 'Premo900',
  database: process.env.DB_NAME || 'webshoppp',
});

console.log('✅ Connected to MySQL Database');

// 🔹 Regisztráció
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Hiányzó adatok!' });
  }

  try {
    const [users] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ error: 'Ez az email már regisztrálva van!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO user (felhasznalonev, email, jelszo) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    console.log(`✅ Felhasználó regisztrálva: ${email}`);
    res.status(201).json({ message: 'Sikeres regisztráció!' });
  } catch (error) {
    console.error('🚨 Hiba regisztráció közben:', error.message);
    res.status(500).json({ error: 'Adatbázis hiba!' });
  }
});

// 🔹 Bejelentkezés
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt received:', { email, password });

  try {
      const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
      console.log('Database query result:', rows);

      if (rows.length === 0) {
          return res.status(400).json({ error: 'Felhasználó nem található!' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.jelszo);

      if (!isMatch) {
          return res.status(400).json({ error: 'Hibás jelszó!' });
      }

      if (isMatch) {
        return res.json({
          success: true,
          message: 'Sikeres bejelentkezés!',
          user: {
            username: user.felhasznalonev,
            email: user.email,
            f_azonosito: user.f_azonosito
          }
        });
      }
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});