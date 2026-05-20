import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useDashboardPaginado } from '../hooks/useDashboardPaginado.js';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import MetricsCards from '../components/dashboard/MetricsCards.jsx';
import QuickAlerts from '../components/dashboard/QuickAlerts.jsx';
import BeneficiariesTable from '../components/dashboard/BeneficiariesTable.jsx';

function AdminDashboard({ onNavigate }) {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
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

  return (
    <div style={{ border: '1px solid #bbb', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
      <DashboardHeader onLogout={logout} onNavigate={onNavigate} currentPage="dashboard" />

      <div style={{ padding: '16px', background: '#f5f5f2', minHeight: '400px' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a3a5c', marginBottom: '4px' }}>Resumen del sistema</h1>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '14px' }}>
          Panel principal de gestión de ayudas sociales. Aquí se muestran los indicadores generales y las solicitudes recientes.
        </p>

        {error && (
          <div style={{ marginBottom: '16px', borderRadius: '4px', background: '#ffebee', border: '1px solid #ffcdd2', padding: '8px', fontSize: '12px', color: '#c62828' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px', fontSize: '12px', color: '#999' }}>
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
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </>
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '12px', fontSize: '11px', color: '#999', marginTop: '16px' }}>
        Illapel te ayuda · Municipalidad de Illapel · Universidad Católica del Norte
      </div>
    </div>
  );
}

export default AdminDashboard;
