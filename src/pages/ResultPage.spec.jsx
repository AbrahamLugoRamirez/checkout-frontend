import { render, screen, fireEvent } from '@testing-library/react';
import ResultPage from './ResultPage';
import { MemoryRouter } from 'react-router-dom';

// 🔹 Mock navigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// 🔹 Helper para render con query params
const renderWithQuery = (status) => {
    return render(
        <MemoryRouter initialEntries={[`/result?status=${status}`]}>
            <ResultPage />
        </MemoryRouter>
    );
};

describe('ResultPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders approved state correctly', () => {
        renderWithQuery('approved');

        expect(screen.getByText('Payment Approved')).toBeInTheDocument();
        expect(
            screen.getByText('Your payment was processed successfully.')
        ).toBeInTheDocument();
        expect(screen.getByText('Approved')).toBeInTheDocument();
    });

    it('renders declined state correctly', () => {
        renderWithQuery('declined');

        expect(screen.getByText('Payment Declined')).toBeInTheDocument();
        expect(
            screen.getByText('Your payment was rejected. Please try another card.')
        ).toBeInTheDocument();
        expect(screen.getByText('Declined')).toBeInTheDocument();
    });

    it('renders timeout state correctly', () => {
        renderWithQuery('timeout');

        const elements = screen.getAllByText('Timeout');
        expect(elements.length).toBe(2);

        expect(
            screen.getByText('The transaction took too long. Please try again.')
        ).toBeInTheDocument();
    });

    it('renders error state correctly', () => {
        renderWithQuery('error');

        expect(screen.getByText('Processing Error')).toBeInTheDocument();
        expect(
            screen.getByText('Something went wrong processing your payment.')
        ).toBeInTheDocument();
        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('navigates back to products on button click', () => {
        renderWithQuery('approved');

        const button = screen.getByText(/back to products/i);
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});