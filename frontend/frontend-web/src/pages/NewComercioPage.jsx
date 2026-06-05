import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';
import comerciosService from '../services/comerciosService';

const NewComercioPage = ({ onNavigate }) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [comercio, setComercio] = useState({
    nombre_comercio: '',
    rut: '',
    responsable: '',
    telefono: '',
    rubro: 'Seleccione...',
    direccion: '',
    clave_acceso: ''
  });

  const handleChange = (field, value) => {
    setComercio(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validación básica
      if (!comercio.nombre_comercio || !comercio.rut || !comercio.responsable || !comercio.telefono || comercio.rubro === 'Seleccione...' || !comercio.direccion) {
        throw new Error('Faltan campos obligatorios');
      }

      // Llamada a la API
      const payload = {
        rut_comercio: comercio.rut,
        nombre_comercio: comercio.nombre_comercio,
        rubro: comercio.rubro,
        direccion: comercio.direccion,
        responsable: comercio.responsable,
        telefono: comercio.telefono
      };

      await comerciosService.crearComercio(payload);

      setMessage({ text: '✅ Comercio registrado exitosamente', type: 'success' });

      setTimeout(() => {
        setComercio({
          nombre_comercio: '',
          rut: '',
          responsable: '',
          telefono: '',
          rubro: 'Seleccione...',
          direccion: '',
          clave_acceso: ''
        });
        onNavigate('comercios');
      }, 2000);

    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onNavigate('comercios');
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
    fontFamily: 'Arial, sans-serif'
  };

  const selectStyle = {
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '6px 9px',
    fontSize: '12px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    background: '#fff'
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
    padding: '7px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 'normal'
  };

  const btnSubmitStyle = {
    background: '#2563a0',
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '7px 18px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="comercios" onNavigate={onNavigate} />
      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Registrar nuevo comercio</div>
        <div style={sectionDescStyle}>
          Complete los datos del comercio a registrar en el sistema.
        </div>

        {message && (
          <div style={alertStyle(message.type)}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={formCardStyle}>
            <div style={formCardHeaderStyle}>Datos del establecimiento</div>
            <div style={formCardBodyStyle}>
              <div style={fieldsGridStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Nombre del comercio <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Minimarket Don Pedro"
                    style={inputStyle}
                    value={comercio.nombre_comercio}
                    onChange={(e) => handleChange('nombre_comercio', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    RUT del comercio <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 76.123.456-7"
                    style={inputStyle}
                    value={comercio.rut}
                    onChange={(e) => handleChange('rut', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Nombre del responsable <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    style={inputStyle}
                    value={comercio.responsable}
                    onChange={(e) => handleChange('responsable', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Teléfono <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+56 9 ..."
                    style={inputStyle}
                    value={comercio.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Rubro <span style={requiredStyle}>*</span>
                  </label>
                  <select
                    style={selectStyle}
                    value={comercio.rubro}
                    onChange={(e) => handleChange('rubro', e.target.value)}
                  >
                    <option>Seleccione...</option>
                    <option>Alimentación</option>
                    <option>Construcción</option>
                    <option>Útiles escolares</option>
                    <option>Farmacia</option>
                    <option>Ropa y accesorios</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Dirección <span style={requiredStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Calle y número"
                    style={inputStyle}
                    value={comercio.direccion}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

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
              {loading ? 'Guardando...' : 'Registrar comercio →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComercioPage;
