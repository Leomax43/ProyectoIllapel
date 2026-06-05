import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';

const AprobacionesPage = ({ onNavigate }) => {
  const { logout, user } = useAuth();
  const adminRol = localStorage.getItem('adminRol');
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [showRechazoInput, setShowRechazoInput] = useState(false);

  // Protección: Si no es JEFATURA, redirigir al dashboard
  if (adminRol !== 'JEFATURA') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#f5f5f2'
      }}>
        <DashboardHeader currentPage="dashboard" onLogout={logout} onNavigate={onNavigate} />
        <div style={{
          padding: '16px',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#d32f2f',
              marginBottom: '16px'
            }}>
              🔒 Acceso denegado
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              La sección de <strong>Aprobaciones</strong> es exclusiva para administradores con rol <strong>JEFATURA</strong>.
              <br /><br />
              Tu rol actual: <strong>{adminRol || 'No especificado'}</strong>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              style={{
                background: '#2563a0',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '3px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Simular carga de solicitudes pendientes
    const mockSolicitudes = [
      {
        id_familia: 1,
        nombre_familia: 'Rosa Martínez Ríos',
        rut_representante: '12.345.678-9',
        estado: 'PENDIENTE',
        integrantes: 3,
        fecha_ingreso: '2026-05-16',
        nombre_responsable: 'Rosa Martínez Ríos',
        direccion: 'Los Aromos 432, Villa El Sauce, Illapel',
        fecha_nacimiento: '1978-03-12',
        telefono: '+56 9 8765 4321',
        detalles: 'Familia en situación de vulnerabilidad socioeconómica. Requiere apoyo para adquirir alimentos y materiales básicos del hogar. El jefe de hogar se encuentra desempleado desde enero de 2026.'
      },
      {
        id_familia: 2,
        nombre_familia: 'Juan Pérez Fuentes',
        rut_representante: '9.876.543-2',
        estado: 'PENDIENTE',
        integrantes: 5,
        fecha_ingreso: '2026-05-15',
        nombre_responsable: 'Juan Pérez Fuentes',
        direccion: 'Avenida Principal 123',
        fecha_nacimiento: '1975-06-20',
        telefono: '+56 9 1234 5678',
        detalles: 'Solicitud para apoyo alimentario y escolar de los hijos.'
      }
    ];
    
    try {
      setLoading(true);
      setSolicitudes(mockSolicitudes);
      if (mockSolicitudes.length > 0) {
        setSelectedSolicitud(mockSolicitudes[0]);
      }
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const alertStyle = {
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '3px',
    padding: '7px 12px',
    fontSize: '12px',
    color: '#856404',
    marginBottom: '14px'
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: '14px',
    alignItems: 'start'
  };

  const panelStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden'
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

  const badgeCountStyle = {
    background: '#e67e1a',
    color: '#fff',
    borderRadius: '20px',
    fontSize: '11px',
    padding: '2px 9px',
    fontWeight: 'bold'
  };

  const searchBarStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    gap: '8px'
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

  const solicitudItemStyle = (isSelected) => ({
    padding: '10px 14px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    background: isSelected ? '#e0edff' : 'transparent',
    borderLeft: isSelected ? '3px solid #2563a0' : '3px solid transparent',
    transition: 'background 0.1s'
  });

  const badgeStyle = (estado) => {
    const estilos = {
      'PENDIENTE': { background: '#fff3cd', color: '#856404' },
      'ACTIVO': { background: '#d1e7dd', color: '#0f5132' },
      'RECHAZADO': { background: '#f8d7da', color: '#842029' }
    };
    const estilo = estilos[estado] || estilos['PENDIENTE'];
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

  const detailSectionStyle = {
    padding: '14px',
    borderBottom: '1px solid #eee'
  };

  const detailTitleStyle = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#2563a0',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const detailGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  };

  const detailFieldStyle = {
    fontSize: '12px'
  };

  const labelStyle = {
    color: '#888',
    fontSize: '11px',
    marginBottom: '2px'
  };

  const valueStyle = {
    color: '#222',
    fontWeight: 'bold'
  };

  const motivoBoxStyle = {
    background: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '3px',
    padding: '8px 10px',
    fontSize: '12px',
    color: '#444',
    marginTop: '4px',
    lineHeight: '1.5'
  };

  const actionAreaStyle = {
    padding: '14px',
    background: '#f9f9f9',
    borderTop: '2px solid #ddd'
  };

  const actionLabelStyle = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#444',
    marginBottom: '8px'
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '10px'
  };

  const btnAprobadoStyle = {
    flex: 1,
    background: '#1e7a3e',
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '9px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  const btnRechazarStyle = {
    flex: 1,
    background: '#b52b2b',
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '9px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  const rechazoInputStyle = {
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '6px 9px',
    fontSize: '12px',
    marginTop: '8px'
  };

  const footerStyle = {
    textAlign: 'center',
    padding: '10px',
    fontSize: '11px',
    color: '#999',
    background: '#f5f5f2'
  };

  const handleAprobar = () => {
    if (!selectedSolicitud) return;
    console.log('✔ Aprobando solicitud:', selectedSolicitud.id_familia);
    // Aquí iría la llamada al backend para aprobar
    alert(`✔ Solicitud de ${selectedSolicitud.nombre_familia} aprobada correctamente.`);
    setShowRechazoInput(false);
    setMotivoRechazo('');
  };

  const handleRechazar = () => {
    if (!selectedSolicitud) return;
    if (!motivoRechazo.trim()) {
      alert('Debe especificar el motivo del rechazo');
      return;
    }
    console.log('✖ Rechazando solicitud:', selectedSolicitud.id_familia, 'Motivo:', motivoRechazo);
    // Aquí iría la llamada al backend para rechazar
    alert(`✖ Solicitud de ${selectedSolicitud.nombre_familia} rechazada.\nMotivo: ${motivoRechazo}`);
    setShowRechazoInput(false);
    setMotivoRechazo('');
  };

  const filteredSolicitudes = solicitudes.filter(sol => {
    const matchSearch = sol.nombre_familia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       sol.rut_representante.includes(searchTerm);
    const matchEstado = estadoFiltro === 'todos' || sol.estado === estadoFiltro;
    return matchSearch && matchEstado;
  });

  const pendientes = solicitudes.filter(s => s.estado === 'PENDIENTE').length;

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="aprobaciones" onLogout={logout} onNavigate={onNavigate} />

      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Bandeja de aprobaciones</div>
        <div style={sectionDescStyle}>
          Revise las solicitudes ingresadas por la Asistente Social. Puede aprobar o rechazar cada cuenta tras verificar la documentación adjunta.
        </div>

        <div style={alertStyle}>
          🔒 Esta sección es de acceso exclusivo para Jefatura. Solo usted puede cambiar el estado de una solicitud a "Activo".
        </div>

        <div style={layoutStyle}>
          {/* Panel izquierdo: Lista de solicitudes */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              Solicitudes pendientes
              <span style={badgeCountStyle}>{pendientes} pendientes</span>
            </div>
            <div style={searchBarStyle}>
              <input
                type="text"
                placeholder="Buscar por nombre o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                style={selectStyle}
              >
                <option value="todos">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="ACTIVO">Aprobado</option>
                <option value="RECHAZADO">Rechazado</option>
              </select>
            </div>

            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                Cargando solicitudes...
              </div>
            ) : filteredSolicitudes.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
                No hay solicitudes disponibles
              </div>
            ) : (
              filteredSolicitudes.map((sol) => (
                <div
                  key={sol.id_familia}
                  style={solicitudItemStyle(selectedSolicitud?.id_familia === sol.id_familia)}
                  onClick={() => setSelectedSolicitud(sol)}
                  onMouseEnter={(e) => {
                    if (selectedSolicitud?.id_familia !== sol.id_familia) {
                      e.currentTarget.style.background = '#f0f6ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSolicitud?.id_familia !== sol.id_familia) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a3a5c' }}>
                      {sol.nombre_familia}
                    </span>
                    <span style={badgeStyle(sol.estado)}>
                      {sol.estado === 'ACTIVO' ? 'Aprobado' : sol.estado === 'RECHAZADO' ? 'Rechazado' : 'Pendiente'}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>
                    RUT: {sol.rut_representante}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#444' }}>
                      Fam. · {sol.integrantes} integrantes
                    </span>
                    <span style={{ fontSize: '11px', color: '#888' }}>
                      Ingresada: {new Date(sol.fecha_ingreso).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panel derecho: Detalle de solicitud */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>Detalle de solicitud seleccionada</div>

            {!selectedSolicitud ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
                Seleccione una solicitud para ver los detalles
              </div>
            ) : (
              <>
                <div style={detailSectionStyle}>
                  <div style={detailTitleStyle}>Datos del beneficiario</div>
                  <div style={detailGridStyle}>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>Nombre completo</div>
                      <div style={valueStyle}>{selectedSolicitud.nombre_responsable}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>RUT</div>
                      <div style={valueStyle}>{selectedSolicitud.rut_representante}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>Fecha de nacimiento</div>
                      <div style={valueStyle}>{new Date(selectedSolicitud.fecha_nacimiento).toLocaleDateString('es-CL')}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>Teléfono</div>
                      <div style={valueStyle}>{selectedSolicitud.telefono}</div>
                    </div>
                    <div style={{ ...detailFieldStyle, gridColumn: '1/-1' }}>
                      <div style={labelStyle}>Dirección</div>
                      <div style={valueStyle}>{selectedSolicitud.direccion}</div>
                    </div>
                  </div>
                </div>

                <div style={detailSectionStyle}>
                  <div style={detailTitleStyle}>Motivo de la solicitud</div>
                  <div style={motivoBoxStyle}>
                    {selectedSolicitud.detalles}
                  </div>
                </div>

                <div style={actionAreaStyle}>
                  <div style={actionLabelStyle}>Resolución de la solicitud:</div>
                  <div style={actionButtonsStyle}>
                    <button style={btnAprobadoStyle} onClick={handleAprobar}>
                      ✔ Aprobar cuenta
                    </button>
                    <button style={btnRechazarStyle} onClick={() => setShowRechazoInput(!showRechazoInput)}>
                      ✖ Rechazar solicitud
                    </button>
                  </div>
                  {showRechazoInput && (
                    <input
                      type="text"
                      style={rechazoInputStyle}
                      placeholder="Motivo del rechazo (obligatorio al rechazar)..."
                      value={motivoRechazo}
                      onChange={(e) => setMotivoRechazo(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && motivoRechazo.trim()) {
                          handleRechazar();
                        }
                      }}
                    />
                  )}
                  {showRechazoInput && (
                    <button
                      style={{
                        width: '100%',
                        marginTop: '8px',
                        background: '#b52b2b',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '3px',
                        padding: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={handleRechazar}
                    >
                      Confirmar rechazo
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={footerStyle}>Illapel te ayuda · Municipalidad de Illapel · Universidad Católica del Norte</div>
    </div>
  );
};

export default AprobacionesPage;
