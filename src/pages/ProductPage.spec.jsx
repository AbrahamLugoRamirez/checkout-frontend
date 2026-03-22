import { render, screen, fireEvent } from '@testing-library/react';
import ProductPage from './ProductPage';
import { useProducts } from '../hooks/useProducts';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from '../store/paymentSlice';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../hooks/useProducts');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


const renderComponent = (mockHook = {}) => {
  const store = configureStore({
    reducer: { payment: paymentReducer },
    preloadedState: {
      payment: {},
    },
  });

  useProducts.mockReturnValue({
    products: [],
    loading: false,
    ...mockHook,
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

  it('shows loading state', () => {
    renderComponent({ loading: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders products', () => {
    renderComponent({
      products: [
        {
          id: 1,
          name: 'iPhone',
          description: 'Test product',
          price: 2100000,
          stock: 5,
        },
      ],
    });

    expect(screen.getByText('iPhone')).toBeInTheDocument();
    expect(screen.getByText('Test product')).toBeInTheDocument();
  });

  it('formats price correctly', () => {
    renderComponent({
      products: [
        {
          id: 1,
          name: 'iPhone',
          description: 'Test',
          price: 2100000,
          stock: 5,
        },
      ],
    });
    expect(screen.getByText(/\$2\.100\.000/)).toBeInTheDocument();
  });

  it('filters and shows stock', () => {
    renderComponent({
      products: [
        {
          id: 1,
          name: 'iPhone',
          description: '',
          price: 1000,
          stock: 3,
        },
      ],
    });

    expect(screen.getByText(/in stock: 3/i)).toBeInTheDocument();
  });

  it('dispatches and navigates on click', () => {
    renderComponent({
      products: [
        {
          id: 1,
          name: 'iPhone',
          description: '',
          price: 1000,
          stock: 3,
        },
      ],
    });
    const button = screen.getByText(/pay with card/i);
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('renders multiple products', () => {
    renderComponent({
      products: [
        { id: 1, name: 'A', description: '', price: 1, stock: 1 },
        { id: 2, name: 'B', description: '', price: 2, stock: 2 },
      ],
    });
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});