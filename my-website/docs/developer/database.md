`role` enum('user','admin') DEFAULT 'user',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `kupon` varchar(255) DEFAULT NULL,
  `kupon_kod` varchar(50) DEFAULT NULL,
  `kupon_lejar` datetime DEFAULT NULL,
  `kupon_hasznalva` tinyint(1) DEFAULT 0,
  `email_kupon` varchar(255) DEFAULT NULL,
  `email_kupon_kod` varchar(50) DEFAULT NULL,
  `email_kupon_lejar` datetime DEFAULT NULL,
  `email_kupon_hasznalva` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`f_azonosito`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `felhasznalonev` (`felhasznalonev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Termékek tábla

A `termekek` tábla a webáruház termékeit tárolja.

```sql
CREATE TABLE `termekek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) NOT NULL,
  `ar` int(11) NOT NULL,
  `termekleiras` text NOT NULL,
  `kategoria` varchar(255) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `kategoriaId` int(11) DEFAULT NULL,
  `keszlet` int(11) DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `kategoriaId` (`kategoriaId`),
  CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`kategoriaId`) REFERENCES `kategoriak` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Felhasználói termékek tábla

A `user_termekek` tábla a felhasználók által feltöltött termékeket tárolja.

```sql
CREATE TABLE `user_termekek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) NOT NULL,
  `ar` int(11) NOT NULL,
  `leiras` text NOT NULL,
  `meret` varchar(50) NOT NULL,
  `allapot` varchar(50) NOT NULL,
  `kategoriaId` int(11) NOT NULL,
  `f_azonosito` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `kategoriaId` (`kategoriaId`),
  KEY `f_azonosito` (`f_azonosito`),
  CONSTRAINT `user_termekek_ibfk_1` FOREIGN KEY (`kategoriaId`) REFERENCES `kategoriak` (`id`),
  CONSTRAINT `user_termekek_ibfk_2` FOREIGN KEY (`f_azonosito`) REFERENCES `user` (`f_azonosito`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Termékképek tábla

A `termek_kepek` tábla a termékekhez tartozó képeket tárolja.

```sql
CREATE TABLE `termek_kepek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `termek_id` int(11) NOT NULL,
  `kep_url` varchar(255) NOT NULL,
  `is_user_termek` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `termek_id` (`termek_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Kategóriák tábla

A `kategoriak` tábla a termék kategóriákat tárolja.

```sql
CREATE TABLE `kategoriak` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) NOT NULL,
  `szulo_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `szulo_id` (`szulo_id`),
  CONSTRAINT `kategoriak_ibfk_1` FOREIGN KEY (`szulo_id`) REFERENCES `kategoriak` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Vásárlók tábla

A `vevo` tábla a vásárlók adatait tárolja.

```sql
CREATE TABLE `vevo` (
  `vevo_id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) NOT NULL,
  `telefonszam` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `irsz` varchar(10) NOT NULL,
  `telepules` varchar(255) NOT NULL,
  `kozterulet` varchar(255) NOT NULL,
  `fizetesi_mod` varchar(50) NOT NULL,
  `f_azonosito` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`vevo_id`),
  KEY `f_azonosito` (`f_azonosito`),
  CONSTRAINT `vevo_ibfk_1` FOREIGN KEY (`f_azonosito`) REFERENCES `user` (`f_azonosito`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Rendelések tábla

A `rendeles` tábla a rendeléseket tárolja.

```sql
CREATE TABLE `rendeles` (
  `rendeles_id` int(11) NOT NULL AUTO_INCREMENT,
  `termek` int(11) NOT NULL,
  `statusz` varchar(50) NOT NULL DEFAULT 'Feldolgozás alatt',
  `mennyiseg` int(11) NOT NULL DEFAULT 1,
  `vevo_id` int(11) NOT NULL,
  `ar` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rendeles_id`),
  KEY `termek` (`termek`),
  KEY `vevo_id` (`vevo_id`),
  CONSTRAINT `rendeles_ibfk_1` FOREIGN KEY (`termek`) REFERENCES `termekek` (`id`),
  CONSTRAINT `rendeles_ibfk_2` FOREIGN KEY (`vevo_id`) REFERENCES `vevo` (`vevo_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Értékelések tábla

A `ratings` tábla a felhasználói értékeléseket tárolja.

```sql
CREATE TABLE `ratings` (
  `rating_id` int(11) NOT NULL AUTO_INCREMENT,
  `f_azonosito` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `velemeny` text DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rating_id`),
  KEY `f_azonosito` (`f_azonosito`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`f_azonosito`) REFERENCES `user` (`f_azonosito`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Kosár tábla

A `kosar` tábla a felhasználók kosarát tárolja.

```sql
CREATE TABLE `kosar` (
  `kosar_id` int(11) NOT NULL AUTO_INCREMENT,
  `f_azonosito` int(11) NOT NULL,
  `termek_id` int(11) NOT NULL,
  `mennyiseg` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`kosar_id`),
  KEY `f_azonosito` (`f_azonosito`),
  KEY `termek_id` (`termek_id`),
  CONSTRAINT `kosar_ibfk_1` FOREIGN KEY (`f_azonosito`) REFERENCES `user` (`f_azonosito`) ON DELETE CASCADE,
  CONSTRAINT `kosar_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Adatbázis kapcsolatok

Az adatbázis táblák közötti kapcsolatok:

1. **Felhasználó - Felhasználói termékek**: Egy felhasználóhoz több felhasználói termék tartozhat (1:N)
2. **Felhasználó - Értékelések**: Egy felhasználóhoz több értékelés tartozhat (1:N)
3. **Felhasználó - Kosár**: Egy felhasználóhoz egy kosár tartozik, amely több terméket tartalmazhat (1:N)
4. **Felhasználó - Vásárló**: Egy regisztrált felhasználó lehet vásárló is (1:1)
5. **Kategória - Termékek**: Egy kategóriához több termék tartozhat (1:N)
6. **Kategória - Alkategóriák**: Egy kategóriának lehetnek alkategóriái (1:N, önhivatkozó)
7. **Termék - Termékképek**: Egy termékhez több kép tartozhat (1:N)
8. **Termék - Rendelések**: Egy termék több rendelésben szerepelhet (1:N)
9. **Vásárló - Rendelések**: Egy vásárlóhoz több rendelés tartozhat (1:N)

## Adatbázis diagram

```
+-------------+       +---------------+       +-------------+
|    user     |------>| user_termekek |<------| kategoriak  |
+-------------+       +---------------+       +-------------+
      |                      |                      |
      |                      |                      |
      v                      v                      v
+-------------+       +-------------+       +-------------+
|   ratings   |       | termek_kepek|       |  termekek   |
+-------------+       +-------------+       +-------------+
                                                  |
                                                  |
+-------------+       +-------------+       +-------------+
|    kosar    |<------| rendeles    |<------| vevo        |
+-------------+       +-------------+       +-------------+
```

## Adatbázis inicializálás

Az adatbázis inicializálásához használható SQL szkript:

```sql
-- Adatbázis létrehozása
CREATE DATABASE IF NOT EXISTS adaliclothing;
USE adaliclothing;

-- Táblák létrehozása
-- (a fenti CREATE TABLE utasítások)

-- Alapértelmezett admin felhasználó létrehozása
INSERT INTO `user` (`felhasznalonev`, `email`, `jelszo`, `role`) VALUES
('admin', 'admin@adaliclothing.com', '$2b$10$XJrS7/6QsAEcNStRdC1Xc.tG9W5zLQT/5eiKX8N5tQNPLdHwvg5Aq', 'admin');

-- Alapértelmezett kategóriák létrehozása
INSERT INTO `kategoriak` (`nev`, `szulo_id`) VALUES
('Női', NULL),
('Férfi', NULL),
('Gyermek', NULL);

INSERT INTO `kategoriak` (`nev`, `szulo_id`) VALUES
('Felsők', 1),
('Nadrágok', 1),
('Cipők', 1),
('Felsők', 2),
('Nadrágok', 2),
('Cipők', 2),
('Felsők', 3),
('Nadrágok', 3),
('Cipők', 3);
```
```

```markdown:my-website/docs/developer/api.md
---
sidebar_position: 6
---

# API dokumentáció

Az Adali Clothing webáruház RESTful API-t biztosít a frontend és más kliensek számára. Az API a következő végpontokat tartalmazza.

## Hitelesítési végpontok

### Regisztráció

```
POST /api/auth/register
```

Új felhasználói fiók létrehozása.

**Kérés**:
```json
{
  "name": "felhasznalonev",
  "email": "pelda@email.com",
  "password": "jelszo123"
}
```

**Válasz (200)**:
```json
{
  "message": "Sikeres regisztráció",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "felhasznalonev",
    "email": "pelda@email.com"
  }
}
```

### Bejelentkezés

```
POST /api/auth/login
```

Felhasználói bejelentkezés.

**Kérés**:
```json
{
  "email": "pelda@email.com",
  "password": "jelszo123"
}
```

**Válasz (200)**:
```json
{
  "message": "Sikeres bejelentkezés",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "felhasznalonev",
    "email": "pelda@email.com"
  }
}
```

### Jelszó-visszaállítás kérése

```
POST /api/auth/forgot-password
```

Jelszó-visszaállítási email küldése.

**Kérés**:
```json
{
  "email": "pelda@email.com"
}
```

**Válasz (200)**:
```json
{
  "message": "Jelszó-visszaállítási email elküldve"
}
```

### Jelszó visszaállítása

```
POST /api/auth/reset-password
```

Új jelszó beállítása token alapján.

**Kérés**:
```json
{
  "token": "reset_token",
  "password": "uj_jelszo123"
}
```

**Válasz (200)**:
```json
{
  "message": "Jelszó sikeresen frissítve"
}
```

## Termék végpontok

### Összes termék lekérdezése

```
GET /api/products
```

Az összes termék lekérdezése.

**Válasz (200)**:
```json
[
  {
    "id": 1,
    "nev": "Termék neve",
    "ar": 5000,
    "termekleiras": "Termék leírása",
    "kategoria": "Kategória neve",
    "imageUrl": "kepek/termek1.jpg",
    "kategoriaId": 4,
     "keszlet": 10,
    "created_at": "2023-05-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "nev": "Másik termék",
    "ar": 7500,
    "termekleiras": "Másik termék leírása",
    "kategoria": "Kategória neve",
    "imageUrl": "kepek/termek2.jpg",
    "kategoriaId": 5,
    "keszlet": 15,
    "created_at": "2023-05-16T14:20:00.000Z"
  }
]
```

### Termék lekérdezése azonosító alapján

```
GET /api/products/:id
```

Egy adott termék lekérdezése azonosító alapján.

**Válasz (200)**:
```json
{
  "id": 1,
  "nev": "Termék neve",
  "ar": 5000,
  "termekleiras": "Termék leírása",
  "kategoria": "Kategória neve",
  "imageUrl": "kepek/termek1.jpg",
  "kategoriaId": 4,
  "keszlet": 10,
  "created_at": "2023-05-15T10:30:00.000Z"
}
```

### Új termék létrehozása

```
POST /api/products
```

Új termék létrehozása (hitelesítés szükséges).

**Kérés**:
```json
{
  "nev": "Új termék",
  "ar": 6000,
  "termekleiras": "Új termék leírása",
  "kategoria": "Kategória neve",
  "kategoriaId": 4
}
```

**Válasz (201)**:
```json
{
  "message": "Termék sikeresen létrehozva",
  "productId": 3
}
```

### Termék frissítése

```
PUT /api/products/:id
```

Meglévő termék frissítése (hitelesítés szükséges).

**Kérés**:
```json
{
  "nev": "Frissített termék",
  "ar": 6500,
  "termekleiras": "Frissített termék leírása",
  "kategoria": "Kategória neve",
  "kategoriaId": 4,
  "keszlet": 8
}
```

**Válasz (200)**:
```json
{
  "message": "Termék sikeresen frissítve"
}
```

### Termék törlése

```
DELETE /api/products/:id
```

Termék törlése (hitelesítés szükséges).

**Válasz (200)**:
```json
{
  "message": "Termék sikeresen törölve"
}
```

## Felhasználói termék végpontok

### Felhasználói termékek lekérdezése

```
GET /api/products/user-products
```

Az összes felhasználói termék lekérdezése.

**Válasz (200)**:
```json
[
  {
    "id": 1,
    "nev": "Felhasználói termék",
    "ar": 3000,
    "leiras": "Felhasználói termék leírása",
    "meret": "M",
    "allapot": "Használt",
    "kategoriaId": 4,
    "f_azonosito": 2,
    "felhasznalonev": "eladó_felhasználó",
    "created_at": "2023-05-20T09:15:00.000Z",
    "kepek": [
      "kepek/user_termek1_1.jpg",
      "kepek/user_termek1_2.jpg"
    ]
  }
]
```

### Felhasználói termék létrehozása

```
POST /api/products/user-products
```

Új felhasználói termék létrehozása (hitelesítés szükséges).

**Kérés**:
```json
{
  "nev": "Új felhasználói termék",
  "ar": 4000,
  "leiras": "Új felhasználói termék leírása",
  "meret": "L",
  "allapot": "Alig használt",
  "kategoriaId": 5
}
```

**Válasz (201)**:
```json
{
  "message": "Felhasználói termék sikeresen létrehozva",
  "productId": 2
}
```

## Rendelés végpontok

### Új rendelés létrehozása

```
POST /api/orders
```

Új rendelés létrehozása.

**Kérés**:
```json
{
  "customerData": {
    "nev": "Vásárló Neve",
    "telefonszam": "+36301234567",
    "email": "vasarlo@email.com",
    "irsz": "1234",
    "telepules": "Budapest",
    "kozterulet": "Példa utca 10.",
    "fizetesi_mod": "utánvét"
  },
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 5000
    },
    {
      "productId": 2,
      "quantity": 1,
      "price": 7500
    }
  ]
}
```

**Válasz (201)**:
```json
{
  "message": "Rendelés sikeresen létrehozva",
  "orderIds": [1, 2],
  "customerId": 1
}
```

### Felhasználóhoz tartozó rendelések lekérdezése

```
GET /api/orders/user/:userId
```

Felhasználóhoz tartozó rendelések lekérdezése (hitelesítés szükséges).

**Válasz (200)**:
```json
[
  {
    "rendeles_id": 1,
    "termek_nev": "Termék neve",
    "termek_ar": 5000,
    "mennyiseg": 2,
    "statusz": "Feldolgozás alatt",
    "vevo_nev": "Vásárló Neve",
    "created_at": "2023-05-25T11:45:00.000Z"
  }
]
```

## Értékelés végpontok

### Összes értékelés lekérdezése

```
GET /api/ratings
```

Az összes értékelés lekérdezése.

**Válasz (200)**:
```json
[
  {
    "rating_id": 1,
    "rating": 5,
    "velemeny": "Nagyon elégedett vagyok a webáruházzal!",
    "date": "2023-05-10T08:30:00.000Z",
    "felhasznalonev": "felhasznalo1"
  },
  {
    "rating_id": 2,
    "rating": 4,
    "velemeny": "Jó minőségű termékek, gyors szállítás.",
    "date": "2023-05-12T14:20:00.000Z",
    "felhasznalonev": "felhasznalo2"
  }
]
```

### Új értékelés létrehozása

```
POST /api/ratings
```

Új értékelés létrehozása (hitelesítés szükséges).

**Kérés**:
```json
{
  "rating": 5,
  "velemeny": "Kiváló webáruház, csak ajánlani tudom!"
}
```

**Válasz (201)**:
```json
{
  "message": "Értékelés sikeresen létrehozva"
}
```

## Kupon végpontok

### Kupon érvényesítése

```
POST /api/coupons/validate
```

Kupon érvényességének ellenőrzése.

**Kérés**:
```json
{
  "couponCode": "KUPON123"
}
```

**Válasz (200)**:
```json
{
  "valid": true,
  "discount": 10,
  "message": "10% kedvezmény"
}
```

### Kupon használata

```
POST /api/coupons/use
```

Kupon felhasználása (hitelesítés szükséges).

**Kérés**:
```json
{
  "couponCode": "KUPON123",
  "userId": 1
}
```

**Válasz (200)**:
```json
{
  "message": "Kupon sikeresen felhasználva",
  "discount": 10
}
```

## Felhasználói végpontok

### Felhasználói profil lekérdezése

```
GET /api/users/profile
```

Bejelentkezett felhasználó profiljának lekérdezése (hitelesítés szükséges).

**Válasz (200)**:
```json
{
  "id": 1,
  "felhasznalonev": "felhasznalonev",
  "email": "pelda@email.com",
  "profile_image": "kepek/profilkep.jpg",
  "kupon": "10% kedvezmény",
  "kupon_kod": "KUPON123",
  "kupon_lejar": "2023-06-30T23:59:59.000Z",
  "kupon_hasznalva": 0
}
```

### Felhasználói profil frissítése

```
PUT /api/users/profile
```

Bejelentkezett felhasználó profiljának frissítése (hitelesítés szükséges).

**Kérés**:
```json
{
  "felhasznalonev": "uj_felhasznalonev",
  "email": "uj_email@pelda.com"
}
```

**Válasz (200)**:
```json
{
  "message": "Profil sikeresen frissítve"
}
```

### Profilkép feltöltése

```
POST /api/users/profile/image
```

Profilkép feltöltése (hitelesítés szükséges).

**Kérés**:
```
multipart/form-data
- profileImage: [fájl]
```

**Válasz (200)**:
```json
{
  "message": "Profilkép sikeresen feltöltve",
  "imageUrl": "kepek/profilkep_123456.jpg"
}
```

## Hibaválaszok

Az API a következő hibaválaszokat adhatja:

### Érvénytelen kérés (400)

```json
{
  "error": "Hiányzó kötelező mezők"
}
```

### Hitelesítési hiba (401)

```json
{
  "error": "Érvénytelen token"
}
```

### Jogosultsági hiba (403)

```json
{
  "error": "Nincs jogosultságod ehhez a művelethez"
}
```

### Nem található (404)

```json
{
  "error": "Az útvonal nem található"
}
```

### Szerver hiba (500)

```json
{
  "error": "Szerver hiba történt"
}
```
```

```markdown:my-website/docs/developer/frontend/overview.md
---
sidebar_position: 1
---

# Frontend áttekintés

Az Adali Clothing webáruház frontend része React.js keretrendszerre épül, és a következő technológiákat használja.

## Technológiai stack

- **Keretrendszer**: React.js
- **Állapotkezelés**: Redux, Redux Toolkit
- **Routing**: React Router
- **UI komponensek**: Material UI
- **HTTP kliens**: Axios
- **Űrlap kezelés**: Formik, Yup
- **Stílusok**: CSS Modules, Styled Components

## Projekt struktúra

```
adaliclothing-mvc/frontend/
├── public/                # Statikus fájlok
├── src/
│   ├── assets/            # Képek, ikonok, stb.
│   ├── components/        # Újrafelhasználható komponensek
│   │   ├── common/        # Általános komponensek
│   │   ├── layout/        # Elrendezés komponensek
│   │   ├── product/       # Termék komponensek
│   │   ├── auth/          # Hitelesítési komponensek
│   │   └── ...
│   ├── pages/             # Oldalak
│   ├── redux/             # Redux store, action-ök, reducer-ek
│   │   ├── slices/        # Redux Toolkit szeletkék
│   │   ├── store.js       # Redux store konfigurálása
│   │   └── ...
│   ├── services/          # API szolgáltatások
│   ├── utils/             # Segédfüggvények
│   ├── hooks/             # Egyedi React hook-ok
│   ├── constants/         # Konstansok
│   ├── App.js             # Fő alkalmazás komponens
│   ├── index.js           # Alkalmazás belépési pont
│   └── ...
├── package.json           # Függőségek
└── ...
```

## Fő komponensek

### Elrendezés komponensek

- **Header**: Navigációs fejléc, keresés, kosár ikon
- **Footer**: Lábléc információkkal, linkekkel
- **Sidebar**: Kategória szűrők, árkategóriák
- **Layout**: Az alkalmazás általános elrendezése

### Termék komponensek

- **ProductCard**: Termék kártya a listanézetben
- **ProductList**: Termékek listázása
- **ProductDetail**: Termék részletes nézete
- **ProductFilter**: Termékek szűrése
- **ProductSearch**: Termékek keresése

### Hitelesítési komponensek

- **LoginForm**: Bejelentkezési űrlap
- **RegisterForm**: Regisztrációs űrlap
- **ForgotPasswordForm**: Jelszó-visszaállítási űrlap
- **ResetPasswordForm**: Új jelszó beállítási űrlap
- **UserProfile**: Felhasználói profil

### Kosár komponensek

- **CartItem**: Kosárelem
- **CartList**: Kosár tartalma
- **CartSummary**: Kosár összegzés
- **Checkout**: Fizetési folyamat

### Egyéb komponensek

- **Rating**: Értékelés megjelenítése és létrehozása
- **Notification**: Értesítések megjelenítése
- **Modal**: Modális ablakok
- **Loader**: Betöltés jelző
- **ErrorBoundary**: Hibakezelő komponens

## Redux állapotkezelés

A Redux állapotkezelő a következő szeletekre (slices) van felosztva:

### Auth szelet

```javascript
// redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Bejelentkezési hiba';
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### Product szelet

```javascript
// redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    isLoading: false,
    error: null
  },
  reducers: {
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Hiba a termékek betöltésekor';
      });
  }
});

export const { selectProduct, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
```

### Cart szelet

```javascript
// redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
      
      state.totalQuantity += 1;
      state.totalAmount += newItem.ar;
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity -= 1;
      }
      
      state.totalQuantity -= 1;
      state.totalAmount -= existingItem.ar;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

## API szolgáltatások

Az API szolgáltatások az Axios HTTP klienst használják a backend API-val való kommunikációhoz.

```javascript
// services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Kérés elfogó a token hozzáadásához
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Válasz elfogó a hibák kezeléséhez
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Automatikus kijelentkezés 401-es hiba esetén
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Egyedi hook-ok

Az alkalmazás egyedi React hook-okat használ az ismétlődő logika absztrahálására.

```javascript
// hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;

  const loginUser = (credentials) => {
    return dispatch(login(credentials));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login: loginUser,
    logout: logoutUser
  };
};
```
