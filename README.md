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

## 🧪 Test Coverage

The project includes comprehensive unit tests for UI components, custom hooks, business logic, and state management using **Jest** and **React Testing Library**.

### 📊 Coverage Summary

```text
Statements   : 98.88% (178/180)
Branches     : 97.87% (92/94)
Functions    : 100%   (36/36)
Lines        : 98.78% (163/165)
```

### 📁 Coverage by Module

| Module   | Statements | Branches | Functions | Lines |
| -------- | ---------- | -------- | --------- | ----- |
| hooks    | 97.77%     | 91.66%   | 100%      | 97.7% |
| pages    | 100%       | 100%     | 100%      | 100%  |
| services | 100%       | 100%     | 100%      | 100%  |
| store    | 100%       | 100%     | 100%      | 100%  |

---

### ▶️ Run tests

```bash
npm test
```

### 📈 Generate coverage report

```bash
npm test -- --coverage
```

The detailed HTML report is available at:

```text
coverage/lcov-report/index.html
```

---

### ✅ Highlights

* High test coverage across all layers (UI, hooks, services, and state)
* Full coverage in critical modules (pages, services, store)
* Thorough validation of edge cases and error handling
* Stable tests without flaky behavior (mocked async flows and timers)

---

### 🧠 Testing Strategy

* **UI Testing:** React Testing Library
* **Hooks Testing:** `renderHook` with isolated logic
* **Mocking:** API, routing, Redux, and external libraries
* **Edge Cases:** Error handling, async flows, conditional rendering

---

## 👩‍💻 Author

Abraham Lugo Ramirez
