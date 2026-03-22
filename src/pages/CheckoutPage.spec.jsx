import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from './CheckoutPage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from '../store/paymentSlice';
import { MemoryRouter } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';

jest.mock('../hooks/useCheckout');

const renderComponent = (mockHook = {}) => {
  const store = configureStore({
    reducer: { payment: paymentReducer },
    preloadedState: {
      payment: {
        product: {
          id: 1,
          name: 'iPhone',
          description: 'Test product',
          price: 2100000,
        },
      },
    },
  });

  useCheckout.mockReturnValue({
    form: {
      number: '',
      exp_month: '',
      exp_year: '',
      cvc: '',
      card_holder: '',
    },
    cardType: null,
    acceptedTerms: false,
    acceptedData: false,
    setAcceptedTerms: jest.fn(),
    setAcceptedData: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    ...mockHook,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product info', () => {
    renderComponent();
    expect(screen.getByText('iPhone')).toBeInTheDocument();
    expect(screen.getByText('Test product')).toBeInTheDocument();
  });

  it('renders card input', () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText(/4242 4242 4242 4242/i)
    ).toBeInTheDocument();
  });

  it('calls handleChange when typing card number', () => {
    const handleChange = jest.fn();
    renderComponent({ handleChange });
    const input = screen.getByPlaceholderText(/4242/i);
    fireEvent.change(input, { target: { value: '4242' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows visa icon when cardType is visa', () => {
    renderComponent({ cardType: 'visa' });
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('visa');
  });

  it('shows mastercard icon when cardType is mastercard', () => {
    renderComponent({ cardType: 'mastercard' });
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('mastercard');
  });

  it('calls handleSubmit on button click', () => {
    const handleSubmit = jest.fn();
    renderComponent({ handleSubmit });
    const button = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('toggles terms checkbox', () => {
    const setAcceptedTerms = jest.fn();
    renderComponent({ setAcceptedTerms });
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(setAcceptedTerms).toHaveBeenCalled();
  });

  it('toggles data checkbox', () => {
    const setAcceptedData = jest.fn();
    renderComponent({ setAcceptedData });
    const checkbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(checkbox);
    expect(setAcceptedData).toHaveBeenCalled();
  });
});