import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadFromStorage } from '../store/paymentSlice';
import valid from 'card-validator';
import { createPortal } from 'react-dom';
import { usePayment } from '../hooks/usePayment';

const Summary = () => {
  const { product, form } = useSelector((state) => state.payment);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!product) {
      dispatch(loadFromStorage());
    }
  }, [product]);

  if (!product) return <p>Loading...</p>;

  const cardType = valid.number(form?.number).card?.type;

  const { loading, createPayment } = usePayment(product, form);

  return (<>
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4">
                            <h3 className="mb-4">Order Summary</h3>
                            <div className="mb-3">
                                <small className="text-muted">Product</small>
                                <h5 className="mb-0">{product.name}</h5>
                                <p className="text-muted mb-1">{product.description}</p>
                                <h4 className="fw-bold">${product.price.toFixed(2)}</h4>
                            </div>
                            <hr />
                            <div className="mb-3">
                                <small className="text-muted">Payment Method</small>

                                <div className="d-flex justify-content-between align-items-center border rounded-3 p-3 mt-2">
                                    <div>
                                        <div className="fw-semibold">
                                            **** **** **** {form?.number.slice(-4)}
                                        </div>
                                        <small className="text-muted">
                                            {form.card_holder} · {form.exp_month}/{form.exp_year}
                                        </small>
                                    </div>

                                    <div>
                                        {cardType === 'visa' && (
                                            <img src="https://img.icons8.com/color/48/visa.png" width="45" />
                                        )}
                                        {cardType === 'mastercard' && (
                                            <img src="https://img.icons8.com/color/48/mastercard-logo.png" width="45" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-4 mb-3">
                                <span className="fw-semibold">Total</span>
                                <span className="fw-bold fs-5">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>
                            <button
                                className="btn btn-primary w-100 py-2 fw-semibold"
                                onClick={createPayment}
                            >
        Pay Now
      </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      {loading &&
        createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999999,
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: '30px 40px',
                            borderRadius: '16px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                            textAlign: 'center',
                        }}
                    >
                        <div className="spinner-border text-primary mb-3" />
                        <h5>Processing payment</h5>
                        <small>Please do not close this window</small>
                    </div>
                </div>,
          document.body
            )
        }</>
  );
};

export default Summary;