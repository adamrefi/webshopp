import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './oterm.css';

const Oterm = () => {
  const navigate = useNavigate();  // Hook a navigáláshoz
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(''); // Alapértelmezett kategória
  const [subCategory, setSubCategory] = useState(''); // Alkategória, pl. felsőruha, alsóruha

  // Termékek lekérése
  useEffect(() => {
    const categoryParam = category ? `?cs=${category}` : '';
    const subCategoryParam = subCategory ? `&sub=${subCategory}` : ''; // Alkategória hozzáadása
    fetch(`http://localhost:4000/products${categoryParam}${subCategoryParam}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Hiba a termékek lekérésekor:", error.message);
        setLoading(false);
      });
  }, [category, subCategory]);

  const toggleSideMenu = () => {
    setSideMenuActive(!sideMenuActive);
  };

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);
    setSubCategory(''); // Alkategória törlése kategória váltásakor
    setSideMenuActive(false);
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setSubCategory(subCategoryId);
  };

  const handleResetCategory = () => {
    setCategory('');
    setSubCategory(''); // Alkategória törlése
    setSideMenuActive(false);
  };

  const handleBack = () => {
    if (subCategory) {
      setSubCategory(''); // Ha alkategóriában vagyunk, akkor visszatérünk a kategóriához
    } else if (category) {
      setCategory(''); // Ha kategóriában vagyunk, akkor visszatérünk az összes termékhez
    } else {
      navigate('/'); // Ha nem vagyunk kategóriában, a kezdőlapra navigálunk
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="oterm-header">
        <div className="oterm-nav-toggle" onClick={toggleSideMenu}>
          &#9776;
        </div>
        <div className="oterm-logo">Adali Clothing</div>
      </header>

      {/* Side Menu */}
      <div className={`oterm-side-menu ${sideMenuActive ? 'active' : ''}`}>
        <div className="oterm-close-btn" onClick={toggleSideMenu}>&times;</div>
        <div className="oterm-menu-item"><Link to="/" onClick={handleResetCategory}>Kezdőlap</Link></div>
        <div className="oterm-menu-item"><Link to="/oterm" onClick={handleResetCategory}>Termékek</Link></div>
        <div className="oterm-menu-item"><Link to="#" onClick={() => handleCategoryChange('18')}>Cipők</Link></div>
        <div className="oterm-menu-item"><Link to="#" onClick={() => handleCategoryChange('1')}>Ruhák</Link></div>
      </div>

      {/* Hero Section */}
      <section className="oterm-hero">
        <h1>
          {category === '18'
            ? 'Cipők'
            : category === '1'
            ? 'Ruhák'
            : 'Összes Termékünk'}
        </h1>
      </section>

      {/* Category and Subcategory Buttons */}
      <div className="oterm-category-buttons">
        {category === '1' ? (
          <div>
            <button onClick={handleBack} className="oterm-button">
              Vissza az összes termékhez
            </button>
            <button onClick={() => handleSubCategoryChange('9')} className="oterm-button">
              Póló
            </button>
            {subCategory === '9' && (
              <div>
                <button onClick={() => handleSubCategoryChange('14')} className="oterm-button">
                  Rövidujjú
                </button>
                <button onClick={() => handleSubCategoryChange('15')} className="oterm-button">
                  Hosszúujjú
                </button>
              </div>
            )}
            <button onClick={() => handleSubCategoryChange('13')} className="oterm-button">
              Ruha
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => handleCategoryChange('')} className="oterm-button">
              Összes
            </button>
            <button onClick={() => handleCategoryChange('18')} className="oterm-button">
              Cipők
            </button>
            <button onClick={() => handleCategoryChange('1')} className="oterm-button">
              Ruhák
            </button>
          </div>
        )}
      </div>

      {/* Product List */}
      <main>
        <div className="oterm-product-list">
          {loading ? (
            <p>Termékek betöltése folyamatban...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="oterm-product-item" key={product.azonosito}>
                <h3>{product.nev}</h3>
                <p>{product.termekleiras}</p>
                <div className="oterm-price">{product.ar} Ft</div>
              </div>
            ))
          ) : (
            <p>Nincsenek elérhető termékek.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="oterm-footer">
        <p>&copy; 2024 Adali Clothing - Minden jog fenntartva.</p>
      </footer>
    </div>
  );
};

export default Oterm;
