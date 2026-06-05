import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';
import comerciosService from '../services/comerciosService';

const ComerciosPage = ({ onNavigate }) => {
  const { logout } = useAuth();
  const [comercios, setComercios] = useState([]);
  const [selectedComercio, setSelectedComercio] = useState(null);
  const [comercioDetalle, setComercioDetalle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    fetchComercios();
  }, []);

  const fetchComercios = async () => {
    setLoading(true);
    try {
      const response = await comerciosService.getComercios();
      setComercios(response);
      if (response.length > 0) {
        setSelectedComercio(response[0]);
        fetchComercioDetalle(response[0].rut_comercio);
      }
    } catch (error) {
      console.error('Error fetching comercios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComercioDetalle = async (rut) => {
    setLoadingDetalle(true);
    try {
      const response = await comerciosService.getComercioDetalle(rut);
      setComercioDetalle(response);
    } catch (error) {
      console.error('Error fetching detalle:', error);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const filteredComercios = comercios.filter(c => {
    const matchesSearch = searchTerm === '' ||
      c.nombre_comercio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rut_comercio.includes(searchTerm) ||
      c.rubro.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = estadoFilter === 'Todos' || c.estado === estadoFilter;
    
    return matchesSearch && matchesEstado;
  });

  const handleNewComercio = () => {
    onNavigate('nuevo-comercio');
  };

  const handleComercioSelect = (comercio) => {
    setSelectedComercio(comercio);
    fetchComercioDetalle(comercio.rut_comercio);
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString('es-CL')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CL');
  };

  // Estilos
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
    marginBottom: '16px'
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: '14px',
    alignItems: 'start'
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

  const btnNuevoStyle = {
    background: '#1e7a3e',
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '4px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const controlsRowStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  };

  const inputStyle = {
    flex: 1,
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
    fontWeight: 'normal',
    borderBottom: '1px solid #ddd'
  };

  const tdStyle = {
    padding: '7px 10px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333'
  };

  const rowSelectedStyle = {
    background: '#e0edff'
  };

  const badgeStyle = (estado) => ({
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'inline-block',
    background: estado === 'ACTIVO' ? '#d1e7dd' : '#f8d7da',
    color: estado === 'ACTIVO' ? '#0f5132' : '#842029'
  });

  const actionBtnStyle = {
    padding: '3px 9px',
    borderRadius: '3px',
    fontSize: '11px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    marginRight: '3px'
  };

  const btnVerStyle = {
    ...actionBtnStyle,
    background: '#2563a0'
  };

  const btnBajaStyle = {
    ...actionBtnStyle,
    background: '#b52b2b'
  };

  const pagerStyle = {
    padding: '7px 12px',
    fontSize: '12px',
    color: '#555',
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #eee'
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
    gap: '7px'
  };

  const detailFieldStyle = {
    fontSize: '12px'
  };

  const detailLblStyle = {
    fontSize: '11px',
    color: '#888',
    marginBottom: '3px'
  };

  const detailValStyle = {
    fontSize: '12px',
    color: '#222',
    fontWeight: 'bold'
  };

  const saldoBoxStyle = {
    background: '#e0edff',
    border: '1px solid #2563a0',
    borderRadius: '4px',
    padding: '10px 14px',
    textAlign: 'center',
    marginTop: '10px'
  };

  const saldoLabelStyle = {
    fontSize: '11px',
    color: '#5580aa',
    marginBottom: '3px'
  };

  const saldoValorStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1a3a5c'
  };

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="comercios" onNavigate={onNavigate} />
      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Gestión de comercios</div>
        <div style={sectionDescStyle}>
          Administre los comercios locales verificados por la municipalidad. Puede registrar nuevos establecimientos, revisar su saldo acumulado y darlos de baja.
        </div>

        <div style={layoutStyle}>
          {/* Panel izquierdo - Lista de comercios */}
          <div>
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                Comercios registrados
                <button
                  style={btnNuevoStyle}
                  onClick={handleNewComercio}
                  onMouseEnter={(e) => e.target.style.background = '#157a3e'}
                  onMouseLeave={(e) => e.target.style.background = '#1e7a3e'}
                >
                  + Nuevo comercio
                </button>
              </div>

              <div style={controlsRowStyle}>
                <input
                  type="text"
                  placeholder="Buscar por nombre, RUT o rubro..."
                  style={inputStyle}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  style={selectStyle}
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                >
                  <option>Todos</option>
                  <option>ACTIVO</option>
                  <option>BAJA</option>
                </select>
              </div>

              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>RUT</th>
                    <th style={thStyle}>Nombre comercio</th>
                    <th style={thStyle}>Rubro</th>
                    <th style={thStyle}>Saldo acum.</th>
                    <th style={thStyle}>Estado</th>
                    <th style={thStyle}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                   {filteredComercios.map((comercio) => (
                    <tr
                      key={comercio.rut_comercio}
                      style={selectedComercio?.rut_comercio === comercio.rut_comercio ? rowSelectedStyle : {}}
                      onClick={() => handleComercioSelect(comercio)}
                    >
                      <td style={tdStyle}>{comercio.rut_comercio}</td>
                      <td style={tdStyle}>{comercio.nombre_comercio}</td>
                      <td style={tdStyle}>{comercio.rubro}</td>
                      <td style={tdStyle}>{formatCurrency(comercio.saldo_acumulado)}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle(comercio.estado)}>{comercio.estado}</span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          style={btnVerStyle}
                          onMouseEnter={(e) => e.target.style.background = '#1a4f80'}
                          onMouseLeave={(e) => e.target.style.background = '#2563a0'}
                        >
                          Ver
                        </button>
                        {comercio.estado !== 'BAJA' && (
                          <button
                            style={btnBajaStyle}
                            onMouseEnter={(e) => e.target.style.background = '#8b1a1a'}
                            onMouseLeave={(e) => e.target.style.background = '#b52b2b'}
                          >
                            Baja
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={pagerStyle}>
                <span>Mostrando {filteredComercios.length} de {comercios.length} comercios</span>
              </div>
            </div>
          </div>

          {/* Panel derecho - Detalle */}
          <div>
            {selectedComercio ? (
              <div style={panelStyle}>
                <div style={panelHeaderStyle}>Detalle del comercio seleccionado</div>

                <div style={detailSectionStyle}>
                  <div style={detailTitleStyle}>Datos del establecimiento</div>
                  <div style={detailGridStyle}>
                    <div style={detailFieldStyle}>
                      <div style={detailLblStyle}>Nombre</div>
                      <div style={detailValStyle}>{selectedComercio.nombre_comercio}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={detailLblStyle}>RUT</div>
                      <div style={detailValStyle}>{selectedComercio.rut_comercio}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={detailLblStyle}>Rubro</div>
                      <div style={detailValStyle}>{selectedComercio.rubro}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={detailLblStyle}>Teléfono</div>
                      <div style={detailValStyle}>{selectedComercio.telefono}</div>
                    </div>
                    <div style={{ ...detailFieldStyle, gridColumn: '1/-1' }}>
                      <div style={detailLblStyle}>Dirección</div>
                      <div style={detailValStyle}>{selectedComercio.direccion}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={detailLblStyle}>Responsable</div>
                      <div style={detailValStyle}>{selectedComercio.responsable}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={detailLblStyle}>Estado</div>
                      <div style={detailValStyle}>
                        <span style={badgeStyle(selectedComercio.estado)}>
                          {selectedComercio.estado}
                        </span>
                      </div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={detailLblStyle}>Fecha de registro</div>
                      <div style={detailValStyle}>{formatDate(selectedComercio.fecha_registro)}</div>
                    </div>
                  </div>
                  <div style={saldoBoxStyle}>
                    <div style={saldoLabelStyle}>Saldo acumulado por ventas</div>
                    <div style={saldoValorStyle}>{formatCurrency(selectedComercio.saldo_acumulado)}</div>
                  </div>
                </div>

                <div style={detailSectionStyle}>
                  <div style={detailTitleStyle}>Últimas transacciones recibidas</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginTop: '6px' }}>
                    <thead>
                      <tr>
                        <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '4px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Fecha</th>
                        <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '4px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Beneficiario</th>
                        <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '4px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Monto</th>
                        <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '4px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Método</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comercioDetalle?.historial_ventas && comercioDetalle.historial_ventas.length > 0 ? (
                        comercioDetalle.historial_ventas.slice(0, 5).map((venta, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '4px 8px', border: '1px solid #eee', color: '#333' }}>
                              {formatDate(venta.fecha)}
                            </td>
                            <td style={{ padding: '4px 8px', border: '1px solid #eee', color: '#333' }}>
                              {venta.nombre_familia || 'N/A'}
                            </td>
                            <td style={{ padding: '4px 8px', border: '1px solid #eee', color: '#333' }}>
                              {formatCurrency(venta.monto)}
                            </td>
                            <td style={{ padding: '4px 8px', border: '1px solid #eee', color: '#333' }}>
                              {venta.metodo_pago || 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ padding: '8px', border: '1px solid #eee', color: '#999', textAlign: 'center' }}>
                            Sin transacciones registradas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={detailSectionStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: 0 }}>
                    <button
                      style={{
                        background: '#b52b2b',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '3px',
                        padding: '7px 16px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#8b1a1a'}
                      onMouseLeave={(e) => e.target.style.background = '#b52b2b'}
                    >
                      Dar de baja
                    </button>
                    <button
                      style={{
                        background: '#1e7a3e',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '3px',
                        padding: '7px 18px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#157a3e'}
                      onMouseLeave={(e) => e.target.style.background = '#1e7a3e'}
                    >
                      Editar datos
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={panelStyle}>
                <div style={panelHeaderStyle}>Detalle del comercio seleccionado</div>
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Selecciona un comercio para ver detalles
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComerciosPage;
