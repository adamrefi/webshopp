// Új értékelés létrehozása (csak hitelesített felhasználók számára)
router.post('/',
  authMiddleware.verifyToken,
  ratingController.createRating.bind(ratingController)
);

// Értékelés frissítése (csak a saját értékelés)
router.put('/:id',
  authMiddleware.verifyToken,
  ratingController.updateRating.bind(ratingController)
);

// Értékelés törlése (csak a saját értékelés vagy admin)
router.delete('/:id',
  authMiddleware.verifyToken,
  ratingController.deleteRating.bind(ratingController)
);

module.exports = router;
```

## Felhasználói útvonalak

```javascript
// user.routes.js
const express = require('express');
const router = express.Router();
const userController = new UserController(userModel);
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Felhasználói profil lekérdezése (csak hitelesített felhasználók számára)
router.get('/profile',
  authMiddleware.verifyToken,
  userController.getUserProfile.bind(userController)
);

// Felhasználói profil frissítése (csak hitelesített felhasználók számára)
router.put('/profile',
  authMiddleware.verifyToken,
  userController.updateUserProfile.bind(userController)
);

// Profilkép feltöltése (csak hitelesített felhasználók számára)
router.post('/profile/image',
  authMiddleware.verifyToken,
  uploadMiddleware.single('profileImage'),
  userController.uploadProfileImage.bind(userController)
);

// Felhasználói kuponok lekérdezése (csak hitelesített felhasználók számára)
router.get('/coupons',
  authMiddleware.verifyToken,
  userController.getUserCoupons.bind(userController)
);

// Összes felhasználó lekérdezése (csak adminisztrátorok számára)
router.get('/',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.getAllUsers.bind(userController)
);

// Felhasználó törlése (csak adminisztrátorok számára)
router.delete('/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.deleteUser.bind(userController)
);

module.exports = router;
```

## Kupon útvonalak

```javascript
// coupon.routes.js
const express = require('express');
const router = express.Router();
const couponController = new CouponController(couponModel, userModel);
const authMiddleware = require('../middleware/authMiddleware');

// Kupon érvényesítése
router.post('/validate',
  couponController.validateCoupon.bind(couponController)
);

// Kupon használata
router.post('/use',
  authMiddleware.verifyToken,
  couponController.useCoupon.bind(couponController)
);

// Kuponok küldése felhasználóknak (csak adminisztrátorok számára)
router.post('/send',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  couponController.sendCouponsToUsers.bind(couponController)
);

// Aktív felhasználók lekérdezése kuponküldéshez (csak adminisztrátorok számára)
router.get('/active-users',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  couponController.getActiveUsers.bind(couponController)
);

module.exports = router;
```

## Útvonalak regisztrálása

Az összes útvonal regisztrálása az alkalmazás fő fájljában történik:

```javascript
// app.js
const express = require('express');
const app = express();

// Middleware-ek
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Útvonalak regisztrálása
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/ratings', require('./routes/rating.routes'));
app.use('/api/coupons', require('./routes/coupon.routes'));

// Statikus fájlok kiszolgálása
app.use('/uploads', express.static('uploads'));

// Hibakezelés
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Szerver hiba történt' });
});

// Nem létező útvonalak kezelése
app.use((req, res) => {
  res.status(404).json({ error: 'Az útvonal nem található' });
});

module.exports = app;
```
```

```markdown:my-website/docs/developer/backend/middleware.md
---
sidebar_position: 5
---

# Backend middleware-ek

A middleware-ek olyan függvények, amelyek hozzáférnek a kérés és válasz objektumokhoz, valamint a következő middleware függvényhez az alkalmazás kérés-válasz ciklusában. Az Adali Clothing webáruház a következő middleware-eket használja.

## Hitelesítési middleware

A hitelesítési middleware felelős a JWT tokenek ellenőrzéséért és a felhasználói jogosultságok kezeléséért.

### Fájl: authMiddleware.js

```javascript
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Token ellenőrzése
exports.verifyToken = (req, res, next) => {
  try {
    // Token kinyerése a kérés fejlécéből
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Hitelesítési token hiányzik' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Token dekódolása
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Felhasználói adatok hozzáadása a kéréshez
    req.userData = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'A token lejárt' });
    }
    return res.status(401).json({ error: 'Érvénytelen token' });
  }
};

// Admin jogosultság ellenőrzése
exports.isAdmin = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    
    // Felhasználó lekérdezése
    const user = await userModel.findById(userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Nincs jogosultságod ehhez a művelethez' });
    }
    
    next();
  } catch (error) {
    console.error('Admin jogosultság ellenőrzési hiba:', error);
    return res.status(500).json({ error: 'Szerver hiba történt' });
  }
};

// Saját erőforrás ellenőrzése
exports.isResourceOwner = (resourceField) => {
  return async (req, res, next) => {
    try {
      const userId = req.userData.userId;
      const resourceId = req.params.id;
      
      // Erőforrás tulajdonosának ellenőrzése
      const resource = await db.execute(`SELECT * FROM ${resourceField.table} WHERE id = ?`, [resourceId]);
      
      if (!resource || resource[0][resourceField.field] !== userId) {
        return res.status(403).json({ error: 'Nincs jogosultságod ehhez az erőforráshoz' });
      }
      
      next();
    } catch (error) {
      console.error('Erőforrás tulajdonos ellenőrzési hiba:', error);
      return res.status(500).json({ error: 'Szerver hiba történt' });
    }
  };
};
```

## Fájlfeltöltési middleware

A fájlfeltöltési middleware felelős a feltöltött fájlok kezeléséért.

### Fájl: uploadMiddleware.js

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tárhely konfigurálása
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    
    // Könyvtár létrehozása, ha nem létezik
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Egyedi fájlnév generálása
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Fájltípus szűrő
const fileFilter = (req, file, cb) => {
  // Csak képfájlok engedélyezése
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Csak képfájlok tölthetők fel!'), false);
  }
};

// Multer konfiguráció
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
```

## Hibakezelő middleware

A hibakezelő middleware felelős a hibák egységes kezeléséért.

### Fájl: errorMiddleware.js

```javascript
// Általános hibakezelő
exports.handleError = (err, req, res, next) => {
  console.error('Hiba:', err);
  
  // Multer hibák kezelése
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'A fájl mérete túl nagy (maximum 5 MB)' });
    }
    return res.status(400).json({ error: `Fájlfeltöltési hiba: ${err.message}` });
  }
  
  // Validációs hibák kezelése
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  // JWT hibák kezelése
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Érvénytelen vagy lejárt token' });
  }
  
  // Adatbázis hibák kezelése
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(500).json({ error: 'Adatbázis hiba történt' });
  }
  
  // Alapértelmezett hibaüzenet
  res.status(500).json({ error: 'Szerver hiba történt' });
};

// 404-es hiba kezelése
exports.notFound = (req, res, next) => {
  res.status(404).json({ error: 'Az útvonal nem található' });
};
```

## CORS middleware

A CORS (Cross-Origin Resource Sharing) middleware lehetővé teszi a különböző eredetű kérések kezelését.

### Fájl: corsMiddleware.js

```javascript
const cors = require('cors');

// CORS beállítások
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 óra
};

module.exports = cors(corsOptions);
```

## Naplózó middleware

A naplózó middleware felelős a kérések naplózásáért.

### Fájl: loggerMiddleware.js

```javascript
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Naplófájl létrehozása
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../logs/access.log'),
  { flags: 'a' }
);

// Fejlesztői környezetben konzolra naplózás
const devLogger = morgan('dev');

// Produkciós környezetben fájlba naplózás
const prodLogger = morgan('combined', { stream: accessLogStream });

// Környezet alapján megfelelő naplózó kiválasztása
module.exports = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
```

## Middleware-ek regisztrálása

A middleware-ek regisztrálása az alkalmazás fő fájljában történik:

```javascript
// app.js
const express = require('express');
const app = express();

// Middleware-ek importálása
const corsMiddleware = require('./middleware/corsMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const { handleError, notFound } = require('./middleware/errorMiddleware');

// Middleware-ek regisztrálása
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Útvonalak regisztrálása
// ...

// Hibakezelő middleware-ek (utolsóként regisztráljuk)
app.use(notFound);
app.use(handleError);

module.exports = app;
```
```

```markdown:my-website/docs/developer/database.md
---
sidebar_position: 5
---

# Adatbázis struktúra

Az Adali Clothing webáruház MySQL adatbázist használ az adatok tárolására. Az adatbázis a következő táblákat tartalmazza.

## Felhasználók tábla

A `user` tábla a felhasználói fiókokat tárolja.

```sql
CREATE TABLE `user` (
  `f_azonosito` int(11) NOT NULL AUTO_INCREMENT,
  `felhasznalonev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `role` enum('user','admin')
