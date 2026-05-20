import React, { useState } from 'react';
import AdminDashboardNew from './pages/AdminDashboardNew.jsx';
import BeneficiariesPage from './pages/BeneficiariesPage.jsx';
import NewSolicitudPage from './pages/NewSolicitudPage.jsx';
import Login from './pages/Login.jsx';
import { useAuth } from './hooks/useAuth.js';

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
  ) : (
    <AdminDashboardNew onNavigate={handleNavigation} />
  );
}

export default App;
