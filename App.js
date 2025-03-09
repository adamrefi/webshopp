// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './kezdolap';
import Oterm from './oterm';
import SignUp from './signup';
import SignIn from './sign';
import Kosar from './kosar';
import Add from './add';
import Vinted from './vinted';
import User from './admin/user';
import ProductDetail from './ProductDetail';
import Shipping from './shipping';
import Termekeink from './termekeink';
import Tadmin from './admin/tadmin';
import Termadmin from './admin/termadmin';
import Fadmin from './admin/fadmin';
import Fiokom from './fiokom';

// Add this to your Routes:



// In your routes:

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Kezdőlap */}
        <Route path="/kezdolap" element={<Home />} />  {/* Kezdőlap */}
        <Route path="/oterm" element={<Oterm />} /> {/* Összes Termék */}
        <Route path="/signup" element={<SignUp />} />{/* singup oldal */}
        <Route path="/sign" element={<SignIn />} />{/* singup oldal */}
        <Route path="/kosar" element={<Kosar />} />
        <Route path="/add" element={<Add />} />
        <Route path="/vinted" element={<Vinted />} />
        <Route path="/user" element={<User />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/shipping" element={< Shipping />} />
        <Route path="/termek/:id" element={<Termekeink />} />
        <Route path="/tadmin" element={<Tadmin />} />
        <Route path="/termadmin" element={<Termadmin />} />
        <Route path="/fadmin" element={<Fadmin />} />
        <Route path="/fiokom" element={<Fiokom />} />
        

        
      </Routes>
    </Router>
  );
};

export default App;