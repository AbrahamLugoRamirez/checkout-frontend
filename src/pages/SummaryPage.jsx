import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import valid from 'card-validator';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPaymentData, loadFromStorage } from '../store/paymentSlice';
import { useState } from 'react';
import { createPortal } from 'react-dom';
const Summary = () => {
    const navigate = useNavigate();
    const { product, form } = useSelector((state) => state.payment);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!product) {
            dispatch(loadFromStorage());
        }
    }, [product]);

    if (!product) {
        return <p>Loading...</p>;
    }

    const cardInfo = valid.number(form?.number);
    const cardType = cardInfo.card?.type;

    const handlePay = async () => {
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
            }

            const res = await api.post('/payments/create', data);

            console.log('Respuesta del servidor:', res.data, res.data.wompi_response.data);
            const wompi_response = res.data.wompi_response.data.id;
            const transactionId = res.data.transaction_id.id;
            pollTransaction(wompi_response, transactionId);

        } catch (error) {
            console.error(error);
            toast.update('', {
                position: "bottom-center",
                render: 'Payment failed ❌',
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            });
            setLoading(false);
        }
    };

    const pollTransaction = (wompi_response, productId) => {
        let attempts = 0;

        const interval = setInterval(async () => {
            try {
                attempts++;

                const res = await api.get(`/payments/${wompi_response}`);
                const status = res.data.data.status;

                if (status === 'APPROVED') {
                    clearInterval(interval);
                    await api.patch(`/transactions/${productId}/SUCCESS`);
                    navigate(`/result?status=approved&id=${wompi_response}`);
                }

                if (status === 'DECLINED') {
                    clearInterval(interval);
                    await api.patch(`/transactions/${productId}/FAILED`);
                    navigate(`/result?status=declined&id=${wompi_response}`);
                }


                if (attempts > 10) {
                    clearInterval(interval);
                    navigate(`/result?status=timeout&id=${wompi_response}`);
                }

            } catch (error) {
                console.error(error);
                clearInterval(interval);
                await api.patch(`/transactions/${productId}/FAILED`);
                navigate(`/result?status=error&id=${wompi_response}`);
            } finally {
                setLoading(false);
            }
        }, 3000);
    };

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
                                onClick={handlePay}
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