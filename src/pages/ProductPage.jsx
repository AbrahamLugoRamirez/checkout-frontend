import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Products</h1>

      <div className="row">
        {products.map(p => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card shadow">
              <div className="card-body text-center">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">💰 {p.price}</p>
                <p className="card-text">Stock: {p.stock}</p>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/checkout', { state: p })}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}