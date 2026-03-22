import {
  validateCardNumber,
  validateExpiry,
  validateCVV,
  validateCardHolder,
} from './validatador';

describe('validateCardNumber', () => {
  it('valid card number (Luhn)', () => {
    expect(validateCardNumber('4242 4242 4242 4242')).toBe(true);
  });
  it('invalid card number', () => {
    expect(validateCardNumber('1234 5678 9012 3456')).toBe(false);
  });
  it('rejects non-numeric values', () => {
    expect(validateCardNumber('abcd efgh')).toBe(false);
  });
  it('handles empty string', () => {
    expect(validateCardNumber('')).toBe(false);
  });
});

describe('validateExpiry', () => {
  it('valid future date', () => {
    const future = new Date();
    future.setMonth(future.getMonth() + 1);

    const month = String(future.getMonth() + 1).padStart(2, '0');
    const year = String(future.getFullYear() % 100);

    expect(validateExpiry(`${month}/${year}`)).toBe(true);
  });
  it('invalid format', () => {
    expect(validateExpiry('2025-12')).toBe(false);
  });
  it('invalid month', () => {
    expect(validateExpiry('13/30')).toBe(false);
  });
  it('past year', () => {
    expect(validateExpiry('01/20')).toBe(false);
  });
  it('past month in current year', () => {
    const now = new Date();
    const month = String(Math.max(1, now.getMonth())).padStart(2, '0');
    const year = String(now.getFullYear() % 100);

    expect(validateExpiry(`${month}/${year}`)).toBe(false);
  });
});

describe('validateCVV', () => {
  it('valid CVV', () => {
    expect(validateCVV('123')).toBe(true);
  });
  it('invalid CVV (too short)', () => {
    expect(validateCVV('12')).toBe(false);
  });
  it('invalid CVV (letters)', () => {
    expect(validateCVV('abc')).toBe(false);
  });
  it('invalid CVV (too long)', () => {
    expect(validateCVV('1234')).toBe(false);
  });
});

describe('validateCardHolder', () => {
  it('valid name', () => {
    expect(validateCardHolder('John Doe')).toBe(true);
  });
  it('invalid short name', () => {
    expect(validateCardHolder('Ana')).toBe(false);
  });
  it('invalid non-string', () => {
    expect(validateCardHolder(123)).toBe(false);
  });
  it('invalid empty string', () => {
    expect(validateCardHolder('')).toBe(false);
  });
});