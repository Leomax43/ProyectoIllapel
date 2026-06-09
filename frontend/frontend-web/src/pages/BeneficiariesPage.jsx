import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook de navegación real
import DashboardHeader from '../components/dashboard/DashboardHeader';
import BeneficiariesStats from '../components/beneficiarios/BeneficiariesStats';
import BeneficiariesList from '../components/beneficiarios/BeneficiariesList';
import BeneficiaryDetail from '../components/beneficiarios/BeneficiaryDetail';
import { useBeneficiaries } from '../hooks/useBeneficiaries';
import { useAuth } from '../hooks/useAuth';

const BeneficiariesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      {/* Le inyectamos el navigate real de React Router */}
      <DashboardHeader currentPage="beneficiarios" onLogout={logout} onNavigate={navigate} />

      <div className="p-[16px] flex-1">
        <div className="text-[16px] font-bold text-[#1a3a5c] mb-[4px]">
          Gestión de beneficiarios
        </div>
        <div className="text-[12px] text-[#666666] mb-[14px]">
          Consulte y administre los perfiles de todos los beneficiarios registrados en el sistema. Haga clic en una fila para ver el detalle completo.
        </div>

        <BeneficiariesStats stats={stats} />

        <div className="grid grid-cols-[1.3fr_1fr] gap-[14px] items-start">
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
            onNewSolicitud={() => navigate('/nueva-solicitud')}
          />

          <BeneficiaryDetail beneficiary={selectedBeneficiary} />
        </div>
      </div>
    </div>
  );
};

export default BeneficiariesPage;