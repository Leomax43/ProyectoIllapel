import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import CargaFondosList from '../components/cargaFondos/CargaFondosList';
import CargaFondosDetail from '../components/cargaFondos/CargaFondosDetail'; 
import { useAuth } from '../hooks/useAuth';
import { useCargaFondosHistorial } from '../hooks/useCargaFondosHistorial';

const CargaFondosHistorialPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  const {
    cargas,
    cargasFiltradas: cargasFiltradasPorTexto,
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

  const cargasFiltradasFinal = cargasFiltradasPorTexto.filter(carga => {
    if (estadoFilter === 'TODOS') return true;
    return carga.estado && carga.estado.toUpperCase() === estadoFilter.toUpperCase();
  });

  const detalle = selectedCarga || (cargasFiltradasFinal.length > 0 ? cargasFiltradasFinal[0] : null);

  const metricaCards = metricas ? [
    { label: 'Cargas este mes', value: metricas.cargasEsteMes, sub: metricas.nombreMesAño, color: 'azul' },
    { label: 'Total distribuido este mes', value: `$${formatCurrency(metricas.totalDistribuidoMes)}`, sub: `a ${metricas.beneficiariosUnicosMes} beneficiarios`, color: 'verde' },
    { label: 'Cargas bloqueadas', value: metricas.cargasBloqueadas, sub: 'por regla u omisión', color: 'amarillo' },
    { label: 'Beneficiarios habilitados', value: metricas.beneficiariosHabilitados, sub: 'pueden recibir fondos', color: 'azul' },
  ] : [];

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="fondos" onLogout={logout} />

      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Carga de fondos</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Historial de todas las cargas realizadas a beneficiarios. Seleccione una fila para ver el detalle, o presione "Nueva carga" para iniciar una nueva asignación.
            </div>
          </div>
        </div>

        {/* MÉTRICAS con nuevo diseño */}
        {metricas && (
          <div className="grid grid-cols-4 gap-[12px] mb-[18px]">
            {metricaCards.map((card, idx) => (
              <div key={idx} className="bg-white border border-gris-borde rounded-[6px] p-[14px_16px] relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${
                  card.color === 'verde' ? 'bg-verde' : card.color === 'amarillo' ? 'bg-amarillo' : 'bg-azul'
                }`}></div>
                <div className="text-[11px] text-gris-claro mb-[4px] font-normal">{card.label}</div>
                <div className={`text-[20px] font-bold ${
                  card.color === 'verde' ? 'text-verde' : card.color === 'amarillo' ? 'text-[#c49300]' : 'text-azul'
                }`}>{card.value}</div>
                <div className="text-[11px] text-[#bbb] mt-[2px] font-light capitalize">{card.sub}</div>
              </div>
            ))}
          </div>
        )}

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

      <DashboardFooter />
    </div>
  );
};

export default CargaFondosHistorialPage;