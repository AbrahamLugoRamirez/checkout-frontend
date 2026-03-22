import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPaymentData } from '../store/paymentSlice';
import { useProducts } from '../hooks/useProducts';

export default function ProductPage() {
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectProduct = (product) => {
    dispatch(setPaymentData({ product }));
    navigate('/checkout');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fw-bold">Products</h1>

      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-semibold">{p.name}</h5>

                <p className="text-muted small flex-grow-1">
                  {p.description}
                </p>

                <h4 className="fw-bold mb-2">
                  ${new Intl.NumberFormat('es-CO').format(p.price)}
                </h4>

                <span className="badge bg-success mb-3">
                  In stock: {p.stock}
                </span>

                <button
                  className="btn btn-primary w-100 mt-auto fw-semibold"
                  onClick={() => handleSelectProduct(p)}
                >
                  Pay with card
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}