function DashboardHeader({ currentPage = 'dashboard', onLogout, onNavigate }) {
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

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = today.toLocaleDateString('es-ES', options);
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  // Mapeamos los elementos con sus rutas reales correspondientes en App.jsx
  const NAV_ITEMS = [
    { label: 'Inicio', page: 'dashboard', path: '/dashboard' },
    { label: 'Beneficiarios', page: 'beneficiarios', path: '/beneficiarios' },
    { label: 'Comercios', page: 'comercios', path: '/comercios' },
    { label: 'Carga de Fondos', page: 'fondos', path: '/fondos' },
    { label: 'Transacciones', page: 'transacciones', path: '/transacciones' },
    { label: 'Aprobaciones', page: 'aprobaciones', path: '/aprobaciones', requiereJefatura: true },
    { label: 'Funcionarios', page: 'funcionarios', path: '/funcionarios', requiereJefatura: true },
  ];

  const navItemsVisibles = NAV_ITEMS.filter(item => {
    if (item.requiereJefatura) {
      return adminRol === 'JEFATURA';
    }
    return true;
  });

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#1a3a5c] p-[10px_16px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="w-[44px] h-[44px] bg-[#ffffff] rounded-[4px] flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="#1a3a5c" />
              <text x="18" y="23" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                UCN
              </text>
            </svg>
          </div>
          <div>
            <div className="text-[#ffffff] text-[15px] font-bold leading-[1.2]">iLLAPEL</div>
            <div className="text-[#aac8e8] text-[11px]">Municipalidad · Illapel te ayuda</div>
          </div>
        </div>
        <div className="flex items-center gap-[12px] justify-end">
          <div className="text-right text-[#ffffff] text-[11px] leading-[1.5]">
            <div className="font-bold">{adminName}</div>
            <div className="text-[10px]">{adminRol}</div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#d32f2f] text-[#ffffff] border-none p-[6px_12px] rounded-[3px] text-[11px] cursor-pointer font-bold transition-colors hover:bg-[#b71c1c]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="bg-[#2563a0] flex items-center gap-0">
        {navItemsVisibles.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleNavigation(item.path)}
            className={`text-[#ffffff] text-[13px] p-[9px_18px] cursor-pointer border-r border-[#ffffff]/15 transition-colors ${
              currentPage === item.page ? 'bg-[#1a4f80]' : 'bg-transparent hover:bg-[#1a4f80]'
            }`}
          >
            {item.label}
          </div>
        ))}
      </nav>

      {/* Date bar */}
      <div className="bg-[#f5f5f2] p-[6px_16px] text-[12px] text-[#555555] border-b border-[#dddddd]">
        {capitalizedDate}
      </div>
    </>
  );
}

export default DashboardHeader;