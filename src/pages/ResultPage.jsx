import { useLocation, useNavigate } from 'react-router-dom';


export default function ResultPage() {
  const query = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();
  const status = query.get('status');

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="col-md-6">
        <div className="card border-0 shadow-lg rounded-4 text-center p-4">
          <div className="mb-3">
            {status === 'approved' && <h1>✅</h1>}
            {status === 'declined' && <h1>❌</h1>}
            {status === 'timeout' && <h1>⏳</h1>}
            {status === 'error' && <h1>⚠️</h1>}
          </div>
          <h3 className="mb-3">
            {status === 'approved' && 'Payment Approved'}
            {status === 'declined' && 'Payment Declined'}
            {status === 'timeout' && 'Timeout'}
            {status === 'error' && 'Processing Error'}
          </h3>
          <p className="text-muted mb-4">
            {status === 'approved' && 'Your payment was processed successfully.'}
            {status === 'declined' && 'Your payment was rejected. Please try another card.'}
            {status === 'timeout' && 'The transaction took too long. Please try again.'}
            {status === 'error' && 'Something went wrong processing your payment.'}
          </p>
          <div className="mb-4">
            {status === 'approved' && (
              <span className="badge bg-success px-3 py-2">Approved</span>
            )}
            {status === 'declined' && (
              <span className="badge bg-danger px-3 py-2">Declined</span>
            )}
            {status === 'timeout' && (
              <span className="badge bg-warning text-dark px-3 py-2">Timeout</span>
            )}
            {status === 'error' && (
              <span className="badge bg-secondary px-3 py-2">Error</span>
            )}
          </div>
          <button
            className="btn btn-primary w-100 py-2 fw-semibold"
            onClick={() => navigate('/')}
          >
            Back to Products
          </button>

        </div>
      </div>
    </div>
  );
}