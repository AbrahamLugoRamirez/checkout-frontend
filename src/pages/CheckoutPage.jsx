import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import valid from 'card-validator';
import { validateCardNumber, validateExpiry, validateCVV, validateCardHolder } from '../services/validatador';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setPaymentData, loadFromStorage } from '../store/paymentSlice';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const product = useSelector((state) => state.payment.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadFromStorage());
  }, []);

  const [form, setForm] = useState({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    card_holder: '',
  });

  const [cardType, setCardType] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedData, setAcceptedData] = useState(false);

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'number') {
      value = formatCardNumber(value);

      const cardInfo = valid.number(value);
      setCardType(cardInfo.card?.type || null);
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateCardNumber(form.number)) {
      toast.error('Invalid card number');
      return;
    }

    if (!validateExpiry(`${form.exp_month}/${form.exp_year}`)) {
      toast.error('Invalid expiry date');
      return;
    }

    if (!validateCVV(form.cvc)) {
      toast.error('Invalid CVV');
      return;
    }

    if (!validateCardHolder(form.card_holder)) {
      toast.error('Card holder name is invalid');
      return;
    }

    if (!acceptedTerms) {
      toast.error('You must accept terms and conditions');
      return;
    }

    if (!acceptedData) {
      toast.error('You must accept data processing');
      return;
    }
    dispatch(setPaymentData({ product, form }));
    navigate('/summary');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

            {/* HEADER visual */}
            <div className="bg-primary text-white p-3">
              <small className="opacity-75">Order Summary</small>
              <h5 className="mb-0">{product?.name}</h5>
            </div>

            <div className="card-body">

              {/* Descripción */}
              <p className="text-muted small mb-3">
                {product?.description}
              </p>

              {/* Precio grande */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Price</span>
                <span className="fw-bold fs-4">
                  ${new Intl.NumberFormat('es-CO').format(product?.price)}
                </span>
              </div>

              {/* Divider bonito */}
              <div className="my-3" style={{ borderTop: '1px dashed #ddd' }} />

              {/* Total */}
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Total</span>
                <span className="fw-bold fs-5 text-primary">
                  ${new Intl.NumberFormat('es-CO').format(product?.price)}
                </span>
              </div>

            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4">

              <h4 className="mb-4">Payment Details</h4>
              <div className="mb-3 position-relative">
                <label className="form-label">Card Number</label>
                <input
                  className="form-control pe-5"
                  name="number"
                  placeholder="4242 4242 4242 4242"
                  value={form.number}
                  onChange={handleChange}
                />
                <div style={{
                  position: 'absolute',
                  right: 10,
                  top: 38
                }}>
                  {cardType === 'visa' && (
                    <img src="https://img.icons8.com/color/48/visa.png" width="35" />
                  )}
                  {cardType === 'mastercard' && (
                    <img src="https://img.icons8.com/color/48/mastercard-logo.png" width="35" />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <label className="form-label">Month</label>
                  <input
                    className="form-control"
                    name="exp_month"
                    placeholder="MM"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-4">
                  <label className="form-label">Year</label>
                  <input
                    className="form-control"
                    name="exp_year"
                    placeholder="YY"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-4">
                  <label className="form-label">CVV</label>
                  <input
                    className="form-control"
                    name="cvc"
                    placeholder="123"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-3">
                <input
                  className="form-control"
                  name="card_holder"
                  placeholder="John Doe"
                  onChange={handleChange}
                />
              </div>
              <div className="form-check mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <label className="form-check-label small">
                  I accept the terms and conditions
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={(e) => setAcceptedData(e.target.checked)}
                />
                <label className="form-check-label small">
                  I accept data processing
                </label>
              </div>
              <button
                className="btn btn-success w-100 py-2 fw-semibold shadow-sm"
                onClick={handleSubmit}
              >
                Pay ${new Intl.NumberFormat('es-CO').format(product?.price)}
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}