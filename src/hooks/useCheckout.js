import { useState } from 'react';
import valid from 'card-validator';
import {
  validateCardNumber,
  validateExpiry,
  validateCVV,
  validateCardHolder,
} from '../services/validatador';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setPaymentData } from '../store/paymentSlice';
import { useNavigate } from 'react-router-dom';

export function useCheckout(product) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const formatCardNumber = (value) =>
    value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'number') {
      value = formatCardNumber(value);
      const cardInfo = valid.number(value);
      setCardType(cardInfo.card?.type || null);
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!validateCardNumber(form.number)) {
      toast.error('Invalid card number');
      return false;
    }

    if (!validateExpiry(`${form.exp_month}/${form.exp_year}`)) {
      toast.error('Invalid expiry date');
      return false;
    }

    if (!validateCVV(form.cvc)) {
      toast.error('Invalid CVV');
      return false;
    }

    if (!validateCardHolder(form.card_holder)) {
      toast.error('Card holder name is invalid');
      return false;
    }

    if (!acceptedTerms) {
      toast.error('You must accept terms and conditions');
      return false;
    }

    if (!acceptedData) {
      toast.error('You must accept data processing');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    dispatch(setPaymentData({ product, form }));
    navigate('/summary');
  };

  return {
    form,
    cardType,
    acceptedTerms,
    acceptedData,
    setAcceptedTerms,
    setAcceptedData,
    handleChange,
    handleSubmit,
  };
}