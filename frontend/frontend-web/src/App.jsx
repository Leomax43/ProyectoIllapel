import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importación de tus páginas (Mantenemos las tuyas exactas)
import AdminDashboardNew from './pages/AdminDashboardNew.jsx';
import BeneficiariesPage from './pages/BeneficiariesPage.jsx';
import NewSolicitudPage from './pages/NewSolicitudPage.jsx';
import ComerciosPage from './pages/ComerciosPage.jsx';
import NewComercioPage from './pages/NewComercioPage.jsx';
import CargaFondosHistorialPage from './pages/CargaFondosHistorialPage.jsx';
import CargaFondosPage from './pages/CargaFondosPage.jsx';
import TransaccionesPage from './pages/TransaccionesPage.jsx';
import AprobacionesPage from './pages/AprobacionesPage.jsx';
import Login from './pages/Login.jsx';

import { useAuth } from './hooks/useAuth.js';

function App() {
  const { isAuthenticated, logout, login, error, loading } = useAuth();

  // Si la aplicación está validando el token inicial, no renderizamos las rutas aún
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>Cargando sistema...</div>;
  }

  // Componente protector: Si no está logueado, lo patea al login
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA: LOGIN */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <Login login={login} error={error} loading={loading} /> : 
            <Navigate to="/" replace /> // Si ya está logueado y va a /login, lo mandamos al inicio
          } 
        />

        {/* RUTAS PRIVADAS (Requieren estar autenticado) */}
        <Route path="/" element={ <ProtectedRoute><AdminDashboardNew logout={logout} /></ProtectedRoute> } />
        
        <Route path="/beneficiarios" element={ <ProtectedRoute><BeneficiariesPage logout={logout} /></ProtectedRoute> } />
        <Route path="/beneficiarios/nueva" element={ <ProtectedRoute><NewSolicitudPage logout={logout} /></ProtectedRoute> } />
        
        <Route path="/comercios" element={ <ProtectedRoute><ComerciosPage logout={logout} /></ProtectedRoute> } />
        <Route path="/comercios/nuevo" element={ <ProtectedRoute><NewComercioPage logout={logout} /></ProtectedRoute> } />
        
        <Route path="/fondos" element={ <ProtectedRoute><CargaFondosHistorialPage logout={logout} /></ProtectedRoute> } />
        <Route path="/fondos/nueva" element={ <ProtectedRoute><CargaFondosPage logout={logout} /></ProtectedRoute> } />
        
        <Route path="/transacciones" element={ <ProtectedRoute><TransaccionesPage logout={logout} /></ProtectedRoute> } />
        <Route path="/aprobaciones" element={ <ProtectedRoute><AprobacionesPage logout={logout} /></ProtectedRoute> } />

        {/* RUTA COMODÍN: Si escriben una URL que no existe, los mandamos al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;