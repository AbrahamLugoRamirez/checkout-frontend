export const validateCardNumber = (cardNumber) => {
  const clean = cardNumber.replace(/\s+/g, '');

  if (!/^\d+$/.test(clean)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const validateExpiry = (expiry) => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

  const [month, year] = expiry.split('/').map(Number);

  if (month < 1 || month > 12) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

export const validateCVV = (cvv) => {
  return /^\d{3}$/.test(cvv);
};

export const validateCardHolder = (name) => {
  if (typeof name !== 'string') return false;
  return name.trim().length > 5;
};