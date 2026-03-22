import { renderHook, act } from '@testing-library/react';
import { useCheckout } from './useCheckout';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import valid from 'card-validator';


jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../services/validatador', () => ({
  validateCardNumber: jest.fn(),
  validateExpiry: jest.fn(),
  validateCVV: jest.fn(),
  validateCardHolder: jest.fn(),
}));

jest.mock('card-validator', () => ({
  __esModule: true,
  default: {
    number: jest.fn(),
  },
}));

import {
  validateCardNumber,
  validateExpiry,
  validateCVV,
  validateCardHolder,
} from '../services/validatador';

describe('useCheckout', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  const product = {
    id: 1,
    price: 50000,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);

    valid.number.mockReturnValue({
      card: { type: 'visa' },
    });
  });

  it('formats card number and sets card type', () => {
    const { result } = renderHook(() => useCheckout(product));

    act(() => {
      result.current.handleChange({
        target: { name: 'number', value: '4242424242424242' },
      });
    });

    expect(result.current.form.number).toBe('4242 4242 4242 4242');
    expect(result.current.cardType).toBe('visa');
  });

  it('updates form fields', () => {
    const { result } = renderHook(() => useCheckout(product));

    act(() => {
      result.current.handleChange({
        target: { name: 'cvc', value: '123' },
      });
    });

    expect(result.current.form.cvc).toBe('123');
  });

  it('shows error if card number invalid', () => {
    validateCardNumber.mockReturnValue(false);

    const { result } = renderHook(() => useCheckout(product));

    act(() => {
      result.current.handleSubmit();
    });

    expect(toast.error).toHaveBeenCalledWith('Invalid card number');
  });

  it('shows error if expiry invalid', () => {
    validateCardNumber.mockReturnValue(true);
    validateExpiry.mockReturnValue(false);

    const { result } = renderHook(() => useCheckout(product));

    act(() => {
      result.current.handleSubmit();
    });

    expect(toast.error).toHaveBeenCalledWith('Invalid expiry date');
  });

  it('shows error if CVV invalid', () => {
    validateCardNumber.mockReturnValue(true);
    validateExpiry.mockReturnValue(true);
    validateCVV.mockReturnValue(false);

    const { result } = renderHook(() => useCheckout(product));

    act(() => {
      result.current.handleSubmit();
    });

    expect(toast.error).toHaveBeenCalledWith('Invalid CVV');
  });

  it('shows error if card holder invalid', () => {
    validateCardNumber.mockReturnValue(true);
    validateExpiry.mockReturnValue(true);
    validateCVV.mockReturnValue(true);
    validateCardHolder.mockReturnValue(false);

    const { result } = renderHook(() => useCheckout(product));

    act(() => {
      result.current.handleSubmit();
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Card holder name is invalid'
    );
  });

  it('shows error if terms not accepted', () => {
    validateCardNumber.mockReturnValue(true);
    validateExpiry.mockReturnValue(true);
    validateCVV.mockReturnValue(true);
    validateCardHolder.mockReturnValue(true);

    const { result } = renderHook(() => useCheckout(product));

    act(() => {
      result.current.handleSubmit();
    });

    expect(toast.error).toHaveBeenCalledWith(
      'You must accept terms and conditions'
    );
  });

  it('submits successfully', () => {
    validateCardNumber.mockReturnValue(true);
    validateExpiry.mockReturnValue(true);
    validateCVV.mockReturnValue(true);
    validateCardHolder.mockReturnValue(true);

    const { result } = renderHook(() => useCheckout(product));
    act(() => {
      result.current.setAcceptedTerms(true);
      result.current.setAcceptedData(true);
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/summary');
  });
});