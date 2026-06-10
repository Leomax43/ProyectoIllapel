import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MetricasTransacciones from '../components/transacciones/MetricasTransacciones';
import FiltrosTransacciones from '../components/transacciones/FiltrosTransacciones';
import TablaTransacciones from '../components/transacciones/TablaTransacciones';
import { useAuth } from '../hooks/useAuth';
import { obtenerTransacciones, obtenerMetricas } from '../services/transaccionesService';

const TransaccionesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [transacciones, setTransacciones] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [comercioFiltro, setComercioFiltro] = useState('todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 8;

  // Efecto para cargar datos desde la API cuando cambian los filtros principales
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setPaginaActual(1);
      
      // Obtener métricas
      const metricsData = await obtenerMetricas();
      setMetricas(metricsData.metricas);

      // CORRECCIÓN DE FECHAS: Ajustamos horas para cubrir el día completo
      const fInicioParam = fechaInicio ? `${fechaInicio}T00:00:00` : '';
      const fFinParam = fechaFin ? `${fechaFin}T23:59:59` : '';

      // Obtener transacciones pasando los parámetros limpios
      const transData = await obtenerTransacciones({
        fecha_inicio: fInicioParam,
        fecha_fin: fFinParam,
        tipo: tipoFiltro === 'todos' ? '' : tipoFiltro,
        rut_comercio: comercioFiltro === 'todos' ? '' : comercioFiltro
      });
      
      setTransacciones(transData.transacciones || []);
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [fechaInicio, fechaFin, tipoFiltro, comercioFiltro]);

  // 1. FILTRADO LOCAL RECOGIENDO EL SEARCH TERM (Buscador por texto)
  const transaccionesFiltradas = transacciones.filter(tx => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      tx.nombre_familia?.toLowerCase().includes(searchLower) ||
      tx.rut_representante?.toLowerCase().includes(searchLower) ||
      tx.nombre_comercio?.toLowerCase().includes(searchLower) ||
      tx.rut_comercio?.toLowerCase().includes(searchLower) ||
      tx.id_transaccion?.toString().includes(searchLower)
    );
  });

  // 2. LÓGICA DE PAGINACIÓN SOBRE LOS DATOS YA FILTRADOS
  const totalPaginas = Math.ceil(transaccionesFiltradas.length / itemsPorPagina);
  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const indexFin = indexInicio + itemsPorPagina;
  const transaccionesPaginadas = transaccionesFiltradas.slice(indexInicio, indexFin);

  // Manejador para reiniciar la página si el usuario escribe en el buscador
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPaginaActual(1);
  };

  const irAPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  const badgeStyle = (tipo) => {
    const estilos = {
      carga: 'bg-[#d1e7dd] text-[#0f5132]',
      'pago-qr': 'bg-[#e0edff] text-[#1a3a5c]',
      'pago-pin': 'bg-[#fff3cd] text-[#856404]',
      anulado: 'bg-[#f8d7da] text-[#842029]'
    };
    const estilo = estilos[tipo] || estilos['carga'];
    return `p-[2px_8px] rounded-[10px] text-[11px] font-bold inline-block ${estilo}`;
  };

  const getTipoBadge = (metodo) => {
    if (!metodo) return 'carga';
    if (metodo.toLowerCase().includes('qr')) return 'pago-qr';
    if (metodo.toLowerCase().includes('pin') || metodo.toLowerCase().includes('rut')) return 'pago-pin';
    if (metodo.toLowerCase().includes('anulado')) return 'anulado';
    return 'carga';
  };

  const getMontoCargaStyle = (metodo) => {
    if (!metodo) return 'text-[#1e7a3e] font-bold';
    if (metodo.toLowerCase().includes('anulado')) return 'text-[#888]';
    return 'text-[#b52b2b] font-bold';
  };

  const getMontoCarga = (metodo, monto) => {
    if (!metodo) return `+ $${parseInt(monto).toLocaleString('es-CL')}`;
    if (metodo.toLowerCase().includes('anulado')) return `$0`;
    return `- $${parseInt(monto).toLocaleString('es-CL')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      <DashboardHeader currentPage="transacciones" onLogout={logout} onNavigate={navigate} />

      <div className="p-[16px] flex-1">
        <div className="text-[16px] font-bold text-[#1a3a5c] mb-[4px]">Historial de transacciones</div>
        <div className="text-[12px] text-[#666666] mb-[14px]">
          Registro completo de todos los movimientos del sistema: cargas de fondos, pagos por QR y pagos por RUT+PIN. Filtre por fecha, beneficiario, comercio o tipo de operación.
        </div>

        <MetricasTransacciones metricas={metricas} />

        <FiltrosTransacciones
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange} // Usar el manejador que resetea la página
          fechaInicio={fechaInicio}
          onFechaInicioChange={setFechaInicio}
          fechaFin={fechaFin}
          onFechaFinChange={setFechaFin}
          tipoFiltro={tipoFiltro}
          onTipoFiltroChange={setTipoFiltro}
          comercioFiltro={comercioFiltro}
          onComercioFiltroChange={setComercioFiltro}
        />

        <TablaTransacciones
          loading={loading}
          error={error}
          transaccionesPaginadas={transaccionesPaginadas} // Pasa los datos filtrados y segmentados
          transaccionesTotales={transaccionesFiltradas}   // Totales del subconjunto filtrado para contadores
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          indexInicio={indexInicio}
          indexFin={indexFin}
          onCambiarPagina={irAPagina}
          badgeStyle={badgeStyle}
          getTipoBadge={getTipoBadge}
          getMontoCargaStyle={getMontoCargaStyle}
          getMontoCarga={getMontoCarga}
        />
      </div>

      <div className="text-center p-[10px] text-[11px] text-[#999999] bg-[#f5f5f2]">
        Illapel te ayuda · Municipalidad de Illapel · Universidad Católica del Norte
      </div>
    </div>
  );
};

export default TransaccionesPage;