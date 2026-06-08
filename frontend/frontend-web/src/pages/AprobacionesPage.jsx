import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';

const AprobacionesPage = ({ onNavigate }) => {
  const { logout } = useAuth();
  const adminRol = localStorage.getItem('adminRol');
  
  // Obtenemos el ID de la jefatura para registrar quién aprueba/rechaza
  const userStr = localStorage.getItem('illapel_token');
  const idJefatura = userStr ? JSON.parse(userStr).id_admin : localStorage.getItem('id_admin') || 2; 

  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [showRechazoInput, setShowRechazoInput] = useState(false);

  // Protección: Si no es JEFATURA, redirigir
  if (adminRol !== 'JEFATURA') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f2' }}>
        <DashboardHeader currentPage="dashboard" onLogout={logout} onNavigate={onNavigate} />
        <div style={{ padding: '40px', textAlign: 'center', color: '#b52b2b', fontWeight: 'bold' }}>
          Acceso denegado. Solo Jefatura puede acceder a la bandeja de aprobaciones de fondos.
        </div>
      </div>
    );
  }

  // Cargar solicitudes pendientes al entrar a la página
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/aprobaciones/fondos/pendientes');
      const data = await response.json();
      
      if (response.ok) {
        setSolicitudes(data.solicitudes || []);
        if (data.solicitudes && data.solicitudes.length > 0) {
          setSelectedSolicitud(data.solicitudes[0]);
        } else {
          setSelectedSolicitud(null);
        }
      } else {
        throw new Error(data.mensaje);
      }
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Procesar Aprobación
  const handleAprobar = async (idCarga) => {
    setBtnLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`http://localhost:3000/api/aprobaciones/fondos/${idCarga}/aprobar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_jefatura: idJefatura })
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Solicitud aprobada. Los fondos han sido transferidos a la cuenta de la familia.' });
        setTimeout(() => {
          setMessage(null);
          fetchSolicitudes(); // Recargar la lista
        }, 2000);
      } else {
        throw new Error(data.mensaje);
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setBtnLoading(false);
    }
  };

  // Procesar Rechazo
  const handleRechazar = async (idCarga) => {
    if (!motivoRechazo.trim()) {
      alert('Debe ingresar un motivo para rechazar la solicitud.');
      return;
    }
    
    setBtnLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`http://localhost:3000/api/aprobaciones/fondos/${idCarga}/rechazar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_jefatura: idJefatura }) // Podríamos pasar el motivo también al backend si agregas la columna
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '❌ Solicitud rechazada correctamente. Los saldos no se alteraron.' });
        setShowRechazoInput(false);
        setMotivoRechazo('');
        setTimeout(() => {
          setMessage(null);
          fetchSolicitudes(); // Recargar la lista
        }, 2000);
      } else {
        throw new Error(data.mensaje);
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setBtnLoading(false);
    }
  };

  // Estilos y utilidades
  const filteredSolicitudes = solicitudes.filter(sol => {
    return sol.nombre_familia.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sol.rut_representante.includes(searchTerm);
  });

  const mainStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f2' };
  const contentStyle = { padding: '16px', flex: 1 };
  const sectionTitleStyle = { fontSize: '16px', fontWeight: 'bold', color: '#1a3a5c', marginBottom: '4px' };
  const sectionDescStyle = { fontSize: '12px', color: '#666', marginBottom: '14px' };
  const layoutStyle = { display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '14px', alignItems: 'start' };
  const panelStyle = { background: '#fff', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' };
  const panelHeaderStyle = { background: '#2563a0', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const badgeCountStyle = { background: '#e67e1a', color: '#fff', borderRadius: '20px', fontSize: '11px', padding: '2px 9px', fontWeight: 'bold' };
  const searchBarStyle = { padding: '8px 12px', borderBottom: '1px solid #eee', display: 'flex', gap: '8px' };
  const inputStyle = { flex: 1, border: '1px solid #ccc', borderRadius: '3px', padding: '5px 9px', fontSize: '12px' };
  const solicitudItemStyle = (isSelected) => ({ padding: '10px 14px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: isSelected ? '#e0edff' : 'transparent', borderLeft: isSelected ? '3px solid #2563a0' : '3px solid transparent', transition: 'background 0.1s' });
  const detailSectionStyle = { padding: '14px', borderBottom: '1px solid #eee' };
  const detailTitleStyle = { fontSize: '12px', fontWeight: 'bold', color: '#2563a0', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const detailGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' };
  const detailFieldStyle = { fontSize: '12px' };
  const labelStyle = { color: '#888', fontSize: '11px', marginBottom: '2px' };
  const valueStyle = { color: '#222', fontWeight: 'bold' };
  const motivoBoxStyle = { background: '#f9f9f9', border: '1px solid #eee', borderRadius: '3px', padding: '8px 10px', fontSize: '12px', color: '#444', marginTop: '4px', lineHeight: '1.5' };
  const actionAreaStyle = { padding: '14px', background: '#f9f9f9', borderTop: '2px solid #ddd' };
  const actionLabelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#444', marginBottom: '8px' };
  const actionButtonsStyle = { display: 'flex', gap: '10px' };
  
  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="aprobaciones" onLogout={logout} onNavigate={onNavigate} />

      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Bandeja de aprobaciones</div>
        <div style={sectionDescStyle}>
          Revise las solicitudes de fondos ingresadas por las Asistentes Sociales. Puede autorizar o rechazar cada petición.
        </div>

        {message && (
          <div style={{ 
            background: message.type === 'error' ? '#ffebee' : '#e8f5e9',
            border: `1px solid ${message.type === 'error' ? '#ffcdd2' : '#c8e6c9'}`,
            color: message.type === 'error' ? '#c62828' : '#2e7d32',
            padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '12px'
          }}>
            {message.text}
          </div>
        )}

        <div style={layoutStyle}>
          {/* Panel izquierdo: Lista de solicitudes reales */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              Solicitudes pendientes
              <span style={badgeCountStyle}>{solicitudes.length} en espera</span>
            </div>
            <div style={searchBarStyle}>
              <input
                type="text"
                placeholder="Buscar por nombre o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
            </div>

            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                Conectando con servidor...
              </div>
            ) : filteredSolicitudes.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: '13px' }}>
                No hay solicitudes pendientes en este momento.
              </div>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {filteredSolicitudes.map((sol) => (
                  <div
                    key={sol.id_carga}
                    style={solicitudItemStyle(selectedSolicitud?.id_carga === sol.id_carga)}
                    onClick={() => setSelectedSolicitud(sol)}
                    onMouseEnter={(e) => {
                      if (selectedSolicitud?.id_carga !== sol.id_carga) e.currentTarget.style.background = '#f0f6ff';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSolicitud?.id_carga !== sol.id_carga) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a3a5c' }}>
                        {sol.nombre_familia}
                      </span>
                      <span style={{ fontWeight: 'bold', color: '#1e7a3e', fontSize: '12px' }}>
                        ${parseInt(sol.monto).toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>
                      RUT: {sol.rut_representante}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                      <span style={{ fontSize: '11px', color: '#444' }}>
                        Solicitante: {sol.nombre_asistente || 'Asistente'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#888' }}>
                        {new Date(sol.fecha).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel derecho: Detalle de solicitud seleccionada de la base de datos */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>Auditoría de Caso Social</div>

            {!selectedSolicitud ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
                Seleccione una solicitud para proceder con la auditoría
              </div>
            ) : (
              <>
                <div style={detailSectionStyle}>
                  <div style={detailTitleStyle}>Datos de la Carga de Fondos</div>
                  <div style={detailGridStyle}>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>Núcleo Familiar</div>
                      <div style={valueStyle}>{selectedSolicitud.nombre_familia}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>RUT Representante</div>
                      <div style={valueStyle}>{selectedSolicitud.rut_representante}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>Monto Solicitado</div>
                      <div style={{...valueStyle, color: '#1e7a3e', fontSize: '14px'}}>${parseInt(selectedSolicitud.monto).toLocaleString('es-CL')}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>Línea de Ayuda (Motivo)</div>
                      <div style={valueStyle}>{selectedSolicitud.motivo || 'No especificado'}</div>
                    </div>
                    <div style={detailFieldStyle}>
                      <div style={labelStyle}>Asistente a cargo</div>
                      <div style={valueStyle}>{selectedSolicitud.nombre_asistente || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div style={detailSectionStyle}>
                  <div style={detailTitleStyle}>Justificación y Observaciones</div>
                  <div style={motivoBoxStyle}>
                    {selectedSolicitud.detalles || 'No se registraron observaciones adicionales al momento de crear la solicitud.'}
                  </div>
                </div>

                <div style={actionAreaStyle}>
                  <div style={actionLabelStyle}>Resolución Técnica:</div>
                  <div style={actionButtonsStyle}>
                    <button 
                      style={{ flex: 1, background: '#1e7a3e', border: 'none', color: '#fff', borderRadius: '3px', padding: '9px', fontSize: '13px', fontWeight: 'bold', cursor: btnLoading ? 'not-allowed' : 'pointer' }} 
                      onClick={() => handleAprobar(selectedSolicitud.id_carga)}
                      disabled={btnLoading}
                    >
                      {btnLoading ? 'Procesando...' : '✔ Aprobar y Transferir'}
                    </button>
                    <button 
                      style={{ flex: 1, background: '#b52b2b', border: 'none', color: '#fff', borderRadius: '3px', padding: '9px', fontSize: '13px', fontWeight: 'bold', cursor: btnLoading ? 'not-allowed' : 'pointer' }} 
                      onClick={() => setShowRechazoInput(!showRechazoInput)}
                      disabled={btnLoading}
                    >
                      ✖ Rechazar
                    </button>
                  </div>
                  
                  {showRechazoInput && (
                    <input
                      type="text"
                      style={{ width: '100%', border: '1px solid #ccc', borderRadius: '3px', padding: '6px 9px', fontSize: '12px', marginTop: '8px' }}
                      placeholder="Escriba el motivo del rechazo (obligatorio)..."
                      value={motivoRechazo}
                      onChange={(e) => setMotivoRechazo(e.target.value)}
                    />
                  )}
                  {showRechazoInput && (
                    <button
                      style={{ width: '100%', marginTop: '8px', background: '#b52b2b', border: 'none', color: '#fff', borderRadius: '3px', padding: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => handleRechazar(selectedSolicitud.id_carga)}
                      disabled={btnLoading}
                    >
                      Confirmar rechazo de solicitud
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AprobacionesPage;