import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import BeneficiariesStats from '../components/dashboard/BeneficiariesStats';
import BeneficiariesList from '../components/dashboard/BeneficiariesList';
import BeneficiaryDetail from '../components/dashboard/BeneficiaryDetail';
import { useBeneficiaries } from '../hooks/useBeneficiaries';
import { useAuth } from '../hooks/useAuth';

const BeneficiariesPage = ({ onNavigate }) => {
  const { logout } = useAuth();
  const {
    beneficiaries,
    stats,
    currentPage,
    totalPages,
    searchTerm,
    estadoFilter,
    loading,
    error,
    handleSearch,
    handleEstadoFilter,
    nextPage,
    prevPage
  } = useBeneficiaries();

  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  const mainStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#f5f5f2'
  };

  const contentStyle = {
    padding: '16px',
    flex: 1
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a3a5c',
    marginBottom: '4px'
  };

  const sectionDescStyle = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '14px'
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: '14px',
    alignItems: 'start'
  };

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="beneficiarios" onLogout={logout} onNavigate={onNavigate} />

      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Gestión de beneficiarios</div>
        <div style={sectionDescStyle}>
          Consulte y administre los perfiles de todos los beneficiarios registrados en el sistema. Haga clic en una fila para ver el detalle completo.
        </div>

        <BeneficiariesStats stats={stats} />

        <div style={layoutStyle}>
          <BeneficiariesList
            beneficiaries={beneficiaries}
            searchTerm={searchTerm}
            estadoFilter={estadoFilter}
            onSearchChange={handleSearch}
            onEstadoChange={handleEstadoFilter}
            onSelectBeneficiary={setSelectedBeneficiary}
            selectedBeneficiaryId={selectedBeneficiary?.id_familia}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            onNewSolicitud={() => onNavigate('nueva-solicitud')}
          />

          <BeneficiaryDetail beneficiary={selectedBeneficiary} />
        </div>
      </div>
    </div>
  );
};

export default BeneficiariesPage;
