import DashboardHeader from '../dashboard/DashboardHeader';
import DashboardFooter from '../dashboard/DashboardFooter';

const AccesoDenegado = ({ logout, navigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="dashboard" onLogout={logout} />
      <div className="p-[20px] max-w-[600px] mx-auto mt-[40px] bg-white border border-gris-borde rounded-[6px] text-center shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <div className="text-[32px] mb-[10px]">🚫</div>
        <div className="text-[16px] font-bold text-[#b52b2b] mb-[8px]">Acceso Denegado</div>
        <div className="text-[13px] text-gris-texto mb-[20px]">
          Esta sección está reservada exclusivamente para perfiles de Jefatura con privilegios de aprobación financiera.
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-azul text-white border-none rounded-[3px] px-[20px] py-[8px] text-[13px] font-bold cursor-pointer hover:brightness-110"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          Volver al Panel Principal
        </button>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default AccesoDenegado;