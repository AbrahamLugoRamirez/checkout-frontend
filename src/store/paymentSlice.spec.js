import reducer, {
  setPaymentData,
  setTransactionId,
  loadFromStorage,
  clearPayment,
} from './paymentSlice';

describe('paymentSlice', () => {
  const initialState = {
    product: null,
    form: null,
    transactionId: null,
  };
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('sets payment data and saves to localStorage', () => {
    const action = setPaymentData({
      product: { id: 1, name: 'Product' },
      form: { number: '1234' },
    });
    const newState = reducer(initialState, action);
    expect(newState.product).toEqual({ id: 1, name: 'Product' });
    expect(newState.form).toEqual({ number: '1234' });
    const stored = JSON.parse(localStorage.getItem('payment'));
    expect(stored).toEqual({
      product: { id: 1, name: 'Product' },
      form: { number: '1234' },
    });
  });

  it('sets transactionId', () => {
    const action = setTransactionId(123);
    const newState = reducer(initialState, action);
    expect(newState.transactionId).toBe(123);
  });

  it('loads data from localStorage', () => {
    localStorage.setItem(
      'payment',
      JSON.stringify({
        product: { id: 1 },
        form: { number: '4242' },
      })
    );
    const newState = reducer(initialState, loadFromStorage());
    expect(newState.product).toEqual({ id: 1 });
    expect(newState.form).toEqual({ number: '4242' });
  });

  it('does nothing if localStorage is empty', () => {
    const newState = reducer(initialState, loadFromStorage());
    expect(newState).toEqual(initialState);
  });

  it('clears payment and removes from localStorage', () => {
    localStorage.setItem(
      'payment',
      JSON.stringify({
        product: { id: 1 },
        form: { number: '4242' },
      })
    );

    const stateWithData = {
      product: { id: 1 },
      form: { number: '4242' },
      transactionId: 10,
    };
    const newState = reducer(stateWithData, clearPayment());
    expect(newState).toEqual(initialState);
    expect(localStorage.getItem('payment')).toBeNull();
  });
});