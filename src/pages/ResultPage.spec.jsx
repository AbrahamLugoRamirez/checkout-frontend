import { render, screen, fireEvent } from '@testing-library/react';
import ResultPage from './ResultPage';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


const renderWithStatus = (status) => {
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

  it('renders approved state', () => {
    renderWithStatus('approved');
    expect(screen.getByRole('heading', { name: 'Payment Approved' }))
      .toBeInTheDocument();
    expect(
      screen.getByText('Your payment was processed successfully.')
    ).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders declined state', () => {
    renderWithStatus('declined');
    expect(screen.getByRole('heading', { name: 'Payment Declined' }))
      .toBeInTheDocument();
    expect(
      screen.getByText('Your payment was rejected. Please try another card.')
    ).toBeInTheDocument();
    expect(screen.getByText('Declined')).toBeInTheDocument();
  });

  it('renders timeout state', () => {
    renderWithStatus('timeout');
    expect(screen.getByRole('heading', { name: 'Timeout' }))
      .toBeInTheDocument();
    expect(
      screen.getByText('The transaction took too long. Please try again.')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Timeout').length).toBeGreaterThan(0);
  });

  it('renders error state', () => {
    renderWithStatus('error');
    expect(screen.getByRole('heading', { name: 'Processing Error' }))
      .toBeInTheDocument();
    expect(
      screen.getByText('Something went wrong processing your payment.')
    ).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('navigates back to products on click', () => {
    renderWithStatus('approved');
    fireEvent.click(screen.getByText(/back to products/i));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});