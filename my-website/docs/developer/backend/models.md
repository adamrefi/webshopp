- **Kupon frissítése**: Felhasználói kupon adatainak frissítése
- **Email kupon frissítése**: Felhasználói email kupon adatainak frissítése
- **Kupon használat jelölése**: Kupon felhasználásának rögzítése
- **Felhasználói kuponok lekérdezése**: Felhasználóhoz tartozó kuponok listázása
- **Kuponok küldése**: Kuponok küldése kiválasztott felhasználóknak
- **Kuponkód generálása**: Egyedi kuponkód létrehozása

### Kódrészlet

```javascript
class CouponModel {
  constructor(db) {
    this.db = db;
  }

  async getAllActiveUsers() {
    const [users] = await this.db.execute('SELECT email, felhasznalonev, f_azonosito FROM user WHERE email_kupon_hasznalva = 0 OR email_kupon_hasznalva IS NULL');
    return users;
  }

  async updateUserCoupon(userId, couponType, couponCode, expiryDays = 30) {
    // Számítsuk ki a lejárati dátumot
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    const formattedExpiryDate = expiryDate.toISOString().slice(0, 19).replace('T', ' ');
    
    // Frissítsük a felhasználó kupon adatait
    const [result] = await this.db.execute(
      'UPDATE user SET kupon = ?, kupon_kod = ?, kupon_lejar = ?, kupon_hasznalva = 0 WHERE f_azonosito = ?',
      [`${couponType}% kedvezmény`, couponCode, formattedExpiryDate, userId]
    );
    
    return result.affectedRows > 0;
  }
}
```
```

```markdown:my-website/docs/developer/backend/controllers.md
---
sidebar_position: 3
---

# Backend controllerek

A controllerek felelősek a HTTP kérések feldolgozásáért, az üzleti logika végrehajtásáért és a megfelelő válaszok előállításáért. Az Adali Clothing webáruház a következő controllereket használja.

## AuthController

Az `AuthController` a felhasználói hitelesítésért felelős.

### Fő funkciók

- **Regisztráció**: Új felhasználói fiók létrehozása
- **Bejelentkezés**: Felhasználói hitelesítés és token generálás
- **Jelszó-visszaállítás kérése**: Jelszó-visszaállítási token generálása és email küldése
- **Jelszó visszaállítása**: Új jelszó beállítása token alapján

### Kódrészlet

```javascript
class AuthController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Ellenőrizzük, hogy a felhasználónév vagy email már foglalt-e
      const existingUserByEmail = await this.userModel.findByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: 'Ez az email cím már regisztrálva van' });
      }
      
      // Új felhasználó létrehozása
      const user = await this.userModel.create({ name, email, password });
      
      // JWT token generálása
      const token = jwt.sign(
        { userId: user.f_azonosito, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'Sikeres regisztráció',
        token,
        user: {
          id: user.f_azonosito,
          name: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Regisztrációs hiba:', error);
      res.status(500).json({ error: 'Szerver hiba történt a regisztráció során' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Felhasználó keresése email alapján
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Hibás email vagy jelszó' });
      }
      
      // Jelszó ellenőrzése
      const isPasswordValid = await bcrypt.compare(password, user.jelszo);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Hibás email vagy jelszó' });
      }
      
      // JWT token generálása
      const token = jwt.sign(
        { userId: user.f_azonosito, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Sikeres bejelentkezés',
        token,
        user: {
          id: user.f_azonosito,
          name: user.felhasznalonev,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Bejelentkezési hiba:', error);
      res.status(500).json({ error: 'Szerver hiba történt a bejelentkezés során' });
    }
  }
}
```

## ProductController

A `ProductController` a termékek kezeléséért felelős.

### Fő funkciók

- **Termékek listázása**: Összes termék vagy felhasználói termék lekérdezése
- **Termék lekérdezése**: Termék adatainak lekérdezése azonosító alapján
- **Termék létrehozása**: Új termék vagy felhasználói termék hozzáadása
- **Termék frissítése**: Meglévő termék adatainak módosítása
- **Termék törlése**: Termék eltávolítása

### Kódrészlet

```javascript
class ProductController {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productModel.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error('Hiba a termékek lekérdezésekor:', error);
      res.status(500).json({ error: 'Adatbázis hiba' });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await this.productModel.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ error: 'Termék nem található' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Hiba a termék lekérdezésekor:', error);
      res.status(500).json({ error: 'Adatbázis hiba' });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      
      // Kötelező mezők ellenőrzése
      if (!productData.nev || !productData.ar || !productData.termekleiras || !productData.kategoria) {
        return res.status(400).json({ error: 'Hiányzó kötelező mezők' });
      }
      
      const productId = await this.productModel.createProduct(productData);
      
      res.status(201).json({
        message: 'Termék sikeresen létrehozva',
        productId
      });
    } catch (error) {
      console.error('Hiba a termék létrehozásakor:', error);
      res.status(500).json({ error: 'Adatbázis hiba' });
    }
  }
}
```

## OrderController

Az `OrderController` a rendelések kezeléséért felelős.

### Fő funkciók

- **Rendelés létrehozása**: Új rendelés rögzítése
- **Rendelések lekérdezése**: Felhasználóhoz tartozó rendelések listázása
- **Rendelés részleteinek lekérdezése**: Rendelés adatainak lekérdezése azonosító alapján
- **Rendelés állapotának frissítése**: Rendelés státuszának módosítása

### Kódrészlet

```javascript
class OrderController {
  constructor(orderModel, productModel) {
    this.orderModel = orderModel;
    this.productModel = productModel;
  }

  async createOrder(req, res) {
    try {
      const { customerData, orderItems } = req.body;
      
      // Vásárló létrehozása
      const customerId = await this.orderModel.createCustomer(customerData);
      
      // Rendelési tételek létrehozása
      const orderIds = [];
      for (const item of orderItems) {
        const orderData = {
          termek: item.productId,
          statusz: 'Feldolgozás alatt',
          mennyiseg: item.quantity,
          vevo_id: customerId,
          ar: item.price
        };
        
        const orderId = await this.orderModel.createOrder(orderData);
        orderIds.push(orderId);
        
        // Készlet frissítése
        await this.productModel.updateStock(item.productId, item.quantity);
      }
      
      res.status(201).json({
        message: 'Rendelés sikeresen létrehozva',
        orderIds,
        customerId
      });
    } catch (error) {
      console.error('Hiba a rendelés létrehozásakor:', error);
      res.status(500).json({ error: 'Adatbázis hiba' });
    }
  }

  async getUserOrders(req, res) {
    try {
      const userId = req.params.userId;
      const orders = await this.orderModel.getOrdersByUserId(userId);
      
      res.json(orders);
    } catch (error) {
      console.error('Hiba a rendelések lekérdezésekor:', error);
      res.status(500).json({ error: 'Adatbázis hiba' });
    }
  }
}
```
```

```markdown:my-website/docs/developer/backend/routes.md
---
sidebar_position: 4
---

# Backend útvonalak

Az útvonalak definiálják az API végpontokat és összekapcsolják azokat a megfelelő controller függvényekkel. Az Adali Clothing webáruház a következő útvonalakat használja.

## Hitelesítési útvonalak

```javascript
// auth.routes.js
const express = require('express');
const router = express.Router();
const authController = new AuthController(userModel);

// Regisztráció
router.post('/register', authController.register.bind(authController));

// Bejelentkezés
router.post('/login', authController.login.bind(authController));

// Jelszó-visszaállítás kérése
router.post('/forgot-password', authController.forgotPassword.bind(authController));

// Jelszó visszaállítása
router.post('/reset-password', authController.resetPassword.bind(authController));

module.exports = router;
```

## Termék útvonalak

```javascript
// product.routes.js
const express = require('express');
const router = express.Router();
const productController = new ProductController(productModel);
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Összes termék lekérdezése
router.get('/', productController.getAllProducts.bind(productController));

// Termék lekérdezése azonosító alapján
router.get('/:id', productController.getProductById.bind(productController));

// Új termék létrehozása (csak hitelesített felhasználók számára)
router.post('/', 
  authMiddleware.verifyToken, 
  uploadMiddleware.single('image'), 
  productController.createProduct.bind(productController)
);

// Termék frissítése (csak hitelesített felhasználók számára)
router.put('/:id', 
  authMiddleware.verifyToken, 
  uploadMiddleware.single('image'), 
  productController.updateProduct.bind(productController)
);

// Termék törlése (csak hitelesített felhasználók számára)
router.delete('/:id', 
  authMiddleware.verifyToken, 
  productController.deleteProduct.bind(productController)
);

// Felhasználói termékek lekérdezése
router.get('/user-products', productController.getAllUserProducts.bind(productController));

// Felhasználói termék létrehozása
router.post('/user-products', 
  authMiddleware.verifyToken, 
  uploadMiddleware.array('images', 5), 
  productController.createUserProduct.bind(productController)
);

module.exports = router;
```

## Rendelés útvonalak

```javascript
// order.routes.js
const express = require('express');
const router = express.Router();
const orderController = new OrderController(orderModel, productModel);
const authMiddleware = require('../middleware/authMiddleware');

// Új rendelés létrehozása
router.post('/', orderController.createOrder.bind(orderController));

// Felhasználóhoz tartozó rendelések lekérdezése (csak hitelesített felhasználók számára)
router.get('/user/:userId', 
  authMiddleware.verifyToken, 
  orderController.getUserOrders.bind(orderController)
);

// Rendelés részleteinek lekérdezése (csak hitelesített felhasználók számára)
router.get('/:id', 
  authMiddleware.verifyToken, 
  orderController.getOrderById.bind(orderController)
);

// Rendelés állapotának frissítése (csak adminisztrátorok számára)
router.put('/:id/status', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  orderController.updateOrderStatus.bind(orderController)
);

module.exports = router;
```

## Értékelés útvonalak

````javascript
// rating.routes.js
const express = require('express');
const router = express.Router();
const ratingController = new RatingController(ratingModel);
const authMiddleware = require('../middleware/authMiddleware');

// Összes értékelés lekérdezése
router.get('/', ratingController.getAllRatings.bind(ratingController));

// Új értékelés létrehozása (csak hitelesített felhasználók számára)
router.post('/',
