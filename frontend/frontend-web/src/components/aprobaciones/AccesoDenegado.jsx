import React from 'react';
import DashboardHeader from '../dashboard/DashboardHeader';

const AccesoDenegado = ({ logout, navigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      <DashboardHeader currentPage="dashboard" onLogout={logout} onNavigate={navigate} />
      <div className="p-[20px] max-w-[600px] m-[40px_auto] bg-[#ffffff] border border-[#dddddd] rounded-[4px] text-center shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <div className="text-[32px] mb-[10px]">🚫</div>
        <div className="text-[16px] font-bold text-[#b52b2b] mb-[8px]">Acceso Denegado</div>
        <div className="text-[13px] text-[#666666] mb-[20px]">
          Esta sección está reservada exclusivamente para perfiles de Jefatura con privilegios de aprobación financiera.
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-[#2563a0] border-none text-[#ffffff] rounded-[3px] p-[8px_20px] text-[13px] font-bold cursor-pointer transition-colors hover:bg-[#1a4f80]"
        >
          Volver al Panel Principal
        </button>
      </div>
    </div>
  );
};

export default AccesoDenegado;