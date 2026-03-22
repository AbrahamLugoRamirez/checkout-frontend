import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Summary from './SummaryPage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from '../store/paymentSlice';
import { MemoryRouter } from 'react-router-dom';
import { api } from '../services/api';

jest.mock('../services/api');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('react-toastify', () => ({
    toast: {
        update: jest.fn(),
    },
}));

jest.mock('card-validator', () => ({
    number: () => ({
        card: { type: 'visa' },
    }),
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval').mockImplementation((cb) => {
        cb();
        return 1;
    });
    jest.spyOn(global, 'clearInterval').mockImplementation(() => { });
});

const createTestStore = (initialState) =>
    configureStore({
        reducer: { payment: paymentReducer },
        preloadedState: { payment: initialState },
    });

const renderComponent = (state) => {
    const store = createTestStore(state);

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
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const baseState = {
        product: {
            id: 1,
            name: 'Product 1',
            description: 'Test product',
            price: 50000,
        },
        form: {
            number: '4242 4242 4242 4242',
            card_holder: 'Test User',
            exp_month: '12',
            exp_year: '28',
            cvc: '123',
        },
    };

    it('renders product info', () => {
        renderComponent(baseState);
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test product')).toBeInTheDocument();
    });

    it('shows loading if no product', () => {
        renderComponent({ product: null, form: {} });
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('calls payment API on click', async () => {
        api.post.mockResolvedValue({
            data: {
                wompi_response: { data: { id: 'wompi123' } },
                transaction_id: { id: 1 },
            },
        });
        api.get.mockResolvedValue({
            data: { data: { status: 'APPROVED' } },
        });
        renderComponent(baseState);
        fireEvent.click(screen.getByText(/pay now/i));
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                '/payments/create',
                expect.objectContaining({
                    amount: 50000,
                    productId: 1,
                })
            );
        });
    });

    it('handles APPROVED flow', async () => {
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
        renderComponent(baseState);
        fireEvent.click(screen.getByText(/pay now/i));
        jest.advanceTimersByTime(3000);
        await Promise.resolve();
        await waitFor(() => {
            expect(api.patch).toHaveBeenCalledWith(
                '/transactions/1/SUCCESS'
            );

            expect(mockNavigate).toHaveBeenCalledWith(
                '/result?status=approved&id=wompi123'
            );
        });
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
        renderComponent(baseState);
        fireEvent.click(screen.getByText(/pay now/i));

        jest.runOnlyPendingTimers();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(api.patch).toHaveBeenCalledWith(
                '/transactions/1/FAILED'
            );
        });
        expect(mockNavigate).toHaveBeenCalledWith(
            '/result?status=declined&id=wompi123'
        );
    });

    it('handles API error', async () => {
        api.post.mockRejectedValue(new Error('fail'));
        renderComponent(baseState);
        fireEvent.click(screen.getByText(/pay now/i));
        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
    });
});