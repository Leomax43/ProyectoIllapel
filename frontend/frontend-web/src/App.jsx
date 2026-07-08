import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { getAllowedPagesForRole, normalizeRole } from './utils/permissions';

// Carga perezosa (Lazy Loading) de las páginas para optimizar el bundle inicial
const Login = lazy(() => import('./pages/Login.jsx'));
const AdminDashboardNew = lazy(() => import('./pages/AdminDashboardNew.jsx'));
const BeneficiariesPage = lazy(() => import('./pages/BeneficiariesPage.jsx'));
const NewSolicitudPage = lazy(() => import('./pages/NewSolicitudPage.jsx'));
const EditBeneficiarioPage = lazy(() => import('./pages/EditBeneficiarioPage.jsx'));
const ComerciosPage = lazy(() => import('./pages/ComerciosPage.jsx'));
const NewComercioPage = lazy(() => import('./pages/NewComercioPage.jsx'));
const EditComercioPage = lazy(() => import('./pages/EditComercioPage.jsx'));
const CargaFondosHistorialPage = lazy(() => import('./pages/CargaFondosHistorialPage.jsx'));
const CargaFondosPage = lazy(() => import('./pages/CargaFondosPage.jsx'));
const TransaccionesPage = lazy(() => import('./pages/TransaccionesPage.jsx'));
const AprobacionesPage = lazy(() => import('./pages/AprobacionesPage.jsx'));
const FuncionariosPage = lazy(() => import('./pages/FuncionariosPage.jsx'));
const SubrogacionesPage = lazy(() => import('./pages/SubrogacionesPage.jsx'));
const ExportacionPage = lazy(() => import('./pages/ExportacionPage.jsx'));

// Componente simple de carga visual intermedio mientras se descargan los fragmentos de página
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#f5f5f2] text-[12px] text-[#999999]">
    Cargando sección...
  </div>
);

function App() {
  const { isAuthenticated, logout, login, error, loading } = useAuth();
  const currentRole = normalizeRole(localStorage.getItem('adminRol'));
  const allowedPages = getAllowedPagesForRole(currentRole);

  const isAllowed = (page) => allowedPages.includes(page);
  const getDefaultRoute = () => {
    if (allowedPages.includes('dashboard')) return '/dashboard';
    if (allowedPages.includes('beneficiarios')) return '/beneficiarios';
    if (allowedPages.includes('comercios')) return '/comercios';
    if (allowedPages.includes('fondos')) return '/fondos';
    if (allowedPages.includes('transacciones')) return '/transacciones';
    if (allowedPages.includes('aprobaciones')) return '/aprobaciones';
    if (allowedPages.includes('funcionarios')) return '/funcionarios';
    if (allowedPages.includes('subrogaciones')) return '/subrogaciones';
    if (allowedPages.includes('exportacion')) return '/exportacion';
    return '/login';
  };

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
              <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
              {isAllowed('dashboard') && <Route path="/dashboard" element={<AdminDashboardNew />} />}
              {isAllowed('funcionarios') && <Route path="/funcionarios" element={<FuncionariosPage />} />}
              {isAllowed('subrogaciones') && <Route path="/subrogaciones" element={<SubrogacionesPage />} />}
              {isAllowed('exportacion') && <Route path="/exportacion" element={<ExportacionPage />} />}

              {/* Beneficiarios */}
              {isAllowed('beneficiarios') && <Route path="/beneficiarios" element={<BeneficiariesPage />} />}
              {isAllowed('beneficiarios') && <Route path="/nueva-solicitud" element={<NewSolicitudPage />} />}
              {isAllowed('beneficiarios') && <Route path="/beneficiarios/editar/:rut" element={<EditBeneficiarioPage />} />}
              
              {/* Solicitudes y Aprobaciones */}
              {isAllowed('aprobaciones') && <Route path="/aprobaciones" element={<AprobacionesPage />} />}
              
              {/* Comercios */}
              {isAllowed('comercios') && <Route path="/comercios" element={<ComerciosPage />} />}
              {isAllowed('comercios') && <Route path="/nuevo-comercio" element={<NewComercioPage />} />}
              {isAllowed('comercios') && <Route path="/comercios/editar/:rut" element={<EditComercioPage />} />}
              
              {/* Fondos y Transacciones */}
              {isAllowed('fondos') && <Route path="/fondos" element={<CargaFondosHistorialPage />} />}
              {isAllowed('fondos') && <Route path="/nueva-carga" element={<CargaFondosPage />} />}
              {isAllowed('transacciones') && <Route path="/transacciones" element={<TransaccionesPage />} />}

              {/* Redirección automática si escribe cualquier ruta inexistente estando logeado */}
              <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;