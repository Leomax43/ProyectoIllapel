import React, { useState } from 'react';
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
import FuncionariosPage from './pages/FuncionariosPage.jsx';


function App() {
  const { isAuthenticated, logout, login, error, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <Login login={login} error={error} loading={loading} />;
  }

  return currentPage === 'dashboard' ? (
    <AdminDashboardNew onNavigate={handleNavigation} />
  ) : currentPage === 'beneficiarios' ? (
    <BeneficiariesPage onNavigate={handleNavigation} />
  ) : currentPage === 'nueva-solicitud' ? (
    <NewSolicitudPage onNavigate={handleNavigation} />
  ) : currentPage === 'comercios' ? (
    <ComerciosPage onNavigate={handleNavigation} />
  ) : currentPage === 'nuevo-comercio' ? (
    <NewComercioPage onNavigate={handleNavigation} />
  ) : currentPage === 'fondos' ? (
    <CargaFondosHistorialPage onNavigate={handleNavigation} />
  ) : currentPage === 'nueva-carga' ? (
    <CargaFondosPage onNavigate={handleNavigation} />
  ) : currentPage === 'transacciones' ? (
    <TransaccionesPage onNavigate={handleNavigation} />
  ) : currentPage === 'aprobaciones' ? (
    <AprobacionesPage onNavigate={handleNavigation} />
  ) : currentPage === 'funcionarios' ? (
    <FuncionariosPage onNavigate={handleNavigation} />
  ) : (
    <AdminDashboardNew onNavigate={handleNavigation} />
  );
}

export default App;
