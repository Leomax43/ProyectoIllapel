import React, { useState, useEffect } from 'react';
import beneficiariesService from '../../services/beneficiariesService';

const BeneficiaryDetail = ({ beneficiary, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('datos-personales');

  useEffect(() => {
    if (beneficiary) {
      fetchDetail();
    }
  }, [beneficiary]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await beneficiariesService.getBeneficiaryDetail(beneficiary.rut_representante);
      setDetail(data);
    } catch (error) {
      console.error('Error loading detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!beneficiary) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden',
        padding: '20px',
        textAlign: 'center',
        color: '#999'
      }}>
        Selecciona un beneficiario para ver detalles
      </div>
    );
  }

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
    padding: '8px 14px'
  };

  const tabsStyle = {
    display: 'flex',
    borderBottom: '2px solid #2563a0'
  };

  const tabStyle = (isActive) => ({
    padding: '7px 14px',
    fontSize: '12px',
    color: isActive ? '#2563a0' : '#555',
    cursor: 'pointer',
    borderBottom: isActive ? '2px solid #2563a0' : '2px solid transparent',
    marginBottom: isActive ? '-2px' : '-2px',
    background: isActive ? '#f0f6ff' : 'transparent',
    fontWeight: isActive ? 'bold' : 'normal'
  });

  const tabContentStyle = {
    padding: '13px 14px'
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
    marginBottom: '10px'
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

  const saldoRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '10px'
  };

  const saldoCardStyle = (isGreen) => ({
    border: '1px solid ' + (isGreen ? '#1e7a3e' : '#2563a0'),
    borderRadius: '4px',
    padding: '8px 12px',
    textAlign: 'center',
    background: isGreen ? '#d1e7dd' : '#e0edff'
  });

  const saldoLabelStyle = {
    fontSize: '10px',
    color: '#888',
    marginBottom: '3px'
  };

  const saldoValueStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a3a5c'
  };

  const actionBottomStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '12px 14px',
    borderTop: '1px solid #eee',
    background: '#f9f9f9'
  };

  const btnStyle = (color) => ({
    background: color,
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '7px 14px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: color !== '#b52b2b' ? 'bold' : 'normal'
  });

  if (loading) {
    return (
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>Detalle del beneficiario seleccionado</div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>Detalle del beneficiario seleccionado</div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Error al cargar datos
        </div>
      </div>
    );
  }

  const representante = detail.nucleo_familiar?.[0] || {};

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-CL');
  };

  const getFirstCargaDate = () => {
    const cargas = detail.historial_cargas || [];
    if (cargas.length === 0) return 'N/A';
    return formatDate(cargas[cargas.length - 1].fecha);
  };

  const getTotalRecibido = () => {
    const cargas = detail.historial_cargas || [];
    return cargas.reduce((sum, carga) => sum + carga.monto, 0);
  };

  return (
    <div style={panelStyle}>
      <div style={panelHeaderStyle}>Detalle del beneficiario seleccionado</div>

      <div style={tabsStyle}>
        <div
          style={tabStyle(activeTab === 'datos-personales')}
          onClick={() => setActiveTab('datos-personales')}
        >
          Datos personales
        </div>
        <div
          style={tabStyle(activeTab === 'nucleo-familiar')}
          onClick={() => setActiveTab('nucleo-familiar')}
        >
          Núcleo familiar
        </div>
        <div
          style={tabStyle(activeTab === 'historial')}
          onClick={() => setActiveTab('historial')}
        >
          Historial
        </div>
        <div
          style={tabStyle(activeTab === 'pin')}
          onClick={() => setActiveTab('pin')}
        >
          PIN
        </div>
        <div
          style={tabStyle(activeTab === 'documentos')}
          onClick={() => setActiveTab('documentos')}
        >
          Documentos
        </div>
      </div>

      <div style={tabContentStyle}>
        {activeTab === 'datos-personales' && (
          <>
            <div style={detailTitleStyle}>Información general</div>
            <div style={detailGridStyle}>
              <div style={detailFieldStyle}>
                <div style={detailLblStyle}>Nombre completo</div>
                <div style={detailValStyle}>{representante.nombre_completo || 'N/A'}</div>
              </div>
              <div style={detailFieldStyle}>
                <div style={detailLblStyle}>RUT</div>
                <div style={detailValStyle}>{beneficiary.rut_representante}</div>
              </div>
              <div style={detailFieldStyle}>
                <div style={detailLblStyle}>Fecha de nacimiento</div>
                <div style={detailValStyle}>
                  {formatDate(representante.fecha_nacimiento)} ({calculateAge(representante.fecha_nacimiento)} años)
                </div>
              </div>
              <div style={detailFieldStyle}>
                <div style={detailLblStyle}>Teléfono</div>
                <div style={detailValStyle}>{detail.datos_personales?.telefono || 'N/A'}</div>
              </div>
              <div style={{ ...detailFieldStyle, gridColumn: '1/-1' }}>
                <div style={detailLblStyle}>Dirección</div>
                <div style={detailValStyle}>{detail.datos_personales?.direccion || 'N/A'}</div>
              </div>
              <div style={detailFieldStyle}>
                <div style={detailLblStyle}>Estado de cuenta</div>
                <div style={detailValStyle}>
                  <span style={{
                    background: detail.datos_personales?.estado === 'ACTIVO' ? '#d1e7dd' : '#f8d7da',
                    color: detail.datos_personales?.estado === 'ACTIVO' ? '#0f5132' : '#842029',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {detail.datos_personales?.estado}
                  </span>
                </div>
              </div>
              <div style={detailFieldStyle}>
                <div style={detailLblStyle}>Fecha de registro</div>
                <div style={detailValStyle}>{getFirstCargaDate()}</div>
              </div>
            </div>

            <div style={detailTitleStyle}>Saldos</div>
            <div style={saldoRowStyle}>
              <div style={saldoCardStyle(false)}>
                <div style={saldoLabelStyle}>Saldo disponible</div>
                <div style={saldoValueStyle}>${beneficiary.saldo.toLocaleString('es-CL')}</div>
              </div>
              <div style={saldoCardStyle(true)}>
                <div style={saldoLabelStyle}>Total recibido</div>
                <div style={saldoValueStyle}>${getTotalRecibido().toLocaleString('es-CL')}</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'nucleo-familiar' && (
          <>
            <div style={detailTitleStyle}>Miembros del núcleo familiar</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '5px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '5px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Parentesco</th>
                  <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '5px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Edad</th>
                </tr>
              </thead>
              <tbody>
                {detail.nucleo_familiar && detail.nucleo_familiar.map((member, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '5px 8px', border: '1px solid #eee', color: '#333' }}>{member.nombre_completo}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #eee', color: '#333' }}>{member.parentesco || 'N/A'}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #eee', color: '#333' }}>
                      {calculateAge(member.fecha_nacimiento)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'historial' && (
          <>
            <div style={detailTitleStyle}>Historial de cargas</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '5px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Fecha</th>
                  <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '5px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Monto</th>
                  <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '5px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Motivo</th>
                  <th style={{ background: '#e8f0f8', color: '#1a3a5c', padding: '5px 8px', textAlign: 'left', border: '1px solid #ddd' }}>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {detail.historial_cargas && detail.historial_cargas.length > 0 ? (
                  detail.historial_cargas.map((carga, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '5px 8px', border: '1px solid #eee', color: '#333' }}>
                        {formatDate(carga.fecha)}
                      </td>
                      <td style={{ padding: '5px 8px', border: '1px solid #eee', color: '#333' }}>
                        ${carga.monto.toLocaleString('es-CL')}
                      </td>
                      <td style={{ padding: '5px 8px', border: '1px solid #eee', color: '#333' }}>
                        {carga.motivo || 'N/A'}
                      </td>
                      <td style={{ padding: '5px 8px', border: '1px solid #eee', color: '#333' }}>
                        {carga.responsable || 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '5px 8px', border: '1px solid #eee', color: '#999', textAlign: 'center' }}>
                      Sin registros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'pin' && (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            PIN - Funcionalidad pendiente (Implementación por Maximiliano)
          </div>
        )}

        {activeTab === 'documentos' && (
          <>
            <div style={detailTitleStyle}>Ficha Social</div>
            {detail.datos_personales?.pdf_ficha_social ? (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '12px',
                background: '#f9fafb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px' }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a3a5c', marginBottom: '3px' }}>
                      {detail.datos_personales.pdf_ficha_social.split('/').pop()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      Ficha Social - Creada el {formatDate(detail.datos_personales?.fecha_creacion)}
                    </div>
                  </div>
                  <a
                    href={`http://localhost:3000${detail.datos_personales.pdf_ficha_social}`}
                    download
                    style={{
                      background: '#2563a0',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#1a4f80'}
                    onMouseLeave={(e) => e.target.style.background = '#2563a0'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Descargar
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                border: '1px dashed #ddd',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                color: '#999',
                background: '#f9fafb'
              }}>
                📭 No hay ficha social adjunta para esta familia
              </div>
            )}
          </>
        )}
      </div>

      <div style={actionBottomStyle}>
        <button style={btnStyle('#b52b2b')}>Dar de baja</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={btnStyle('#c47f00')}>Cargar fondos</button>
          <button style={btnStyle('#2563a0')}>Editar datos</button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetail;
