import { render, screen, fireEvent } from '@testing-library/react';
import Summary from './SummaryPage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from '../store/paymentSlice';
import { MemoryRouter } from 'react-router-dom';
import { usePayment } from '../hooks/usePayment';
import valid from 'card-validator';

jest.mock('../hooks/usePayment');

beforeEach(() => {
  jest.clearAllMocks();

  valid.number.mockReturnValue({
    card: null,
  });
});


jest.mock('card-validator', () => ({
  number: jest.fn(),
}));


const renderComponent = (mockHook = {}, stateOverride = {}) => {
  const store = configureStore({
    reducer: { payment: paymentReducer },
    preloadedState: {
      payment: {
        product: {
          id: 1,
          name: 'iPhone',
          description: 'Test product',
          price: 50000,
        },
        form: {
          number: '4242 4242 4242 4242',
          card_holder: 'John Doe',
          exp_month: '12',
          exp_year: '28',
        },
        ...stateOverride,
      },
    },
  });

  usePayment.mockReturnValue({
    loading: false,
    createPayment: jest.fn(),
    ...mockHook,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Summary />
      </MemoryRouter>
    </Provider>
  );
};

describe('Summary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading when no product', () => {
    renderComponent({}, { product: null });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders product info', () => {
    renderComponent();
    expect(screen.getByText('iPhone')).toBeInTheDocument();
    expect(screen.getByText('Test product')).toBeInTheDocument();
    expect(screen.getAllByText('$50000.00').length).toBeGreaterThan(0);
  });

  it('renders masked card number', () => {
    renderComponent();
    expect(screen.getByText(/4242$/)).toBeInTheDocument();
  });

  it('shows visa icon', () => {
    valid.number.mockReturnValue({
      card: { type: 'visa' },
    });
    renderComponent();
    const img = screen.getByRole('img');
    expect(img.src).toContain('visa');
  });

  it('shows mastercard icon', () => {
    valid.number.mockReturnValue({
      card: { type: 'mastercard' },
    });
    renderComponent();
    const img = screen.getByRole('img');
    expect(img.src).toContain('mastercard');
  });

  it('calls createPayment on button click', () => {
    const createPayment = jest.fn();
    renderComponent({ createPayment });
    fireEvent.click(screen.getByText(/pay now/i));
    expect(createPayment).toHaveBeenCalled();
  });

  it('shows loading overlay when loading is true', () => {
    renderComponent({ loading: true });
    expect(
      screen.getByText(/processing payment/i)
    ).toBeInTheDocument();
  });
});