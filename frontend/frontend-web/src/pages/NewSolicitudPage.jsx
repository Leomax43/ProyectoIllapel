import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';
import solicitudesService from '../services/solicitudesService';

const NewSolicitudPage = ({ onNavigate }) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Datos del beneficiario principal (que se convertirá en primer integrante)
  const [beneficiario, setBeneficiario] = useState({
    nombres: '',
    apellidos: '',
    rut: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    rol_en_hogar: 'Jefa de hogar',
    clave_acceso: ''
  });

  // Tabla de integrantes adicionales (pareja, hijos, etc.)
  const [integrantesAdicionales, setIntegrantesAdicionales] = useState([]);

  const handleBeneficiarioChange = (field, value) => {
    setBeneficiario(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegranteChange = (id, field, value) => {
    setIntegrantesAdicionales(prev =>
      prev.map(int => int.id === id ? { ...int, [field]: value } : int)
    );
  };

  const agregarIntegrante = () => {
    const newId = Math.max(...integrantesAdicionales.map(i => i.id), 0) + 1;
    setIntegrantesAdicionales(prev => [
      ...prev,
      { id: newId, nombre_completo: '', rut: '', parentesco: 'Cónyuge', fecha_nacimiento: '' }
    ]);
  };

  const eliminarIntegrante = (id) => {
    setIntegrantesAdicionales(prev => prev.filter(int => int.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validación básica
      if (!beneficiario.nombres || !beneficiario.apellidos || !beneficiario.rut || !beneficiario.direccion || !beneficiario.fecha_nacimiento) {
        throw new Error('Faltan campos obligatorios del beneficiario principal');
      }

      if (integrantesAdicionales.some(int => !int.nombre_completo || !int.parentesco || !int.fecha_nacimiento)) {
        throw new Error('Completa todos los campos de los integrantes adicionales');
      }

      // 1. Crear familia
      const familiaPayload = {
        rut_representante: beneficiario.rut,
        nombre_familia: `Familia ${beneficiario.apellidos}`,
        telefono: beneficiario.telefono,
        direccion: beneficiario.direccion,
        clave_acceso: beneficiario.clave_acceso || '1234' // Default password
      };

      const familiaRes = await solicitudesService.crearFamilia(familiaPayload);
      const id_familia = familiaRes.familia.id_familia;

      // 2. Crear primer integrante (beneficiario principal)
      const primerIntegrantePayload = {
        nombre_completo: `${beneficiario.nombres} ${beneficiario.apellidos}`,
        rut: beneficiario.rut,
        parentesco: beneficiario.rol_en_hogar,
        fecha_nacimiento: beneficiario.fecha_nacimiento
      };
      await solicitudesService.agregarIntegrante(id_familia, primerIntegrantePayload);

      // 3. Crear integrantes adicionales (si hay)
      for (const integrante of integrantesAdicionales) {
        const integrantePayload = {
          nombre_completo: `${integrante.nombre_completo}`,
          rut: integrante.rut || null,
          parentesco: integrante.parentesco,
          fecha_nacimiento: integrante.fecha_nacimiento
        };
        await solicitudesService.agregarIntegrante(id_familia, integrantePayload);
      }

      setMessage({ text: '✅ Solicitud creada exitosamente', type: 'success' });
      
      // Limpiar formulario
      setTimeout(() => {
        setBeneficiario({
          nombres: '',
          apellidos: '',
          rut: '',
          fecha_nacimiento: '',
          telefono: '',
          direccion: '',
          rol_en_hogar: 'Jefa de hogar',
          clave_acceso: ''
        });
        setIntegrantesAdicionales([]);
        // Volver a beneficiarios
        onNavigate('beneficiarios');
      }, 2000);

    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onNavigate('beneficiarios');
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

  const alertStyle = (type) => ({
    background: type === 'error' ? '#ffebee' : '#e8f5e9',
    border: `1px solid ${type === 'error' ? '#ffcdd2' : '#c8e6c9'}`,
    borderRadius: '3px',
    padding: '8px 12px',
    fontSize: '12px',
    color: type === 'error' ? '#c62828' : '#2e7d32',
    marginBottom: '14px'
  });

  const formCardStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '14px'
  };

  const formCardHeaderStyle = {
    background: '#2563a0',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '8px 14px'
  };

  const formCardBodyStyle = {
    padding: '16px'
  };

  const fieldsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px'
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#444',
    fontWeight: 'bold'
  };

  const requiredStyle = {
    color: '#b52b2b'
  };

  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '6px 9px',
    fontSize: '12px',
    color: '#333',
    width: '100%',
    fontFamily: 'Arial, sans-serif'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
    marginTop: '8px'
  };

  const thStyle = {
    background: '#e8f0f8',
    color: '#1a3a5c',
    padding: '6px 10px',
    textAlign: 'left',
    border: '1px solid #ddd',
    fontWeight: 'bold'
  };

  const tdStyle = {
    padding: '6px 10px',
    border: '1px solid #eee',
    color: '#333'
  };

  const inputTableStyle = {
    ...inputStyle,
    border: 'none',
    background: 'transparent',
    padding: '4px'
  };

  const selectTableStyle = {
    ...inputTableStyle,
    color: '#333'
  };

  const btnAddStyle = {
    marginTop: '8px',
    background: '#fff',
    border: '1px solid #2563a0',
    color: '#2563a0',
    borderRadius: '3px',
    padding: '5px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const btnRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px'
  };

  const btnCancelStyle = {
    background: '#fff',
    border: '1px solid #aaa',
    color: '#555',
    borderRadius: '3px',
    padding: '8px 20px',
    fontSize: '13px',
    cursor: 'pointer'
  };

  const btnSubmitStyle = {
    background: '#2563a0',
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1
  };

  const deleteStyle = {
    color: '#b52b2b',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px'
  };

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="beneficiarios" onLogout={logout} onNavigate={onNavigate} />

      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Ingresar nueva solicitud</div>
        <div style={sectionDescStyle}>
          Complete los datos del beneficiario principal que solicita el beneficio. Si la solicitud incluye otros miembros del núcleo familiar (pareja, hijos, etc.), agréguelos en la segunda sección. La cuenta quedará en estado "Pendiente" hasta ser aprobada por la Jefatura.
        </div>

        {message && (
          <div style={alertStyle(message.type)}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Sección 1: Datos del beneficiario */}
          <div style={formCardStyle}>
            <div style={formCardHeaderStyle}>1. Datos del beneficiario principal</div>
            <div style={formCardBodyStyle}>
              <div style={fieldsGridStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Nombres <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Rosa María"
                    style={inputStyle}
                    value={beneficiario.nombres}
                    onChange={(e) => handleBeneficiarioChange('nombres', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Apellidos <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Martínez Ríos"
                    style={inputStyle}
                    value={beneficiario.apellidos}
                    onChange={(e) => handleBeneficiarioChange('apellidos', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    RUT <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 12.345.678-9"
                    style={inputStyle}
                    value={beneficiario.rut}
                    onChange={(e) => handleBeneficiarioChange('rut', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Fecha de nacimiento <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={beneficiario.fecha_nacimiento}
                    onChange={(e) => handleBeneficiarioChange('fecha_nacimiento', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Teléfono de contacto</label>
                  <input
                    type="text"
                    placeholder="Ej: +56 9 1234 5678"
                    style={inputStyle}
                    value={beneficiario.telefono}
                    onChange={(e) => handleBeneficiarioChange('telefono', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Dirección <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Calle, número, villa"
                    style={inputStyle}
                    value={beneficiario.direccion}
                    onChange={(e) => handleBeneficiarioChange('direccion', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Rol en el hogar <span style={requiredStyle}>*</span>
                  </label>
                  <select
                    style={inputStyle}
                    value={beneficiario.rol_en_hogar}
                    onChange={(e) => handleBeneficiarioChange('rol_en_hogar', e.target.value)}
                  >
                    <option>Jefa de hogar</option>
                    <option>Jefe de hogar</option>
                    <option>Cónyuge</option>
                    <option>Hijo/a</option>
                    <option>Padre/Madre</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Núcleo familiar - Integrantes adicionales */}
          <div style={formCardStyle}>
            <div style={formCardHeaderStyle}>2. Otros integrantes del núcleo familiar (opcional)</div>
            <div style={formCardBodyStyle}>
              <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>
                Si la solicitud incluye otros miembros (pareja, hijos, etc.), agréguelos aquí:
              </label>
              {integrantesAdicionales.length > 0 && (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Nombres y apellidos</th>
                      <th style={thStyle}>RUT</th>
                      <th style={thStyle}>Parentesco</th>
                      <th style={thStyle}>Fecha de nacimiento</th>
                      <th style={thStyle}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {integrantesAdicionales.map((integrante) => (
                      <tr key={integrante.id}>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            placeholder="Nombre completo"
                            style={inputTableStyle}
                            value={integrante.nombre_completo}
                            onChange={(e) =>
                              handleIntegranteChange(integrante.id, 'nombre_completo', e.target.value)
                            }
                          />
                        </td>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            placeholder="RUT"
                            style={inputTableStyle}
                            value={integrante.rut}
                            onChange={(e) =>
                              handleIntegranteChange(integrante.id, 'rut', e.target.value)
                            }
                          />
                        </td>
                        <td style={tdStyle}>
                          <select
                            style={selectTableStyle}
                            value={integrante.parentesco}
                            onChange={(e) =>
                              handleIntegranteChange(integrante.id, 'parentesco', e.target.value)
                            }
                          >
                            <option>Cónyuge</option>
                            <option>Hijo/a</option>
                            <option>Padre/Madre</option>
                            <option>Otro</option>
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <input
                            type="date"
                            style={inputTableStyle}
                            value={integrante.fecha_nacimiento}
                            onChange={(e) =>
                              handleIntegranteChange(integrante.id, 'fecha_nacimiento', e.target.value)
                            }
                          />
                        </td>
                        <td style={{ ...tdStyle, ...deleteStyle }}>
                          <span onClick={() => eliminarIntegrante(integrante.id)}>✕</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                type="button"
                style={btnAddStyle}
                onClick={agregarIntegrante}
                onMouseEnter={(e) => { e.target.style.background = '#f0f6ff'; }}
                onMouseLeave={(e) => { e.target.style.background = '#fff'; }}
              >
                + Agregar integrante
              </button>
            </div>
          </div>

          {/* Botones */}
          <div style={btnRowStyle}>
            <button
              type="button"
              style={btnCancelStyle}
              onClick={handleCancel}
              disabled={loading}
              onMouseEnter={(e) => { if (!loading) e.target.style.background = '#f5f5f5'; }}
              onMouseLeave={(e) => { if (!loading) e.target.style.background = '#fff'; }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={btnSubmitStyle}
              disabled={loading}
              onMouseEnter={(e) => { if (!loading) e.target.style.background = '#1a4f80'; }}
              onMouseLeave={(e) => { if (!loading) e.target.style.background = '#2563a0'; }}
            >
              {loading ? 'Guardando...' : 'Enviar solicitud →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSolicitudPage;
