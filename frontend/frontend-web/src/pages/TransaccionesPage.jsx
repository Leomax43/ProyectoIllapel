import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
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
  const [rubroFiltro, setRubroFiltro] = useState('todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 8;

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setPaginaActual(1);
      
      const metricsData = await obtenerMetricas();
      setMetricas(metricsData.metricas);

      const fInicioParam = fechaInicio ? `${fechaInicio}T00:00:00` : '';
      const fFinParam = fechaFin ? `${fechaFin}T23:59:59` : '';

      const transData = await obtenerTransacciones({
        fecha_inicio: fInicioParam,
        fecha_fin: fFinParam,
        tipo: tipoFiltro === 'todos' ? '' : tipoFiltro,
        rubro: rubroFiltro === 'todos' ? '' : rubroFiltro
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
}, [fechaInicio, fechaFin, tipoFiltro, rubroFiltro]);

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

  const totalPaginas = Math.ceil(transaccionesFiltradas.length / itemsPorPagina);
  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const indexFin = indexInicio + itemsPorPagina;
  const transaccionesPaginadas = transaccionesFiltradas.slice(indexInicio, indexFin);

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
      carga: 'bg-[#e6f7f4] text-verde border border-[#b2e8de]',
      'pago-qr': 'bg-[#e0eaf0] text-azul border border-[#b0ccd8]',
      'pago-pin': 'bg-[#fff8e0] text-[#a07800] border border-[#f0d970]',
      anulado: 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
    };
    const estilo = estilos[tipo] || estilos['carga'];
    return `inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${estilo}`;
  };

  const getTipoBadge = (metodo) => {
    if (!metodo) return 'carga';
    if (metodo.toLowerCase().includes('qr')) return 'pago-qr';
    if (metodo.toLowerCase().includes('pin') || metodo.toLowerCase().includes('rut')) return 'pago-pin';
    if (metodo.toLowerCase().includes('anulado')) return 'anulado';
    return 'carga';
  };

  const getMontoCargaStyle = (metodo) => {
    if (!metodo) return 'text-verde font-bold';
    if (metodo.toLowerCase().includes('anulado')) return 'text-gris-claro';
    return 'text-[#b52b2b] font-bold';
  };

  const getMontoCarga = (metodo, monto) => {
    if (!metodo) return `+ $${parseInt(monto).toLocaleString('es-CL')}`;
    if (metodo.toLowerCase().includes('anulado')) return `$0`;
    return `- $${parseInt(monto).toLocaleString('es-CL')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="transacciones" onLogout={logout} />

      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Historial de transacciones</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Registro completo de todos los movimientos del sistema: cargas de fondos, pagos por QR y pagos por RUT+PIN. Filtre por fecha, beneficiario, comercio o tipo de operación.
            </div>
          </div>
        </div>

        <MetricasTransacciones metricas={metricas} />

        <FiltrosTransacciones
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          fechaInicio={fechaInicio}
          onFechaInicioChange={setFechaInicio}
          fechaFin={fechaFin}
          onFechaFinChange={setFechaFin}
          tipoFiltro={tipoFiltro}
          onTipoFiltroChange={setTipoFiltro}
          rubroFiltro={rubroFiltro}
          onRubroFiltroChange={setRubroFiltro}
        />

        <TablaTransacciones
          loading={loading}
          error={error}
          transaccionesPaginadas={transaccionesPaginadas}
          transaccionesTotales={transaccionesFiltradas}
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

      <DashboardFooter />
    </div>
  );
};

export default TransaccionesPage;