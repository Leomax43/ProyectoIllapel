import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';

// Páginas
import Login from './pages/Login.jsx';
import AdminDashboardNew from './pages/AdminDashboardNew.jsx';
import BeneficiariesPage from './pages/BeneficiariesPage.jsx';
import NewSolicitudPage from './pages/NewSolicitudPage.jsx';
import ComerciosPage from './pages/ComerciosPage.jsx';
import NewComercioPage from './pages/NewComercioPage.jsx';
import CargaFondosHistorialPage from './pages/CargaFondosHistorialPage.jsx';
import CargaFondosPage from './pages/CargaFondosPage.jsx';
import TransaccionesPage from './pages/TransaccionesPage.jsx';
import AprobacionesPage from './pages/AprobacionesPage.jsx';
import FuncionariosPage from './pages/FuncionariosPage.jsx';

function App() {
  const { isAuthenticated, logout, login, error, loading } = useAuth();

  // Si no está autenticado, la única ruta accesible es el Login
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login login={login} error={error} loading={loading} />} />
          {/* Cualquier otra URL redirige automáticamente al Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // Si está autenticado, habilitamos el panel completo de rutas de Illapel
  return (
    <Router>
      <Routes>
        {/* Rutas Principales */}
        <Route path="/dashboard" element={<AdminDashboardNew />} />
        <Route path="/funcionarios" element={<FuncionariosPage />} />

        {/* beneficiarios */}
        <Route path="/beneficiarios" element={<BeneficiariesPage />} />
        <Route path="/nueva-solicitud" element={<NewSolicitudPage />} />
        
        {/* Solicitudes y Aprobaciones */}
        <Route path="/aprobaciones" element={<AprobacionesPage />} />
        
        {/* Comercios */}
        <Route path="/comercios" element={<ComerciosPage />} />
        <Route path="/nuevo-comercio" element={<NewComercioPage />} />
        
        {/* Fondos y Transacciones */}
        <Route path="/fondos" element={<CargaFondosHistorialPage />} />
        <Route path="/nueva-carga" element={<CargaFondosPage />} />
        <Route path="/transacciones" element={<TransaccionesPage />} />

        {/* Redirecciones de seguridad por si escriben una URL que no existe */}
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;