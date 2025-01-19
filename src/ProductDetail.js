import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams(); // Termék azonosítója
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(true); // Betöltés állapot

  // Termék adatainak lekérése az adatbázisból
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/product/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Hiba a termék adatainak lekérésekor:', error.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!size || !color) {
      alert('Kérlek válassz méretet és színt!');
      return;
    }
    console.log('Termék hozzáadva a kosárhoz:', { product, size, color, quantity });
    // Itt tudod később a kosárba rakást kezelni
  };

  if (loading) {
    return <p>Termék betöltése folyamatban...</p>;
  }

  return (
    <div className="product-detail">
      {product ? (
        <div className="product-info">
          <h1>{product.nev}</h1>
          <p>{product.termekleiras}</p>
          <div className="product-price">{product.ar} Ft</div>

          {/* Kiválasztás: Méret */}
          <div>
            <label>Válassz méretet:</label>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">-- Válassz --</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          {/* Kiválasztás: Szín */}
          <div>
            <label>Válassz színt:</label>
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">-- Válassz --</option>
              <option value="fehér">Fehér</option>
              <option value="fekete">Fekete</option>
              <option value="szürke">Szürke</option>
            </select>
          </div>

          {/* Mennyiség */}
          <div>
            <label>Mennyiség:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              min="1"
            />
          </div>

          {/* Kosárba rakás gomb */}
          <button onClick={handleAddToCart}>Kosárba rakom</button>
        </div>
      ) : (
        <p>Nem található ilyen termék.</p>
      )}
    </div>
  );
};

export default ProductDetail;
