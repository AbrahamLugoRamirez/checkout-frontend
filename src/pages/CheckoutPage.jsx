import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
export default function CheckoutPage() {
  const { state: product } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    card_holder: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedData, setAcceptedData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };



  const handlePay = async () => {
    try {
      setLoading(true);
      if (!form.number || !form.card_holder || !form.cvc || !form.exp_month || !form.exp_year) {
        return setMessage('Falta informacion por llenar');
      }
      if (!acceptedTerms || !acceptedData){
        return setMessage('Debe aceptar terminos y condiciones');
      }

      const data = {
        card: form,
        amount: product.price,
        email: 'test@test.com',
      }
      console.log("data trul", data)
      const res = await api.post('/payments/create', data);

      const transactionId = res.data.data.id;

      pollTransaction(transactionId);

    } catch (error) {
      console.error(error);
      setMessage('Error en el pago');
    } finally {
      setLoading(false);
    }
  };

  const pollTransaction = (transactionId) => {
    let attempts = 0;

    const interval = setInterval(async () => {
      try {
        attempts++;

        const res = await api.get(`/payments/${transactionId}`);
        const status = res.data.data.status;

        console.log('Estado:', status);

        if (status === 'APPROVED') {
          clearInterval(interval);
          navigate(`/result?status=approved&id=${transactionId}`);
        }

        if (status === 'DECLINED') {
          clearInterval(interval);
          navigate(`/result?status=declined&id=${transactionId}`);
        }

  
        if (attempts > 10) {
          clearInterval(interval);
          navigate(`/result?status=timeout&id=${transactionId}`);
        }

      } catch (error) {
        console.error(error);
        clearInterval(interval);
        navigate(`/result?status=error`);
      }
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="card p-4 shadow">
        <h4>{product.name}</h4>
        <p>💰 {product.price}</p>

        <hr />

        <h5>Datos de tarjeta</h5>

        <input
          className="form-control mb-2"
          name="number"
          placeholder="Número de tarjeta"
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="exp_month"
          placeholder="Mes (MM)"
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="exp_year"
          placeholder="Año (YY)"
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="cvc"
          placeholder="CVC"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="card_holder"
          placeholder="Nombre titular"
          onChange={handleChange}
        />

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label className="form-check-label">
            Acepto términos y condiciones
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={(e) => setAcceptedData(e.target.checked)}
          />
          <label className="form-check-label">
            Acepto tratamiento de datos
          </label>
        </div>

        <button
          className="btn btn-success w-100"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Pagar'}
        </button>

        {message && (
          <div className="alert alert-info mt-3">{message}</div>
        )}
      </div>
    </div>
  );
}