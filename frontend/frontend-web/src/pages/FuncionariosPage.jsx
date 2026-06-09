// src/pages/FuncionariosPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';
import { useFuncionarios } from '../hooks/useFuncionarios';

const FuncionariosPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const adminRol = localStorage.getItem('adminRol');
  
  // Consumimos toda la lógica modularizada desde nuestro hook
  const { 
    funcionario, 
    loading, 
    message, 
    handleChange, 
    registrarFuncionario 
  } = useFuncionarios();

  // Protección de ruta
  if (adminRol !== 'JEFATURA') {
    return (
      <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
        <DashboardHeader currentPage="funcionarios" onLogout={logout} onNavigate={navigate} />
        <div className="p-[40px] text-center text-[#b52b2b] font-bold">
          Acceso denegado. Solo Jefatura puede registrar funcionarios.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      <DashboardHeader currentPage="funcionarios" onLogout={logout} onNavigate={navigate} />
      
      <div className="p-[16px] flex-1 max-w-[800px] m-[0_auto] w-full">
        <div className="text-[16px] font-bold text-[#1a3a5c] mb-[4px]">
          Registrar Funcionario Municipal
        </div>
        <div className="text-[12px] text-[#666666] mb-[16px]">
          Cree accesos para nuevos asistentes sociales o personal de jefatura.
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
          <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
            <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
              Datos de acceso al sistema
            </div>
            
            <div className="p-[16px]">
              
              <div className="flex flex-col gap-[4px] mb-[12px]">
                <label className="text-[11px] color-[#444444] font-bold">RUT del funcionario *</label>
                <input 
                  type="text" 
                  placeholder="Ej: 15.123.456-7" 
                  className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] font-sans focus:outline-none focus:border-[#2563a0]" 
                  value={funcionario.rut} 
                  onChange={(e) => handleChange('rut', e.target.value)} 
                />
              </div>

              <div className="flex flex-col gap-[4px] mb-[12px]">
                <label className="text-[11px] color-[#444444] font-bold">Nombre completo *</label>
                <input 
                  type="text" 
                  placeholder="Ej: Juan Pérez Gómez" 
                  className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] font-sans focus:outline-none focus:border-[#2563a0]" 
                  value={funcionario.nombre_completo} 
                  onChange={(e) => handleChange('nombre_completo', e.target.value)} 
                />
              </div>

              <div className="flex flex-col gap-[4px] mb-[12px]">
                <label className="text-[11px] color-[#444444] font-bold">Nivel de Permisos *</label>
                <select 
                  className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] bg-white font-sans focus:outline-none focus:border-[#2563a0]" 
                  value={funcionario.rol} 
                  onChange={(e) => handleChange('rol', e.target.value)}
                >
                  <option value="ASISTENTE_SOCIAL">Asistente Social (Carga de datos y solicitudes)</option>
                  <option value="JEFATURA">Jefatura (Aprobaciones y control total)</option>
                </select>
              </div>

              <div className="flex flex-col gap-[4px] mb-[12px]">
                <label className="text-[11px] color-[#444444] font-bold">Contraseña de acceso *</label>
                <input 
                  type="password" 
                  placeholder="Establezca una contraseña inicial" 
                  className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] font-sans focus:outline-none focus:border-[#2563a0]" 
                  value={funcionario.clave} 
                  onChange={(e) => handleChange('clave', e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1e7a3e] border-none text-[#ffffff] rounded-[3px] p-[8px_20px] text-[12px] font-bold cursor-pointer transition-colors hover:bg-[#156130] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
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