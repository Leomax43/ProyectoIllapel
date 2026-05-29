import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';
import fondosService from '../services/fondosService';

const CargaFondosHistorialPage = ({ onNavigate }) => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarga, setSelectedCarga] = useState(null);
  const [cargas, setCargas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCargas = async () => {
      try {
        setLoading(true);
        const data = await fondosService.obtenerTodasLasCargas();
        console.log('📦 Cargas obtenidas:', data);
        setCargas(data);
        if (data.length > 0) {
          setSelectedCarga(data[0]);
        }
      } catch (err) {
        console.error('❌ Error cargando cargas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCargas();
  }, []);

  const formatCurrency = (value) => {
    return parseInt(value).toLocaleString('es-CL');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-CL');
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

  const btnNuevaCargaStyle = {
    background: '#1e7a3e',
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '4px 14px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const controlsRowStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap'
  };

  const inputStyle = {
    flex: 1,
    minWidth: '120px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '5px 9px',
    fontSize: '12px'
  };

  const selectStyle = {
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '5px 8px',
    fontSize: '12px',
    color: '#555'
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
    fontWeight: 'normal'
  };

  const tdStyle = {
    padding: '7px 10px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333'
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '14px',
    alignItems: 'start'
  };

  const detailSectionStyle = {
    padding: '13px 14px',
    borderBottom: '1px solid #eee'
  };

  const detailTitleStyle = {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#2563a0',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const detailGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '7px',
    marginBottom: '8px'
  };

  const detailFieldStyle = {
    fontSize: '12px'
  };

  const lblStyle = {
    fontSize: '11px',
    color: '#888',
    marginBottom: '3px'
  };

  const valStyle = {
    fontSize: '12px',
    color: '#222',
    fontWeight: 'bold'
  };

  const saldoRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '4px'
  };

  const saldoCardStyle = (isGreen) => ({
    border: `1px solid ${isGreen ? '#1e7a3e' : '#2563a0'}`,
    borderRadius: '4px',
    padding: '8px 12px',
    textAlign: 'center',
    background: isGreen ? '#d1e7dd' : '#e0edff'
  });

  const saldoLblStyle = {
    fontSize: '10px',
    color: '#888',
    marginBottom: '3px'
  };

  const saldoValStyle = {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#1a3a5c'
  };

  const motivoBoxStyle = {
    background: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '3px',
    padding: '7px 10px',
    fontSize: '12px',
    color: '#444',
    lineHeight: '1.5'
  };

  const pagerStyle = {
    padding: '7px 12px',
    fontSize: '12px',
    color: '#555',
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #eee'
  };

  const detalle = selectedCarga || (cargas.length > 0 ? cargas[0] : null);

  // Filtrar cargas por búsqueda
  const cargasFiltradas = cargas.filter(carga => {
    const searchLower = searchTerm.toLowerCase();
    return (
      carga.nombre_familia?.toLowerCase().includes(searchLower) ||
      carga.rut_principal?.toLowerCase().includes(searchLower) ||
      carga.motivo?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="fondos" onLogout={logout} onNavigate={onNavigate} />

      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Carga de fondos</div>
        <div style={sectionDescStyle}>
          Historial de todas las cargas realizadas a beneficiarios. Seleccione una fila para ver el detalle, o presione "Nueva carga" para iniciar una nueva asignación.
        </div>

        {/* Métricas */}
        <div style={metricsGridStyle}>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Cargas este mes</div>
            <div style={metricValueStyle('#2563a0')}>23</div>
            <div style={metricSubStyle}>mayo 2026</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Total distribuido este mes</div>
            <div style={metricValueStyle('#1e7a3e')}>$3.840.000</div>
            <div style={metricSubStyle}>a 23 beneficiarios</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Cargas bloqueadas</div>
            <div style={metricValueStyle('#c47f00')}>4</div>
            <div style={metricSubStyle}>por regla 30 días</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Beneficiarios habilitados</div>
            <div style={metricValueStyle('#2563a0')}>128</div>
            <div style={metricSubStyle}>pueden recibir fondos</div>
          </div>
        </div>

        {/* Layout: Tabla + Detalle */}
        <div style={layoutStyle}>
          {/* Panel Historial */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              Historial de cargas
              <button
                style={btnNuevaCargaStyle}
                onClick={() => onNavigate('nueva-carga')}
                onMouseEnter={(e) => e.target.style.background = '#165a2f'}
                onMouseLeave={(e) => e.target.style.background = '#1e7a3e'}
              >
                + Nueva carga
              </button>
            </div>

            <div style={controlsRowStyle}>
              <input
                type="text"
                placeholder="Buscar por beneficiario o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
              <select style={selectStyle}>
                <option>Todos los tipos</option>
                <option>Alimentación</option>
                <option>Materiales de construcción</option>
                <option>Útiles escolares</option>
                <option>Otro</option>
              </select>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Beneficiario</th>
                  <th style={thStyle}>Motivo</th>
                  <th style={thStyle}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#999' }}>
                      Cargando...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#d32f2f' }}>
                      Error: {error}
                    </td>
                  </tr>
                ) : cargasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#999' }}>
                      Sin cargas registradas
                    </td>
                  </tr>
                ) : (
                  cargasFiltradas.map((carga) => (
                    <tr
                      key={carga.id_carga}
                      onClick={() => setSelectedCarga(carga)}
                      style={{
                        background: selectedCarga?.id_carga === carga.id_carga ? '#e0edff' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f6ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = selectedCarga?.id_carga === carga.id_carga ? '#e0edff' : 'transparent'}
                    >
                      <td style={tdStyle}>{carga.id_carga}</td>
                      <td style={tdStyle}>{formatDate(carga.fecha)}</td>
                      <td style={tdStyle}>{carga.nombre_familia}</td>
                      <td style={tdStyle}>{carga.motivo || '—'}</td>
                      <td style={{ ...tdStyle, color: '#1e7a3e', fontWeight: 'bold' }}>
                        ${formatCurrency(carga.monto)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={pagerStyle}>
              <span>Mostrando {cargasFiltradas.length} de {cargas.length} cargas</span>
            </div>
          </div>

          {/* Panel Detalle */}
          {detalle ? (
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>Detalle de carga #{detalle.id_carga}</div>

              <div style={detailSectionStyle}>
                <div style={detailTitleStyle}>Datos del beneficiario</div>
                <div style={detailGridStyle}>
                  <div style={detailFieldStyle}>
                    <div style={lblStyle}>Nombre Familia</div>
                    <div style={valStyle}>{detalle.nombre_familia}</div>
                  </div>
                  <div style={detailFieldStyle}>
                    <div style={lblStyle}>RUT</div>
                    <div style={valStyle}>{detalle.rut_principal}</div>
                  </div>
                </div>
                <div style={saldoRowStyle}>
                  <div style={saldoCardStyle(true)}>
                    <div style={saldoLblStyle}>Saldo actual</div>
                    <div style={saldoValStyle}>${formatCurrency(detalle.saldo)}</div>
                  </div>
                </div>
              </div>

              <div style={detailSectionStyle}>
                <div style={detailTitleStyle}>Datos de esta carga</div>
                <div style={detailGridStyle}>
                  <div style={detailFieldStyle}>
                    <div style={lblStyle}>Fecha</div>
                    <div style={valStyle}>{formatDate(detalle.fecha)}</div>
                  </div>
                  <div style={detailFieldStyle}>
                    <div style={lblStyle}>Monto cargado</div>
                    <div style={{ ...valStyle, color: '#1e7a3e' }}>${formatCurrency(detalle.monto)}</div>
                  </div>
                  <div style={detailFieldStyle}>
                    <div style={lblStyle}>Motivo</div>
                    <div style={valStyle}>{detalle.motivo || '—'}</div>
                  </div>
                </div>
              </div>

              {detalle.detalles && (
                <div style={detailSectionStyle}>
                  <div style={detailTitleStyle}>Detalles adicionales</div>
                  <div style={motivoBoxStyle}>
                    {detalle.detalles}
                  </div>
                </div>
              )}

              {detalle.pdf_resolucion && (
                <div style={detailSectionStyle}>
                  <div style={detailTitleStyle}>Documentación</div>
                  <a 
                    href={detalle.pdf_resolucion}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: '#2563a0',
                      color: '#fff',
                      padding: '8px 14px',
                      borderRadius: '3px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#1e4a8b'}
                    onMouseLeave={(e) => e.target.style.background = '#2563a0'}
                  >
                    📄 Descargar PDF
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>Detalle de carga</div>
              <div style={{ ...detailSectionStyle, color: '#999', textAlign: 'center' }}>
                Selecciona una carga para ver los detalles
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CargaFondosHistorialPage;
