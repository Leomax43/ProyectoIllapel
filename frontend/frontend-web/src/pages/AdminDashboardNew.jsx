import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useDashboardPaginado } from '../hooks/useDashboardPaginado.js';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import MetricsCards from '../components/dashboard/MetricsCards.jsx';
import QuickAlerts from '../components/dashboard/QuickAlerts.jsx';
import BeneficiariesTable from '../components/dashboard/BeneficiariesTable.jsx';

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const { data, loading, error, currentPage, nextPage, prevPage } = useDashboardPaginado(searchTerm);

  const {
    indicadores = {
      beneficiariosActivos: 0,
      solicitudesPendientes: 0,
      comerciosRegistrados: 0,
      fondosCargadosTotales: 0,
    },
    familias = [],
    paginacion = {
      paginaActual: 1,
      totalPaginas: 1,
      totalRegistros: 0,
      registrosPorPagina: 8,
    },
  } = data || {};

  const handleEjecutarBusqueda = () => {
    setSearchTerm(localSearchTerm);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader onLogout={logout} currentPage="dashboard" />

      {/* CONTENT */}
      <div className="p-[18px_20px] bg-gris-bg min-h-[460px] flex-1">

        {/* PAGE HEADER */}
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Panel de control</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Resumen general del sistema de gestión de ayudas sociales — Municipalidad de Illapel
            </div>
          </div>
          <button
            onClick={() => navigate('/nueva-solicitud')}
            className="bg-verde border-none text-white rounded-[4px] px-[16px] py-[8px] text-[12px] font-semibold cursor-pointer"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            + Nueva solicitud
          </button>
        </div>

        {error && (
          <div className="mb-[16px] rounded-[4px] bg-red-50 border border-red-200 p-[8px] text-[12px] text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-[32px] text-[12px] text-gris-claro">
            Cargando dashboard...
          </div>
        ) : (
          <>
            <MetricsCards indicadores={indicadores} />
            <QuickAlerts indicadores={indicadores} />
            <BeneficiariesTable 
              beneficiarios={familias} 
              currentPage={currentPage}
              totalPages={paginacion.totalPaginas}
              totalRecords={paginacion.totalRegistros}
              recordsPerPage={paginacion.registrosPorPagina}
              onNextPage={nextPage}
              onPrevPage={prevPage}
              searchTerm={localSearchTerm}
              onSearchChange={setLocalSearchTerm}
              onSearchSubmit={handleEjecutarBusqueda}
              onNavigate={navigate}
            />
          </>
        )}
      </div>

      <DashboardFooter />
    </div>
  );
}

export default AdminDashboard;