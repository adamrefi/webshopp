// src/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './kezdolap.css';


const Home = () => {
  const [sideMenuActive, setSideMenuActive] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuActive(!sideMenuActive);
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="nav-toggle" onClick={toggleSideMenu}>
          &#9776; {/* Hamburger icon */}
        </div>
        <div className="logo">Adali Clothing</div>
        <div className="auth-buttons">
          <Link to="/sign" className="auth-button">Sign In</Link>
          <Link to="/signup" className="auth-button">Sign Up</Link>
        </div>
      </header>

      {/* Side Menu */}
      <div className={`side-menu ${sideMenuActive ? 'active' : ''}`}>
              <div className="close-btn" onClick={toggleSideMenu}>&times;</div>
              <div className="menu-item"><Link to="/">Kezdőlap</Link></div>
              <div className="menu-item"><Link to="/oterm">Termékek</Link></div>
              
              
            </div>


      {/* Hero Section */}
      <section className="hero">
        <h1>Üdvözlünk az Adali Clothing Webáruházban</h1>
        <p>Fedezd fel legújabb kollekciónkat!</p>
        <Link to="/oterm" className="cta-button">Nézd meg az összes terméket</Link>
      </section>
    </div>
  );
};

export default Home;
