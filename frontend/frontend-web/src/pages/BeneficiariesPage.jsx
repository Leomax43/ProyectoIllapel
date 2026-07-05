import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import BeneficiariesStats from '../components/beneficiarios/BeneficiariesStats';
import BeneficiariesList from '../components/beneficiarios/BeneficiariesList';
import BeneficiaryDetail from '../components/beneficiarios/BeneficiaryDetail';
import { useBeneficiaries } from '../hooks/useBeneficiaries';
import { useAuth } from '../hooks/useAuth';
import familiasService from '../services/familiasService';

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
  const [mensaje, setMensaje] = useState(null);

  const handleEstadoCambiado = async (id_familia, nuevoEstado) => {
    if (!confirm(`¿Estás seguro de ${nuevoEstado === 'BAJA' ? 'dar de baja' : 'activar'} este beneficiario?`)) return;
    
    try {
      await familiasService.cambiarEstado(id_familia, nuevoEstado);
      setMensaje({ tipo: 'exito', texto: `Beneficiario ${nuevoEstado === 'BAJA' ? 'dado de baja' : 'activado'} correctamente` });
      // Recargar datos
      window.location.reload();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  };

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

        {mensaje && (
          <div className={`p-[10px] mb-[12px] rounded-[4px] text-[12px] font-bold ${
            mensaje.tipo === 'exito' ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]' : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
          }`}>
            {mensaje.texto}
            <button onClick={() => setMensaje(null)} className="float-right font-bold cursor-pointer bg-transparent border-none">×</button>
          </div>
        )}

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
            onEstadoCambiado={handleEstadoCambiado}
          />

          <BeneficiaryDetail beneficiary={selectedBeneficiary} />
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default BeneficiariesPage;