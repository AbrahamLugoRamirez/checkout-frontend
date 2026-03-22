import { useState } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function usePayment(product, form) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createPayment = async () => {
    setLoading(true);

    try {
      const data = {
        card: {
          ...form,
          number: form.number.replace(/\s+/g, ''),
        },
        amount: product.price,
        email: 'test@test.com',
        productId: product.id,
      };

      const res = await api.post('/payments/create', data);

      const wompiId = res.data.wompi_response.data.id;
      const transactionId = res.data.transaction_id.id;

      pollTransaction(wompiId, transactionId);

    } catch (error) {
      toast.update('', {
        render: 'Payment failed ❌',
        type: 'error',
      });
      setLoading(false);
    }
  };

  const pollTransaction = (wompiId, transactionId) => {
    let attempts = 0;

    const interval = setInterval(async () => {
      try {
        attempts++;

        const res = await api.get(`/payments/${wompiId}`);
        const status = res.data.data.status;

        if (status === 'APPROVED') {
          clearInterval(interval);
          await api.patch(`/transactions/${transactionId}/SUCCESS`);
          navigate(`/result?status=approved&id=${wompiId}`);
        }

        if (status === 'DECLINED') {
          clearInterval(interval);
          await api.patch(`/transactions/${transactionId}/FAILED`);
          navigate(`/result?status=declined&id=${wompiId}`);
        }

        if (attempts > 10) {
          clearInterval(interval);
          navigate(`/result?status=timeout&id=${wompiId}`);
        }

      } catch (error) {
        clearInterval(interval);
        await api.patch(`/transactions/${transactionId}/FAILED`);
        navigate(`/result?status=error&id=${wompiId}`);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  return {
    loading,
    createPayment,
  };
}