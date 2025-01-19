import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ toggleSideMenu }) {
  return (
    <header className="header">
  
      <div className="logo">Adali Clothing</div>
      <div className="auth-buttons">
        <Link to="/sign" className="auth-button">
          Sign In
        </Link>
        <Link to="/signup" className="auth-button">
          Sign Up
        </Link>
      </div>
    </header>
  );
}
