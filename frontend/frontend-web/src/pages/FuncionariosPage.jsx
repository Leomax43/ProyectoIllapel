import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import { useAuth } from '../hooks/useAuth';
import { useFuncionarios } from '../hooks/useFuncionarios';
import { ROLES } from '../utils/permissions';

const FuncionariosPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const adminRol = localStorage.getItem('adminRol');
  
  const { 
    funcionario, 
    loading, 
    message, 
    handleChange, 
    registrarFuncionario 
  } = useFuncionarios();

  // Protección de ruta
  if (adminRol !== ROLES.JEFATURA && adminRol !== ROLES.SUPER_ADMIN) {
    return (
      <div className="flex flex-col min-h-screen bg-gris-bg">
        <DashboardHeader currentPage="funcionarios" onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white border border-gris-borde rounded-[6px] p-[40px] text-center max-w-[500px]">
            <div className="text-[32px] mb-[10px]">🚫</div>
            <div className="text-[16px] font-bold text-[#b52b2b] mb-[8px]">Acceso denegado</div>
            <div className="text-[13px] text-gris-texto mb-[20px]">
              Solo Jefatura y Super Admin pueden registrar funcionarios.
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-azul text-white border-none rounded-[3px] px-[20px] py-[8px] text-[13px] font-bold cursor-pointer hover:brightness-110"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              Volver al Panel Principal
            </button>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  // Determinar qué roles puede crear según el rol del usuario logueado
  const rolesDisponibles = adminRol === ROLES.SUPER_ADMIN
    ? [
        { value: 'ASISTENTE_SOCIAL', label: 'Asistente Social (Carga de datos y solicitudes)' },
        { value: 'ENCARGADO_COMERCIOS', label: 'Encargado de comercios (Solo comercios y transacciones)' },
        { value: 'JEFATURA', label: 'Jefatura (Aprobaciones y control total)' },
      ]
    : [
        { value: 'ASISTENTE_SOCIAL', label: 'Asistente Social (Carga de datos y solicitudes)' },
        { value: 'ENCARGADO_COMERCIOS', label: 'Encargado de comercios (Solo comercios y transacciones)' },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="funcionarios" onLogout={logout} />
      
      <div className="p-[18px_20px] flex-1 max-w-[800px] mx-auto w-full">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Registrar Funcionario Municipal</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              {adminRol === ROLES.SUPER_ADMIN 
                ? 'Cree accesos para nuevos asistentes sociales, encargados de comercios o personal de jefatura.' 
                : 'Cree accesos para nuevos asistentes sociales o encargados de comercios.'}
            </div>
          </div>
        </div>

        {message && (
          <div className={`border rounded-[3px] p-[8px_12px] text-[12px] mb-[14px] ${
            message.type === 'error' 
              ? 'bg-[#ffebee] border-[#ffcdd2] text-[#c62828]' 
              : 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={registrarFuncionario}>
          <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
            {/* HEADER */}
            <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
              <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
              Datos de acceso al sistema
            </div>
            
            <div className="p-[16px]">
              {/* RUT */}
              <div className="flex flex-col gap-[4px] mb-[12px]">
                <label className="text-[11px] text-gris-texto font-bold">RUT del funcionario *</label>
                <input 
                  type="text" 
                  placeholder="Ej: 15.123.456-7" 
                  value={funcionario.rut} 
                  onChange={(e) => handleChange('rut', e.target.value)} 
                  className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] outline-none focus:border-verde"
                  style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                />
              </div>

              {/* NOMBRE */}
              <div className="flex flex-col gap-[4px] mb-[12px]">
                <label className="text-[11px] text-gris-texto font-bold">Nombre completo *</label>
                <input 
                  type="text" 
                  placeholder="Ej: Juan Pérez Gómez" 
                  value={funcionario.nombre_completo} 
                  onChange={(e) => handleChange('nombre_completo', e.target.value)} 
                  className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] outline-none focus:border-verde"
                  style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                />
              </div>

              {/* ROL */}
              <div className="flex flex-col gap-[4px] mb-[12px]">
                <label className="text-[11px] text-gris-texto font-bold">Nivel de Permisos *</label>
                <select 
                  value={funcionario.rol} 
                  onChange={(e) => handleChange('rol', e.target.value)}
                  className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] text-gris-texto outline-none"
                  style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                >
                  {rolesDisponibles.map(rol => (
                    <option key={rol.value} value={rol.value}>{rol.label}</option>
                  ))}
                </select>
              </div>

              {/* CONTRASEÑA */}
              <div className="flex flex-col gap-[4px] mb-[12px]">
                <label className="text-[11px] text-gris-texto font-bold">Contraseña de acceso *</label>
                <input 
                  type="password" 
                  placeholder="Establezca una contraseña inicial" 
                  value={funcionario.clave} 
                  onChange={(e) => handleChange('clave', e.target.value)} 
                  className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] outline-none focus:border-verde"
                  style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-verde text-white border-none rounded-[3px] px-[20px] py-[8px] text-[12px] font-bold cursor-pointer hover:brightness-110 disabled:bg-[#cccccc] disabled:cursor-not-allowed"
                style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
              >
                {loading ? 'Registrando...' : 'Crear cuenta de funcionario'}
              </button>

            </div>
          </div>
        </form>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default FuncionariosPage;