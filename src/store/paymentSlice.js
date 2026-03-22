import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  product: null,
  form: null,
  transactionId: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentData: (state, action) => {
      state.product = action.payload.product;
      state.form = action.payload.form;

      localStorage.setItem(
        'payment',
        JSON.stringify({
          product: state.product,
          form: state.form,
        })
      );
    },

    setTransactionId: (state, action) => {
      state.transactionId = action.payload;
    },

    loadFromStorage: (state) => {
      const data = localStorage.getItem('payment');
      if (data) {
        const parsed = JSON.parse(data);
        state.product = parsed.product;
        state.form = parsed.form;
      }
    },

    clearPayment: (state) => {
      state.product = null;
      state.form = null;
      state.transactionId = null;
      localStorage.removeItem('payment');
    },
  },
});

export const {
  setPaymentData,
  setTransactionId,
  loadFromStorage,
  clearPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;