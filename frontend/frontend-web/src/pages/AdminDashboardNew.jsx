import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useDashboardPaginado } from '../hooks/useDashboardPaginado.js';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import MetricsCards from '../components/dashboard/MetricsCards.jsx';
import QuickAlerts from '../components/dashboard/QuickAlerts.jsx';
import BeneficiariesTable from '../components/dashboard/BeneficiariesTable.jsx';

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Término definitivo que se envía a la API del backend
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado local para capturar el input del teclado sin re-renderizar todo
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

  // Al presionar el botón "Buscar" o Enter, enviamos el estado local al hook de paginación
  const handleEjecutarBusqueda = () => {
    setSearchTerm(localSearchTerm);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      <DashboardHeader onLogout={logout} onNavigate={navigate} currentPage="dashboard" />

      <div className="p-[16px] bg-[#f5f5f2] min-h-[400px]">
        <h1 className="text-[16px] font-bold text-[#1a3a5c] mb-[4px]">Resumen del sistema</h1>
        <p className="text-[12px] text-[#666666] mb-[14px]">
          Panel principal de gestión de ayudas sociales. Aquí se muestran los indicadores generales y las solicitudes recientes.
        </p>

        {error && (
          <div className="mb-[16px] rounded-[4px] bg-[#ffebee] border border-[#ffcdd2] p-[8px] text-[12px] text-[#c62828]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-[32px] text-[12px] text-[#999999]">
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
            />
          </>
        )}
      </div>

      <div className="text-center padding-[12px] text-[11px] text-[#999999] mt-[16px] mb-[12px]">
        Illapel te ayuda · Municipalidad de Illapel · Universidad Católica del Norte
      </div>
    </div>
  );
}

export default AdminDashboard;