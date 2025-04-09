---
sidebar_position: 1
---

# Frontend áttekintés

Az Adali Clothing webáruház frontend része React.js keretrendszerre épül, modern webes technológiákat alkalmazva a felhasználói élmény optimalizálása érdekében.

## Technológiai stack

- **Keretrendszer**: React.js - Komponens alapú fejlesztés, virtuális DOM
- **Állapotkezelés**: React useState és useEffect hookokat használunk
- **Routing**: React Router - Kliens oldali útvonalkezelés
- **UI komponensek**: Material UI - Kész komponenskönyvtár
- **HTTP kliens**: Axios - API kommunikáció
- **Stílusok**: CSS és Material UI stílusok

## Projekt struktúra

A frontend projekt struktúrája egyszerű felépítésű:

```
adaliclothing/react2/
└── src/
    ├── App.js             # Fő alkalmazás komponens
    ├── index.js           # Alkalmazás belépési pont
    ├── [további .js fájlok] # Komponensek és egyéb logika
```

A projekt minden JavaScript fájlja közvetlenül az `src` mappában található, nem használunk külön alkönyvtárakat a különböző típusú fájlok szervezésére.

## Fő funkcionális területek

### Felhasználói felület

A webáruház felhasználói felülete reszponzív dizájnt követ, amely különböző képernyőméreteken optimális megjelenést biztosít. A Material UI komponenskönyvtár segítségével egységes megjelenés és viselkedés érhető el az alkalmazás egészében.

### Termékkezelés

A termékek megjelenítése, szűrése és keresése a webáruház központi funkciója. A termékek listázása lapozható formában történik, kategóriák és egyéb szűrők alapján rendezhetők. A termékrészletek oldalon a felhasználók megtekinthetik a termék részletes leírását, képeit és hozzáadhatják a kosárhoz.

### Kosár és fizetés

A kosár funkció lehetővé teszi a felhasználók számára a kiválasztott termékek tárolását és mennyiségük módosítását. A fizetési folyamat több lépésből áll, beleértve a szállítási cím megadását, fizetési mód kiválasztását és a rendelés véglegesítését.

### Felhasználói fiókok

A felhasználók regisztrálhatnak, bejelentkezhetnek és kezelhetik profiljukat. A regisztrált felhasználók hozzáférhetnek rendelési előzményeikhez, menthetik kedvenc termékeiket és értékeléseket adhatnak.

### Adminisztráció

Az adminisztrációs felület lehetővé teszi a termékek, kategóriák, felhasználók és rendelések kezelését. Az adminisztrátorok új termékeket adhatnak hozzá, módosíthatják a meglévőket, kezelhetik a rendeléseket és felhasználói jogosultságokat.

## Állapotkezelés

Az alkalmazás állapotkezelése React hookokat használ, elsősorban a useState és useEffect hookokat. Az állapotot a komponensek szintjén kezeljük, és szükség esetén prop drilling segítségével adjuk tovább a gyermek komponenseknek.

A fő állapot területek:
- **Felhasználói hitelesítés**: Bejelentkezési állapot és felhasználói adatok
- **Termékek**: Termékek listája és részletek
- **Kosár**: Kosár tartalma és összegzés
- **UI állapot**: Betöltési állapotok, hibaüzenetek, modális ablakok

## API kommunikáció

Az Axios HTTP kliens segítségével az alkalmazás kommunikál a backend API-val. Az API hívások közvetlenül a komponensekből történnek, általában useEffect hookokban vagy eseménykezelőkben.

## Komponensek

Az alkalmazás fő komponensei:

- **App**: A fő alkalmazás komponens, amely tartalmazza a routing logikát
- **Navbar**: Navigációs sáv a felhasználói felület tetején
- **ProductList**: Termékek listázása
- **ProductDetail**: Termék részletes nézete
- **Cart**: Kosár komponens
- **Checkout**: Fizetési folyamat
- **Login/Register**: Bejelentkezési és regisztrációs űrlapok
- **Profile**: Felhasználói profil
- **Admin**: Adminisztrációs felület

## Routing

A React Router segítségével az alkalmazás különböző oldalak között navigál. A fő útvonalak:

- `/`: Kezdőoldal
- `/products`: Termékek listája
- `/products/:id`: Termék részletek
- `/cart`: Kosár
- `/checkout`: Fizetési folyamat
- `/login`: Bejelentkezés
- `/register`: Regisztráció
- `/profile`: Felhasználói profil
- `/admin`: Adminisztrációs felület

## Törlési műveletek kezelése

A törlési műveletek (delete kérések) kezelése során fontos, hogy megfelelően frissítsük az alkalmazás állapotát a sikeres törlés után. Az alábbi példa bemutatja a helyes megközelítést:

```javascript
// Példa a termék törlésére (admin)
const deleteProduct = async (productId) => {
  try {
    setLoading(true);
    
    // API kérés a termék törléséhez
    await axios.delete(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Sikeres törlés után frissítjük a termékek listáját
    // Fontos: Az eredeti tömböt nem módosítjuk, hanem új tömböt hozunk létre
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    
    // Felhasználói visszajelzés
    setSuccessMessage('A termék sikeresen törölve!');
    setLoading(false);
  } catch (error) {
    setError(error.response?.data?.error || 'Hiba a termék törlése során');
    setLoading(false);
  }
};
```

Hasonlóan, a felhasználók törlésénél:

```javascript
// Felhasználó törlése (admin)
const deleteUser = async (userId) => {
  try {
    setLoading(true);
    
    // API kérés a felhasználó törléséhez
    await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Sikeres törlés után frissítjük a felhasználók listáját
    setUsers(prevUsers => prevUsers.filter(user => user.f_azonosito !== userId));
    
    // Felhasználói visszajelzés
    setSuccessMessage('A felhasználó sikeresen törölve!');
    setLoading(false);
  } catch (error) {
    setError(error.response?.data?.error || 'Hiba a felhasználó törlése során');
    setLoading(false);
  }
};
```

Értékelések törlésekor:

```javascript
// Értékelés törlése
const deleteRating = async (ratingId) => {
  try {
    setLoading(true);
    
    // API kérés az értékelés törléséhez
    await axios.delete(`${API_BASE_URL}/ratings/${ratingId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Sikeres törlés után frissítjük az értékelések listáját
    setRatings(prevRatings => prevRatings.filter(rating => rating.rating_id !== ratingId));
    
    // Felhasználói visszajelzés
    setSuccessMessage('Az értékelés sikeresen törölve!');
    setLoading(false);
  } catch (error) {
    setError(error.response?.data?.error || 'Hiba az értékelés törlése során');
    setLoading(false);
  }
};
```

A fenti példákban a legfontosabb szempontok:

1. **Immutabilitás**: Az eredeti tömböket nem módosítjuk közvetlenül, hanem új tömböket hozunk létre a `filter` metódus segítségével.
2. **Állapotfrissítés**: A `setState` függvény funkcionális formáját használjuk, amely biztosítja, hogy mindig a legfrissebb állapottal dolgozunk.
3. **Felhasználói visszajelzés**: Sikeres törlés után pozitív visszajelzést adunk a felhasználónak.
4. **Hibakezelés**: A hibákat megfelelően kezeljük és megjelenítjük a felhasználó számára.

Ez a megközelítés biztosítja, hogy a törlési műveletek után az alkalmazás állapota konzisztens maradjon, és a felhasználói felület helyesen tükrözze a változásokat.

## Törlési műveletek kezelése

A törlési műveletek (delete kérések) kezelése során fontos, hogy megfelelően frissítsük az alkalmazás állapotát a sikeres törlés után. Az alkalmazásban több helyen is előfordulnak törlési műveletek:

### Termékek törlése

Az adminisztrációs felületen lehetőség van termékek törlésére. A törlés során az alkalmazás először megerősítést kér a felhasználótól, majd sikeres törlés után frissíti a termékek listáját. A törlés után fontos, hogy a már nem létező termékre mutató hivatkozásokat is eltávolítsuk, például a kosárból vagy a kedvencek közül.

### Felhasználók törlése

Az adminisztrátorok törölhetnek felhasználókat a rendszerből. A felhasználó törlése előtt az alkalmazás ellenőrzi, hogy nincsenek-e függőben lévő rendelései vagy egyéb kapcsolódó adatai. A törlés után a felhasználói listát frissítjük, és ha az aktuálisan bejelentkezett felhasználó törölte saját fiókját, akkor kijelentkeztetjük.

### Értékelések törlése

A felhasználók törölhetik saját értékeléseiket, az adminisztrátorok pedig bármely értékelést törölhetnek. Az értékelés törlése után frissítjük az értékelések listáját és a termék átlagos értékelését is.

### Kosárelemek törlése

A felhasználók eltávolíthatnak termékeket a kosarukból. A kosárelem törlése után frissítjük a kosár tartalmát és a végösszeget.

### Általános elvek

A törlési műveletek során a következő elveket követjük:

1. **Immutabilitás**: Az eredeti adatstruktúrákat nem módosítjuk közvetlenül, hanem új adatstruktúrákat hozunk létre.
2. **Optimista frissítés**: A felhasználói felületet azonnal frissítjük, feltételezve, hogy a törlés sikeres lesz. Ha hiba történik, visszaállítjuk az eredeti állapotot.
3. **Felhasználói visszajelzés**: A törlési művelet előtt megerősítést kérünk, a művelet közben betöltési indikátort jelenítünk meg, sikeres törlés után pedig értesítjük a felhasználót.
4. **Hibakezelés**: A törlési műveletek során fellépő hibákat megfelelően kezeljük és megjelenítjük a felhasználó számára.

Ezek az elvek biztosítják, hogy a törlési műveletek után az alkalmazás állapota konzisztens maradjon, és a felhasználói felület helyesen tükrözze a változásokat.

## Adatbetöltési stratégiák

Az alkalmazás különböző stratégiákat alkalmaz az adatok betöltésére:

### Lusta betöltés

A termékek listáját lapozható formában töltjük be, egyszerre csak korlátozott számú terméket jelenítünk meg. Ez csökkenti a kezdeti betöltési időt és a hálózati forgalmat.

### Előzetes betöltés

A gyakran használt adatokat, például a kategóriákat és a felhasználói profilt előzetesen betöltjük, hogy gyorsabb legyen a navigáció az alkalmazáson belül.

### Gyorsítótárazás

A ritkán változó adatokat, például a termék részleteket gyorsítótárazzuk a localStorage-ban, hogy csökkentsük a szerver terhelését és gyorsítsuk az alkalmazást.

## Űrlapkezelés és validáció

Az alkalmazásban számos űrlap található, például regisztráció, bejelentkezés, termék feltöltés, rendelés leadás. Az űrlapok kezelése és validációja a következő elvek szerint történik:

### Controlled Components

Az űrlapmezők értékeit a React állapotában tároljuk, és az onChange eseménykezelők frissítik az állapotot. Ez lehetővé teszi a valós idejű validációt és a felhasználói visszajelzést.

### Validáció

Az űrlapok validációja több szinten történik:

1. **Kliens oldali validáció**: Az űrlap beküldése előtt ellenőrizzük a mezők értékeit, és hibaüzeneteket jelenítünk meg a felhasználó számára.
2. **Szerver oldali validáció**: A backend API is ellenőrzi a beküldött adatokat, és hibaüzeneteket küld vissza, ha szükséges.

### Hibaüzenetek

A hibaüzeneteket a megfelelő mezők mellett jelenítjük meg, és a Material UI komponensek segítségével formázzuk őket. A hibaüzenetek világosan jelzik a problémát és útmutatást adnak a javításhoz.

## Teljesítmény optimalizálás

Az alkalmazás teljesítményének optimalizálása érdekében a következő technikákat alkalmazzuk:

### Komponensek memoizálása

A React.memo függvényt használjuk a komponensek memoizálására, hogy elkerüljük a szükségtelen újrarendereléseket.

### Virtuális listák

Nagy listák esetén virtuális lista technikát alkalmazunk, amely csak a látható elemeket rendereli, így csökkentve a DOM műveletek számát.

### Kód felosztás

A React.lazy és Suspense komponenseket használjuk a kód felosztására, hogy csak a szükséges JavaScript kódot töltsük be.

### Képek optimalizálása

A képeket optimalizáljuk a megfelelő méret és formátum használatával, valamint lazy loading technikával töltjük be őket.

## Tesztelés

Az alkalmazás tesztelése több szinten történik:

### Egységtesztek

A komponensek és függvények egységtesztjeit Jest és React Testing Library segítségével írjuk.

### Integrációs tesztek

Az API integrációs tesztjeit Axios Mock Adapter segítségével végezzük.

### End-to-end tesztek

A teljes alkalmazás end-to-end tesztjeit Cypress segítségével végezzük.

### Felhasználói élmény tesztelés

A felhasználói élmény tesztelését valós felhasználókkal végezzük, és a visszajelzések alapján folyamatosan fejlesztjük az alkalmazást.

## Verziókezelés és deployment

Az alkalmazás fejlesztése során Git verziókezelő rendszert használunk, és a következő folyamatokat követjük:

### Fejlesztési folyamat

1. Feature branch-ek létrehozása új funkciók fejlesztéséhez
2. Pull request-ek és kód review-k a minőség biztosítása érdekében
3. Continuous Integration a tesztek automatikus futtatásához

### Deployment

Az alkalmazás deployment-je a következő környezetekben történik:

1. **Fejlesztői környezet**: A fejlesztők lokális gépein
2. **Teszt környezet**: Automatikus deployment a teszt szerverre
3. **Éles környezet**: Manuális deployment az éles szerverre

A deployment folyamat során automatikus teszteket futtatunk, és csak sikeres tesztek esetén engedélyezzük a deployment-et.

## Dokumentáció

Az alkalmazás kódját és funkcióit részletesen dokumentáljuk:

### Kód dokumentáció

A komponensek és függvények JSDoc kommentekkel vannak ellátva, amelyek leírják a paramétereket, visszatérési értékeket és a működést.

### Felhasználói dokumentáció

A felhasználók számára részletes útmutatókat készítünk az alkalmazás használatához.

### Fejlesztői dokumentáció

A fejlesztők számára részletes dokumentációt készítünk az alkalmazás architektúrájáról, komponenseiről és API-jairól.

Ezek a dokumentációk segítenek az alkalmazás megértésében és továbbfejlesztésében.

## Biztonság

Az alkalmazás biztonságát több szinten biztosítjuk:

### Autentikáció

A felhasználók autentikációja JWT (JSON Web Token) alapú. A bejelentkezés során a szerver egy tokent generál, amelyet a kliens minden kéréshez csatol az Authorization fejlécben. A token lejárati ideje korlátozott, és a szerver ellenőrzi a token érvényességét minden védett erőforrás elérésekor.

### Jogosultságkezelés

Az alkalmazás különböző jogosultsági szinteket kezel:
- **Vendég**: Böngészhet a termékek között, de nem vásárolhat
- **Regisztrált felhasználó**: Vásárolhat, értékeléseket írhat, kezelheti a profilját
- **Admin**: Kezelheti a termékeket, felhasználókat, rendeléseket

A jogosultságokat a szerver ellenőrzi minden védett művelet végrehajtása előtt.

### Adatvédelem

A felhasználói adatokat biztonságosan kezeljük:
- A jelszavakat soha nem tároljuk plain text formában
- Az érzékeny adatokat titkosítjuk
- A GDPR előírásainak megfelelően kezeljük a személyes adatokat

### CSRF és XSS védelem

Az alkalmazás védelmet nyújt a Cross-Site Request Forgery (CSRF) és Cross-Site Scripting (XSS) támadások ellen:
- A JWT token használata segít a CSRF támadások elleni védelemben
- A React automatikusan escapeli a felhasználói inputokat, ami védelmet nyújt az XSS támadások ellen
- A Content Security Policy (CSP) további védelmet biztosít

## Nemzetköziesítés és lokalizáció

Az alkalmazás támogatja a többnyelvűséget és a különböző régiók sajátosságait:

### Többnyelvűség

Az alkalmazás jelenleg magyar nyelven érhető el, de a kód struktúrája lehetővé teszi további nyelvek egyszerű hozzáadását. A szövegek külön fájlokban vannak tárolva, ami megkönnyíti a fordítást.

### Dátum és idő formátumok

A dátumok és időpontok megjelenítése a magyar konvencióknak megfelelően történik, de a kód támogatja más régiók formátumait is.

### Pénznem

Az árak megjelenítése forintban történik, de a kód támogatja más pénznemek használatát is.

## Akadálymentesség

Az alkalmazás fejlesztése során figyelembe vesszük az akadálymentességi szempontokat:

### Billentyűzet navigáció

Az alkalmazás teljes egészében használható billentyűzettel, minden interaktív elem megfelelően fókuszálható és aktiválható.

### Képernyőolvasó támogatás

Az alkalmazás támogatja a képernyőolvasókat, minden nem szöveges tartalom megfelelő alternatív szöveggel van ellátva.

### Kontraszt és olvashatóság

A színek és betűméretek kiválasztása során figyelembe vesszük a kontraszt és olvashatóság szempontjait, hogy az alkalmazás mindenki számára jól használható legyen.

## Felhasználói élmény

Az alkalmazás fejlesztése során nagy hangsúlyt fektetünk a felhasználói élményre:

### Reszponzív dizájn

Az alkalmazás reszponzív dizájnt követ, amely különböző képernyőméreteken optimális megjelenést biztosít. A Material UI Grid rendszere és media query-k segítségével a komponensek alkalmazkodnak a különböző képernyőméretekhez.

### Betöltési állapotok

Az adatok betöltése közben betöltési indikátorokat jelenítünk meg, hogy a felhasználó tudja, hogy az alkalmazás dolgozik. A Skeleton komponensek használata további vizuális visszajelzést ad a betöltés alatt.

### Animációk és átmenetek

Az alkalmazás egyszerű animációkat és átmeneteket használ a felhasználói élmény javítása érdekében. A Material UI Transition komponensei segítenek a zökkenőmentes átmenetek megvalósításában.

### Hibaüzenetek

Az alkalmazás felhasználóbarát hibaüzeneteket jelenít meg, amelyek segítenek a problémák megértésében és megoldásában. A Snackbar komponensek használata konzisztens megjelenést biztosít a hibaüzeneteknek.

## Jövőbeli fejlesztések

Az alkalmazás folyamatos fejlesztés alatt áll, a következő funkciók és fejlesztések tervezettek:

### Funkcionális fejlesztések

- **Kedvencek lista**: A felhasználók elmenthetik kedvenc termékeiket
- **Összehasonlítás**: A termékek összehasonlítása egymás mellett
- **Ajánlórendszer**: Személyre szabott termékajánlások a felhasználói viselkedés alapján

### Technikai fejlesztések

- **Redux bevezetése**: Az állapotkezelés központosítása és egyszerűsítése
- **GraphQL bevezetése**: Hatékonyabb adatlekérdezés és -manipuláció
- **Progressive Web App (PWA)**: Offline működés és jobb mobil élmény

### Teljesítmény fejlesztések

- **Server-Side Rendering (SSR)**: Gyorsabb kezdeti betöltés és jobb SEO
- **Code splitting további finomítása**: Még kisebb bundle méret
- **Képek további optimalizálása**: WebP formátum és responsive images

## Összefoglalás

Az Adali Clothing webáruház frontend része modern webes technológiákat használ a felhasználói élmény optimalizálása érdekében. A React.js keretrendszer, a Material UI komponenskönyvtár és az Axios HTTP kliens együttesen biztosítják a gyors, reszponzív és felhasználóbarát felületet.

Az alkalmazás architektúrája komponens alapú, ami lehetővé teszi a kód újrafelhasználását és a könnyű karbantarthatóságot. Az állapotkezelés React hookokkal történik, ami egyszerű és hatékony megoldást biztosít.

A frontend és backend közötti kommunikáció RESTful API-n keresztül történik, ami tiszta és jól definiált interfészt biztosít a két réteg között.

Az alkalmazás folyamatos fejlesztés alatt áll, és a jövőben további funkciókkal és fejlesztésekkel bővül, hogy még jobb felhasználói élményt nyújtson.
 