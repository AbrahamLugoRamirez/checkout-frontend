import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import { api } from '../services/api';

jest.mock('../services/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and returns products', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, name: 'A', stock: 2 },
        { id: 2, name: 'B', stock: 1 },
      ],
    });

    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.products.length).toBe(2);
  });

  it('filters products with stock > 0', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, name: 'A', stock: 2 },
        { id: 2, name: 'B', stock: 0 },
      ],
    });
    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.products).toEqual([
      { id: 1, name: 'A', stock: 2 },
    ]);
  });

  it('handles API error', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    api.get.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useProducts());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('sets loading correctly', async () => {
    api.get.mockResolvedValue({ data: [] });
    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});