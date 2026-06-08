import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';
import adminService from '../services/adminService';

const FuncionariosPage = ({ onNavigate }) => {
  const { logout } = useAuth();
  const adminRol = localStorage.getItem('adminRol');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [funcionario, setFuncionario] = useState({
    rut: '',
    nombre_completo: '',
    rol: 'ASISTENTE_SOCIAL',
    clave: ''
  });

  // Protección de ruta: Si no es Jefatura, mostramos acceso denegado
  if (adminRol !== 'JEFATURA') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f2' }}>
        <DashboardHeader currentPage="funcionarios" onLogout={logout} onNavigate={onNavigate} />
        <div style={{ padding: '40px', textAlign: 'center', color: '#b52b2b', fontWeight: 'bold' }}>
          Acceso denegado. Solo Jefatura puede registrar funcionarios.
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setFuncionario(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!funcionario.rut || !funcionario.nombre_completo || !funcionario.clave) {
        throw new Error('Por favor, complete todos los campos obligatorios.');
      }

      // Llamada al backend
      await adminService.registrarFuncionario(funcionario);

      setMessage({ text: '✅ Funcionario registrado exitosamente en el sistema.', type: 'success' });
      
      // Limpiamos el formulario
      setTimeout(() => {
        setFuncionario({ rut: '', nombre_completo: '', rol: 'ASISTENTE_SOCIAL', clave: '' });
        setMessage(null);
      }, 3000);

    } catch (error) {
      setMessage({ text: `❌ ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Estilos
  const mainStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f2' };
  const contentStyle = { padding: '16px', flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%' };
  const alertStyle = (type) => ({ background: type === 'error' ? '#ffebee' : '#e8f5e9', border: `1px solid ${type === 'error' ? '#ffcdd2' : '#c8e6c9'}`, borderRadius: '3px', padding: '8px 12px', fontSize: '12px', color: type === 'error' ? '#c62828' : '#2e7d32', marginBottom: '14px' });
  const formCardStyle = { background: '#fff', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' };
  const formCardHeaderStyle = { background: '#2563a0', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '8px 14px' };
  const formCardBodyStyle = { padding: '16px' };
  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' };
  const labelStyle = { fontSize: '11px', color: '#444', fontWeight: 'bold' };
  const inputStyle = { border: '1px solid #ccc', borderRadius: '3px', padding: '6px 9px', fontSize: '12px', color: '#333' };
  const btnSubmitStyle = { background: '#1e7a3e', border: 'none', color: '#fff', borderRadius: '3px', padding: '8px 20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="funcionarios" onLogout={logout} onNavigate={onNavigate} />
      
      <div style={contentStyle}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a3a5c', marginBottom: '4px' }}>
          Registrar Funcionario Municipal
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
          Cree accesos para nuevos asistentes sociales o personal de jefatura.
        </div>

        {message && <div style={alertStyle(message.type)}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formCardStyle}>
            <div style={formCardHeaderStyle}>Datos de acceso al sistema</div>
            <div style={formCardBodyStyle}>
              
              <div style={fieldStyle}>
                <label style={labelStyle}>RUT del funcionario *</label>
                <input 
                  type="text" 
                  placeholder="Ej: 15.123.456-7" 
                  style={inputStyle} 
                  value={funcionario.rut} 
                  onChange={(e) => handleChange('rut', e.target.value)} 
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Nombre completo *</label>
                <input 
                  type="text" 
                  placeholder="Ej: Juan Pérez Gómez" 
                  style={inputStyle} 
                  value={funcionario.nombre_completo} 
                  onChange={(e) => handleChange('nombre_completo', e.target.value)} 
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Nivel de Permisos *</label>
                <select 
                  style={inputStyle} 
                  value={funcionario.rol} 
                  onChange={(e) => handleChange('rol', e.target.value)}
                >
                  <option value="ASISTENTE_SOCIAL">Asistente Social (Carga de datos y solicitudes)</option>
                  <option value="JEFATURA">Jefatura (Aprobaciones y control total)</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Contraseña de acceso *</label>
                <input 
                  type="password" 
                  placeholder="Establezca una contraseña inicial" 
                  style={inputStyle} 
                  value={funcionario.clave} 
                  onChange={(e) => handleChange('clave', e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                style={btnSubmitStyle} 
                disabled={loading}
                onMouseEnter={(e) => { if(!loading) e.target.style.background = '#157a3e' }}
                onMouseLeave={(e) => { if(!loading) e.target.style.background = '#1e7a3e' }}
              >
                {loading ? 'Registrando...' : 'Crear cuenta de funcionario'}
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuncionariosPage;