import React, { useState, useEffect } from 'react';
import './kategoria.css';
const ProductCategory = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(12); // Kezdetben a cipők kategória
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Kategóriák: Cipők, Ruhák, Kiegészítők
    const categories = [
        { id: 12, name: 'Cipők' },
        { id: 13, name: 'Ruhák' },
        { id: 16, name: 'Kiegészítők' },
        { id: 0, name: 'Összes Termék' } // Az összes termék gomb
    ];

    // Termékek lekérése a kiválasztott kategóriához
    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost/react2/src/get_products.php?cs=${category}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                setError('Hiba történt a termékek betöltésekor');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [category]);

    return (
        <div className="container">
            <div className="row">
                {/* Kategóriák listája középre igazítva */}
                <div className="col-12 text-center">
                    <div className="btn-group" role="group" aria-label="Kategóriák">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`btn btn-${category === cat.id ? 'primary' : 'secondary'}`}
                                onClick={() => setCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Termékek listája */}
                <div className="col-12 mt-4">
                    {isLoading && <p>Betöltés...</p>}
                    {error && <p>{error}</p>}
                    <div className="row">
                        {products.map(product => (
                            <div key={product.id} className="col-md-4">
                                <div className="card">
                                    <img src={product.image} alt={product.name} className="card-img-top" />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description}</p>
                                        <p className="card-text"><strong>{product.price} Ft</strong></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCategory;
