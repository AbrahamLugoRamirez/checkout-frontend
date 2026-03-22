import { renderHook, act } from '@testing-library/react';
import { usePayment } from './usePayment';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

jest.mock('../services/api', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    update: jest.fn(),
  },
}));

describe('usePayment', () => {
  const mockNavigate = jest.fn();

  const product = {
    id: 1,
    price: 50000,
  };

  const form = {
    number: '4242 4242 4242 4242',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    jest.spyOn(global, 'setInterval').mockImplementation((cb) => {
      cb();
      return 1;
    });

    jest.spyOn(global, 'clearInterval').mockImplementation(() => {});
  });

  it('creates payment successfully and handles APPROVED', async () => {
    api.post.mockResolvedValue({
      data: {
        wompi_response: { data: { id: 'wompi123' } },
        transaction_id: { id: 1 },
      },
    });
    api.get.mockResolvedValue({
      data: { data: { status: 'APPROVED' } },
    });
    api.patch.mockResolvedValue({});

    const { result } = renderHook(() =>
      usePayment(product, form)
    );
    await act(async () => {
      await result.current.createPayment();
    });

    expect(api.post).toHaveBeenCalledWith(
      '/payments/create',
      expect.objectContaining({
        amount: 50000,
        productId: 1,
      })
    );
    expect(api.patch).toHaveBeenCalledWith(
      '/transactions/1/SUCCESS'
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      '/result?status=approved&id=wompi123'
    );
  });

  it('handles DECLINED flow', async () => {
    api.post.mockResolvedValue({
      data: {
        wompi_response: { data: { id: 'wompi123' } },
        transaction_id: { id: 1 },
      },
    });
    api.get.mockResolvedValue({
      data: { data: { status: 'DECLINED' } },
    });
    api.patch.mockResolvedValue({});
    const { result } = renderHook(() =>
      usePayment(product, form)
    );

    await act(async () => {
      await result.current.createPayment();
    });
    expect(api.patch).toHaveBeenCalledWith(
      '/transactions/1/FAILED'
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      '/result?status=declined&id=wompi123'
    );
  });

  it('handles timeout after max attempts', async () => {
    api.post.mockResolvedValue({
      data: {
        wompi_response: { data: { id: 'wompi123' } },
        transaction_id: { id: 1 },
      },
    });

    api.get.mockResolvedValue({
      data: { data: { status: 'PENDING' } },
    });
    const { result } = renderHook(() =>
      usePayment(product, form)
    );
    let callback;
    global.setInterval.mockImplementation((cb) => {
      callback = cb;
      return 1;
    });

    await act(async () => {
      await result.current.createPayment();
    });
    for (let i = 0; i < 11; i++) {
      await act(async () => {
        await callback();
      });
    }
    expect(mockNavigate).toHaveBeenCalledWith(
      '/result?status=timeout&id=wompi123'
    );
  });

  it('handles API error', async () => {
    api.post.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() =>
      usePayment(product, form)
    );
    await act(async () => {
      await result.current.createPayment();
    });
    expect(toast.update).toHaveBeenCalled();
  });

  it('handles polling error', async () => {
    api.post.mockResolvedValue({
      data: {
        wompi_response: { data: { id: 'wompi123' } },
        transaction_id: { id: 1 },
      },
    });
    api.get.mockRejectedValue(new Error('fail'));
    api.patch.mockResolvedValue({});
    const { result } = renderHook(() =>
      usePayment(product, form)
    );
    await act(async () => {
      await result.current.createPayment();
    });
    expect(api.patch).toHaveBeenCalledWith(
      '/transactions/1/FAILED'
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      '/result?status=error&id=wompi123'
    );
  });
});