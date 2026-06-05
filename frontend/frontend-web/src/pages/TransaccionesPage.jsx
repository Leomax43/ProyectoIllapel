import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';
import { obtenerTransacciones, obtenerMetricas } from '../services/transaccionesService';

const TransaccionesPage = ({ onNavigate }) => {
  const { logout } = useAuth();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setPaginaActual(1);
        
        // Obtener métricas
        const metricsData = await obtenerMetricas();
        console.log('📊 Métricas obtenidas:', metricsData);
        setMetricas(metricsData.metricas);

        // Obtener transacciones
        const transData = await obtenerTransacciones({
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          tipo: tipoFiltro,
          rut_comercio: comercioFiltro
        });
        console.log('📊 Transacciones obtenidas:', transData);
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

  // Lógica de paginación
  const totalPaginas = Math.ceil(transacciones.length / itemsPorPagina);
  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const indexFin = indexInicio + itemsPorPagina;
  const transaccionesPaginadas = transacciones.slice(indexInicio, indexFin);

  const irAPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  const mainStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#f5f5f2'
  };

  const contentStyle = {
    padding: '16px',
    flex: 1
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a3a5c',
    marginBottom: '4px'
  };

  const sectionDescStyle = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '14px'
  };

  const metricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '14px'
  };

  const metricCardStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px 14px'
  };

  const metricLabelStyle = {
    fontSize: '11px',
    color: '#888',
    marginBottom: '3px'
  };

  const metricValueStyle = (color) => ({
    fontSize: '20px',
    fontWeight: 'bold',
    color: color
  });

  const metricSubStyle = {
    fontSize: '11px',
    color: '#aaa',
    marginTop: '2px'
  };

  const panelStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '14px'
  };

  const panelHeaderStyle = {
    background: '#2563a0',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '8px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const filtersRowStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid #eee',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
    gap: '8px',
    alignItems: 'center'
  };

  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '5px 9px',
    fontSize: '12px',
    color: '#333',
    width: "92%"
  };

  const buttonStyle = {
    background: '#2563a0',
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '6px 14px',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px'
  };

  const thStyle = {
    background: '#2563a0',
    color: '#fff',
    padding: '7px 10px',
    textAlign: 'left',
    fontWeight: 'normal',
    whiteSpace: 'nowrap'
  };

  const tdStyle = {
    padding: '7px 10px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333'
  };

  const badgeStyle = (tipo) => {
    const estilos = {
      carga: { background: '#d1e7dd', color: '#0f5132' },
      'pago-qr': { background: '#e0edff', color: '#1a3a5c' },
      'pago-pin': { background: '#fff3cd', color: '#856404' },
      anulado: { background: '#f8d7da', color: '#842029' }
    };
    const estilo = estilos[tipo] || estilos['carga'];
    return {
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      display: 'inline-block',
      background: estilo.background,
      color: estilo.color
    };
  };

  const pagerStyle = {
    padding: '7px 12px',
    fontSize: '12px',
    color: '#555',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #eee'
  };

  const legendRowStyle = {
    padding: '7px 12px',
    borderBottom: '1px solid #eee',
    background: '#fafafa',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    fontSize: '11px',
    color: '#666'
  };

  const footerStyle = {
    textAlign: 'center',
    padding: '10px',
    fontSize: '11px',
    color: '#999',
    background: '#f5f5f2'
  };

  const formatCurrency = (value) => `$${parseInt(value).toLocaleString('es-CL')}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('es-CL');

  const getTipoBadge = (metodo) => {
    if (!metodo) return 'carga';
    if (metodo.toLowerCase().includes('qr')) return 'pago-qr';
    if (metodo.toLowerCase().includes('pin') || metodo.toLowerCase().includes('rut')) return 'pago-pin';
    if (metodo.toLowerCase().includes('anulado')) return 'anulado';
    return 'carga';
  };

  const getMontoCargaStyle = (metodo) => {
    if (!metodo) return { color: '#1e7a3e', fontWeight: 'bold' }; // Carga = verde
    if (metodo.toLowerCase().includes('anulado')) return { color: '#888' }; // Anulado = gris
    return { color: '#b52b2b', fontWeight: 'bold' }; // Pagos = rojo
  };

  const getMontoCarga = (metodo, monto) => {
    if (!metodo) return `+ $${parseInt(monto).toLocaleString('es-CL')}`;
    if (metodo.toLowerCase().includes('anulado')) return `$0`;
    return `- $${parseInt(monto).toLocaleString('es-CL')}`;
  };

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="transacciones" onLogout={logout} onNavigate={onNavigate} />

      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Historial de transacciones</div>
        <div style={sectionDescStyle}>
          Registro completo de todos los movimientos del sistema: cargas de fondos, pagos por QR y pagos por RUT+PIN. Filtre por fecha, beneficiario, comercio o tipo de operación.
        </div>

        {/* Métricas */}
        <div style={metricsGridStyle}>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Transacciones este mes</div>
            <div style={metricValueStyle('#2563a0')}>{metricas?.totalTransacciones || 0}</div>
            <div style={metricSubStyle}>{metricas?.mesActual || 'Cargando...'}</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Total fondos cargados</div>
            <div style={metricValueStyle('#1e7a3e')}>${(metricas?.totalFondosCargados || 0).toLocaleString('es-CL')}</div>
            <div style={metricSubStyle}>{metricas?.totalCargas || 0} cargas realizadas</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Total pagos procesados</div>
            <div style={metricValueStyle('#c47f00')}>${(metricas?.totalPagos || 0).toLocaleString('es-CL')}</div>
            <div style={metricSubStyle}>{metricas?.pagosQr || 0} pagos este mes</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Pagos por RUT+PIN</div>
            <div style={metricValueStyle('#2563a0')}>{metricas?.pagosRutPin || 0}</div>
            <div style={metricSubStyle}>vs {metricas?.pagosQr || 0} por QR</div>
          </div>
        </div>

        {/* Panel de Filtros */}
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>Filtros de búsqueda</div>
          <div style={filtersRowStyle}>
            <input
              type="text"
              placeholder="Buscar por beneficiario, RUT o comercio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={inputStyle}
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={inputStyle}
            />
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              style={inputStyle}
            >
              <option value="todos">Todos los tipos</option>
              <option value="carga">Carga de fondos</option>
              <option value="pago-qr">Pago QR</option>
              <option value="pago-pin">Pago RUT+PIN</option>
              <option value="anulado">Anulado</option>
            </select>
            <select
              value={comercioFiltro}
              onChange={(e) => setComercioFiltro(e.target.value)}
              style={inputStyle}
            >
              <option value="todos">Todos los comercios</option>
              <option value="minimarket">Minimarket Don Jorge</option>
              <option value="ferreteria">Ferretería El Clavo</option>
              <option value="supermercado">Supermercado La Esperanza</option>
              <option value="libreria">Librería Saber</option>
            </select>
            <button style={buttonStyle}>Filtrar</button>
          </div>
        </div>

        {/* Panel de Transacciones */}
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            Movimientos del sistema
            <div style={{ display: 'flex', gap: '5px' }}>
              <button style={{ ...buttonStyle, background: '#2563a0' }}>Excel</button>
              <button style={{ ...buttonStyle, background: '#2563a0' }}>CSV</button>
              <button style={{ ...buttonStyle, background: '#2563a0' }}>PDF</button>
            </div>
          </div>

          {/* Leyenda */}
          <div style={legendRowStyle}>
            <span>
              <span style={badgeStyle('carga')}>Carga de fondos</span> Asignación municipal
            </span>
            <span>
              <span style={badgeStyle('pago-qr')}>Pago QR</span> Escaneado por comercio
            </span>
            <span>
              <span style={badgeStyle('pago-pin')}>Pago RUT+PIN</span> Ingreso manual
            </span>
            <span>
              <span style={badgeStyle('anulado')}>Anulado</span> Operación revertida
            </span>
          </div>

          {/* Tabla */}
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Fecha y hora</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Beneficiario</th>
                <th style={thStyle}>Comercio</th>
                <th style={thStyle}>Monto</th>
                <th style={thStyle}>Saldo resultante</th>
                <th style={thStyle}>Respaldo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', color: '#999' }}>
                    Cargando transacciones...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', color: '#d32f2f' }}>
                    ❌ Error: {error}
                  </td>
                </tr>
              ) : transacciones.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', color: '#999' }}>
                    No hay transacciones registradas
                  </td>
                </tr>
              ) : (
                transaccionesPaginadas.map((transaccion) => (
                  <tr 
                    key={transaccion.id_transaccion}
                    style={{ cursor: 'pointer' }} 
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f6ff'} 
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdStyle}>#{transaccion.id_transaccion}</td>
                    <td style={tdStyle}>{new Date(transaccion.fecha).toLocaleDateString('es-CL')} {new Date(transaccion.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={tdStyle}><span style={badgeStyle(getTipoBadge(transaccion.metodo_pago))}>{transaccion.metodo_pago || 'Carga de fondos'}</span></td>
                    <td style={tdStyle}>{transaccion.nombre_familia || '—'}</td>
                    <td style={tdStyle}>{transaccion.nombre_comercio || '—'}</td>
                    <td style={{ ...tdStyle, ...getMontoCargaStyle(transaccion.metodo_pago) }}>{getMontoCarga(transaccion.metodo_pago, transaccion.monto)}</td>
                    <td style={tdStyle}>${parseInt(transaccion.saldo || 0).toLocaleString('es-CL')}</td>
                    <td style={tdStyle}>—</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginador */}
          <div style={pagerStyle}>
            <span>Mostrando {indexInicio + 1} a {Math.min(indexFin, transacciones.length)} de {transacciones.length} transacciones del período</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button
                onClick={() => irAPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                style={{
                  ...buttonStyle,
                  background: paginaActual === 1 ? '#ccc' : '#2563a0',
                  cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                  padding: '4px 8px',
                  fontSize: '11px'
                }}
              >
                Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <button
                  key={pagina}
                  onClick={() => irAPagina(pagina)}
                  style={{
                    background: paginaActual === pagina ? '#1a3a5c' : '#e8e8e8',
                    color: paginaActual === pagina ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: paginaActual === pagina ? 'bold' : 'normal',
                    minWidth: '24px'
                  }}
                >
                  {pagina}
                </button>
              ))}

              <button
                onClick={() => irAPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                style={{
                  ...buttonStyle,
                  background: paginaActual === totalPaginas ? '#ccc' : '#2563a0',
                  cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                  padding: '4px 8px',
                  fontSize: '11px'
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={footerStyle}>Illapel te ayuda · Municipalidad de Illapel · Universidad Católica del Norte</div>
    </div>
  );
};

export default TransaccionesPage;
