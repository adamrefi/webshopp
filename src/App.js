// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './kezdolap';
import Oterm from './oterm';
import ProductDetail from './ProductDetail'; // Importáljuk a termék részletes oldalt
import SignUp from './signup';
import SignIn from './sign';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Kezdőlap */}
        <Route path="/kezdolap" element={<Home />} /> {/* Kezdőlap */}
        <Route path="/oterm" element={<Oterm />} /> {/* Összes Termék */}
        <Route path="/product/:id" element={<ProductDetail />} /> {/* Termék részletes oldal */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/sign" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
