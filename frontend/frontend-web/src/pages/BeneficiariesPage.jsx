import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
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
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="beneficiarios" onLogout={logout} />

      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Gestión de beneficiarios</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Consulte y administre los perfiles de todos los beneficiarios registrados en el sistema. Haga clic en una fila para ver el detalle completo.
            </div>
          </div>
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

      <DashboardFooter />
    </div>
  );
};

export default BeneficiariesPage;