import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';

// Carga perezosa (Lazy Loading) de las páginas para optimizar el bundle inicial
const Login = lazy(() => import('./pages/Login.jsx'));
const AdminDashboardNew = lazy(() => import('./pages/AdminDashboardNew.jsx'));
const BeneficiariesPage = lazy(() => import('./pages/BeneficiariesPage.jsx'));
const NewSolicitudPage = lazy(() => import('./pages/NewSolicitudPage.jsx'));
const EditBeneficiarioPage = lazy(() => import('./pages/EditBeneficiarioPage.jsx'));
const ComerciosPage = lazy(() => import('./pages/ComerciosPage.jsx'));
const NewComercioPage = lazy(() => import('./pages/NewComercioPage.jsx'));
const CargaFondosHistorialPage = lazy(() => import('./pages/CargaFondosHistorialPage.jsx'));
const CargaFondosPage = lazy(() => import('./pages/CargaFondosPage.jsx'));
const TransaccionesPage = lazy(() => import('./pages/TransaccionesPage.jsx'));
const AprobacionesPage = lazy(() => import('./pages/AprobacionesPage.jsx'));
const FuncionariosPage = lazy(() => import('./pages/FuncionariosPage.jsx'));

// Componente simple de carga visual intermedio mientras se descargan los fragmentos de página
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#f5f5f2] text-[12px] text-[#999999]">
    Cargando sección...
  </div>
);

function App() {
  const { isAuthenticated, logout, login, error, loading } = useAuth();

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {!isAuthenticated ? (
            <>
              {/* Rutas Públicas */}
              <Route path="/login" element={<Login login={login} error={error} loading={loading} />} />
              {/* Cualquier otra ruta redirige al login si no está autenticado */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              {/* Rutas Privadas Protegidas */}
              <Route path="/dashboard" element={<AdminDashboardNew />} />
              <Route path="/funcionarios" element={<FuncionariosPage />} />

              {/* Beneficiarios */}
              <Route path="/beneficiarios" element={<BeneficiariesPage />} />
              <Route path="/nueva-solicitud" element={<NewSolicitudPage />} />
              <Route path="/beneficiarios/editar/:rut" element={<EditBeneficiarioPage />} />
              
              {/* Solicitudes y Aprobaciones */}
              <Route path="/aprobaciones" element={<AprobacionesPage />} />
              
              {/* Comercios */}
              <Route path="/comercios" element={<ComerciosPage />} />
              <Route path="/nuevo-comercio" element={<NewComercioPage />} />
              
              {/* Fondos y Transacciones */}
              <Route path="/fondos" element={<CargaFondosHistorialPage />} />
              <Route path="/nueva-carga" element={<CargaFondosPage />} />
              <Route path="/transacciones" element={<TransaccionesPage />} />

              {/* Redirección automática si escribe cualquier ruta inexistente estando logeado */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;