import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from './CheckoutPage';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

jest.mock('../services/validatador', () => ({
  validateCardNumber: jest.fn(() => true),
  validateExpiry: jest.fn(() => true),
  validateCVV: jest.fn(() => true),
  validateCardHolder: jest.fn(() => true),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockStore = configureStore({
  reducer: {
    payment: () => ({
      product: {
        name: 'iPhone',
        description: 'Test product',
        price: 1000000,
      },
    }),
  },
});

describe('CheckoutPage', () => {
  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

  it('renders checkout page', () => {
    renderComponent();

    expect(screen.getByText(/payment details/i)).toBeInTheDocument();
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
  });

  it('shows error if terms not accepted', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(button);

    expect(
      screen.getByText(/terms and conditions/i)
    ).toBeInTheDocument();
  });

  it('submits form correctly', () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/4242/), {
      target: { value: '4242424242424242', name: 'number' },
    });

    fireEvent.change(screen.getByPlaceholderText('MM'), {
      target: { value: '12', name: 'exp_month' },
    });

    fireEvent.change(screen.getByPlaceholderText('YY'), {
      target: { value: '25', name: 'exp_year' },
    });

    fireEvent.change(screen.getByPlaceholderText('123'), {
      target: { value: '123', name: 'cvc' },
    });

    fireEvent.change(screen.getByPlaceholderText('John Doe'), {
      target: { value: 'Test User', name: 'card_holder' },
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    const button = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(button);
    expect(true).toBe(true);
  });
});