# 💳 Checkout Frontend (React)

Frontend application for a payment checkout flow built with **React**.
It allows users to select a product, enter credit card details, and complete a simulated payment using Wompi.

---

## 🚀 Features

* 🛒 Product listing (only available stock)
* 💳 Credit card form with:

  * Luhn validation
  * Visa / MasterCard detection
  * Expiry & CVV validation
* 📦 Order summary view
* 🔄 Payment status handling
* 🔔 Toast notifications (React Toastify)
* 🎨 UI with Bootstrap

---

## 🏗️ Tech Stack

* React
* React Router
* Bootstrap
* React Toastify
* card-validator

---

## ⚙️ Installation

```bash
npm install
npm run dev
```

---

## 📂 Main Pages

* `/` → Product list
* `/checkout` → Card form
* `/summary` → Payment summary
* `/result` → Payment result

---

## 💳 Test Cards

Use only test cards:

* Visa: `4242 4242 4242 4242`
* MasterCard: `5555 5555 5555 4444`

---

## 🔄 Flow

1. User selects a product
2. Enters card details
3. Frontend validates data
4. Sends request to backend
5. Redirects to summary
6. Executes payment
7. Displays result

---

## ⚠️ Notes

* Card data is not stored
* Validation is only for UX
* Backend handles real transaction logic

---

## 👩‍💻 Author

Abraham Lugo Ramirez
