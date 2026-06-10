import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import CargaFondosList from '../components/cargaFondos/CargaFondosList';
import CargaFondosDetail from '../components/cargaFondos/CargaFondosDetail'; 
import { useAuth } from '../hooks/useAuth';
import { useCargaFondosHistorial } from '../hooks/useCargaFondosHistorial';

const CargaFondosHistorialPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [estadoFilter, setEstadoFilter] = useState('TODOS'); // Estado local para controlar el dropdown de estados

  // Consumimos la lógica e indicadores calculados desde el hook modularizado original
  const {
    cargas,
    cargasFiltradas: cargasFiltradasPorTexto, // Renombrado para no chocar con el filtro final
    searchTerm,
    setSearchTerm,
    selectedCarga,
    setSelectedCarga,
    loading,
    error,
    metricas
  } = useCargaFondosHistorial();

  const formatCurrency = (value) => parseInt(value).toLocaleString('es-CL');
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('es-CL') : '—';

  // Aplicamos el filtro secundario de Estado sobre las cargas ya filtradas por texto del hook
  const cargasFiltradasFinal = cargasFiltradasPorTexto.filter(carga => {
    if (estadoFilter === 'TODOS') return true;
    return carga.estado && carga.estado.toUpperCase() === estadoFilter.toUpperCase();
  });

  const detalle = selectedCarga || (cargasFiltradasFinal.length > 0 ? cargasFiltradasFinal[0] : null);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      <DashboardHeader currentPage="fondos" onLogout={logout} onNavigate={navigate} />

      <div className="p-[16px] flex-1">
        <div className="text-[16px] font-bold text-[#1a3a5c] mb-[4px]">Carga de fondos</div>
        <div className="text-[12px] text-[#666666] mb-[16px]">
          Historial de todas las cargas realizadas a beneficiarios. Seleccione una fila para ver el detalle, o presione "Nueva carga" para iniciar una nueva asignación.
        </div>

        {/* Métricas Dinámicas Automatizadas Originales (Intactas) */}
        {metricas && (
          <div className="grid grid-cols-4 gap-[10px] mb-[14px]">
            <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
              <div className="text-[11px] text-[#888888] mb-[3px]">Cargas este mes</div>
              <div className="text-[20px] font-bold text-[#2563a0]">{metricas.cargasEsteMes}</div>
              <div className="text-[11px] text-[#aaaaaa] mt-[2px] capitalize">{metricas.nombreMesAño}</div>
            </div>
            
            <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
              <div className="text-[11px] text-[#888888] mb-[3px]">Total distribuido este mes</div>
              <div className="text-[20px] font-bold text-[#1e7a3e]">${formatCurrency(metricas.totalDistribuidoMes)}</div>
              <div className="text-[11px] text-[#aaaaaa] mt-[2px]">a {metricas.beneficiariosUnicosMes} beneficiarios</div>
            </div>
            
            <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
              <div className="text-[11px] text-[#888888] mb-[3px]">Cargas bloqueadas</div>
              <div className="text-[20px] font-bold text-[#c47f00]">{metricas.cargasBloqueadas}</div>
              <div className="text-[11px] text-[#aaaaaa] mt-[2px]">por regla u omisión</div>
            </div>
            
            <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
              <div className="text-[11px] text-[#888888] mb-[3px]">Beneficiarios habilitados</div>
              <div className="text-[20px] font-bold text-[#2563a0]">{metricas.beneficiariosHabilitados}</div>
              <div className="text-[11px] text-[#aaaaaa] mt-[2px]">pueden recibir fondos</div>
            </div>
          </div>
        )}

        {/* Layout de componentes modulares */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-[14px] items-start">
          <CargaFondosList 
            cargasFiltradas={cargasFiltradasFinal}
            totalCargas={cargas.length}
            selectedCarga={selectedCarga}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            estadoFilter={estadoFilter}
            onEstadoFilterChange={setEstadoFilter}
            onCargaSelect={setSelectedCarga}
            onNewCarga={() => navigate('/nueva-carga')}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            loading={loading}
            error={error}
          />

          <CargaFondosDetail 
            detalle={detalle}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

export default CargaFondosHistorialPage;