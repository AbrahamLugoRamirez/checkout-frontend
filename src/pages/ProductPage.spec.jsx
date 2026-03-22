import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductPage from './ProductPage';
import { api } from '../services/api';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from '../store/paymentSlice';
import { MemoryRouter } from 'react-router-dom';

// 🔹 Mocks
jest.mock('../services/api');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 🔹 Helper para render
const renderComponent = () => {
  const store = configureStore({
    reducer: {
      payment: paymentReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('ProductPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title', () => {
    api.get.mockResolvedValue({ data: [] });

    renderComponent();

    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });

  it('calls API on mount', async () => {
    api.get.mockResolvedValue({ data: [] });

    renderComponent();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/products');
    });
  });

  it('renders products from API', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Desc',
        price: 50000,
        stock: 5,
      },
    ];

    api.get.mockResolvedValue({ data: mockProducts });

    renderComponent();

    expect(await screen.findByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('filters out products with stock 0', async () => {
    const mockProducts = [
      { id: 1, name: 'Available', description: '', price: 1000, stock: 3 },
      { id: 2, name: 'No stock', description: '', price: 2000, stock: 0 },
    ];

    api.get.mockResolvedValue({ data: mockProducts });

    renderComponent();

    expect(await screen.findByText('Available')).toBeInTheDocument();
    expect(screen.queryByText('No stock')).not.toBeInTheDocument();
  });

  it('formats price correctly', async () => {
    const mockProducts = [
      { id: 1, name: 'Product', description: '', price: 50000, stock: 1 },
    ];

    api.get.mockResolvedValue({ data: mockProducts });

    renderComponent();

    expect(await screen.findByText(/\$50.000/)).toBeInTheDocument();
  });

  it('dispatches product and navigates on click', async () => {
    const mockProducts = [
      { id: 1, name: 'Product', description: '', price: 50000, stock: 1 },
    ];

    api.get.mockResolvedValue({ data: mockProducts });

    const store = configureStore({
      reducer: {
        payment: paymentReducer,
      },
    });

    const spy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductPage />
        </MemoryRouter>
      </Provider>
    );

    const button = await screen.findByText(/pay with card/i);

    fireEvent.click(button);

    expect(spy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});