import { useNavigate } from 'react-router-dom';

function DashboardHeader({ currentPage = 'dashboard', onLogout }) {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'USUARIO';
  const adminRol = localStorage.getItem('adminRol') || 'ADMIN';

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('illapel_token');
      localStorage.removeItem('illapel_user');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRol');
      window.location.href = '/login';
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = today.toLocaleDateString('es-ES', options);
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const NAV_ITEMS = [
    { label: 'Inicio', page: 'dashboard', path: '/dashboard' },
    { label: 'Beneficiarios', page: 'beneficiarios', path: '/beneficiarios' },
    { label: 'Comercios', page: 'comercios', path: '/comercios' },
    { label: 'Carga de Fondos', page: 'fondos', path: '/fondos' },
    { label: 'Transacciones', page: 'transacciones', path: '/transacciones' },
  ];

  const NAV_ITEMS_JEFATURA = [
    { label: 'Aprobaciones', page: 'aprobaciones', path: '/aprobaciones' },
    { label: 'Funcionarios', page: 'funcionarios', path: '/funcionarios' },
  ];

  const adminRolUpper = adminRol.toUpperCase();
  const esJefatura = adminRolUpper === 'ADMIN' || adminRolUpper === 'JEFATURA';

  // Obtener iniciales para el avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const allNavItems = esJefatura
    ? [...NAV_ITEMS, ...NAV_ITEMS_JEFATURA]
    : NAV_ITEMS;

  return (
    <div>
      {/* TOP BAR — Fondo azul */}
      <div className="bg-azul flex items-center justify-between h-[62px] px-[20px]">
        <div className="flex items-center gap-[14px]">
          {/* Logo oficial Municipalidad de Illapel */}
          <img 
            src="https://municipalidadillapel.cl/app/uploads/2023/10/logo-white.png" 
            alt="Municipalidad de Illapel" 
            className="h-[42px] w-auto"
          />

          {/* Separador vertical */}
          <div className="w-[1px] h-[24px] bg-white/25"></div>

          {/* Texto del logo */}
          <div>
            <div className="text-white text-[13px] font-semibold leading-tight">Municipalidad de Illapel</div>
            <div className="text-celeste text-[11px] font-light">Illapel te ayuda · Sistema de ayudas sociales</div>
          </div>
        </div>

        {/* Área del usuario + Logout */}
        <div className="flex items-center gap-[10px]">
          <div className="text-right text-white text-[11px] leading-snug">
            <div className="text-[11px] font-medium">{adminName}</div>
            <div className="text-celeste text-[10px] font-light">{adminRol}</div>
          </div>
          <div className="w-[34px] h-[34px] bg-verde rounded-full flex items-center justify-center text-white font-bold text-[13px]">
            {getInitials(adminName)}
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#d32f2f] text-white border-none px-[12px] py-[6px] rounded-[3px] text-[11px] cursor-pointer font-bold transition-colors hover:bg-[#b71c1c] ml-[4px]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* NAV BAR — Fondo verde */}
      <nav className="bg-verde flex items-stretch">
        {allNavItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleNavigation(item.path)}
            className={`text-white text-[12px] font-medium px-[18px] flex items-center cursor-pointer border-r border-white/15 h-[38px] tracking-[0.3px] ${
              currentPage === item.page ? 'bg-black/18' : 'hover:bg-black/12'
            }`}
          >
            {item.label}
          </div>
        ))}
      </nav>

      {/* ACCENT BAR — Degradado de 4px */}
      <div className="h-[4px] bg-gradient-to-r from-amarillo via-celeste to-verde"></div>

      {/* BREADCRUMB */}
      <div className="bg-white px-[20px] py-[7px] text-[11px] text-gris-claro border-b border-gris-borde flex justify-between items-center">
        <div>
          Inicio <span className="text-azul font-semibold">&rsaquo; Resumen del sistema</span>
        </div>
        <div className="text-[#aaa] text-[11px]">{capitalizedDate}</div>
      </div>
    </div>
  );
}

export default DashboardHeader;