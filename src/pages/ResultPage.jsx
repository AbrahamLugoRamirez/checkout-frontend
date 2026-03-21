import { useLocation } from 'react-router-dom';

export default function ResultPage() {
  const query = new URLSearchParams(useLocation().search);

  const status = query.get('status');

  return (
    <div className="container mt-5 text-center">
      <h1>Resultado del pago</h1>

      {status === 'approved' && (
        <div className="alert alert-success">
          ✅ Pago aprobado
        </div>
      )}

      {status === 'declined' && (
        <div className="alert alert-danger">
          ❌ Pago rechazado
        </div>
      )}

      {status === 'timeout' && (
        <div className="alert alert-warning">
          ⏳ Tiempo de espera agotado
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-danger">
          ⚠️ Error procesando el pago
        </div>
      )}
    </div>
  );
}