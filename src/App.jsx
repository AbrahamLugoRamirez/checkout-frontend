import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ResultPage from './pages/ResultPage';
import { ToastContainer } from 'react-toastify';
import SummaryPage from './pages/SummaryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
