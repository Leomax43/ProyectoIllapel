function DashboardHeader({ currentPage = 'inicio', onLogout, onNavigate }) {
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
      window.location.href = '/';
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

  const NAV_ITEMS = [
    { label: 'Inicio', page: 'dashboard' },
    { label: 'Beneficiarios', page: 'beneficiarios' },
    { label: 'Comercios', page: 'comercios' },
    { label: 'Carga de Fondos', page: 'fondos' },
    { label: 'Transacciones', page: 'transacciones' },
    { label: 'Aprobaciones', page: 'aprobaciones', requiereJefatura: true },
    { label: 'Funcionarios', page: 'funcionarios', requiereJefatura: true },
  ];

  // Filtrar items según el rol
  const navItemsVisibles = NAV_ITEMS.filter(item => {
    if (item.requiereJefatura) {
      return adminRol === 'JEFATURA';
    }
    return true;
  });

  return (
    <>
      {/* Top bar */}
      <div style={{ background: '#1a3a5c', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '44px', height: '44px', background: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="#1a3a5c" />
              <text x="18" y="23" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
                UCN
              </text>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.2' }}>iLLAPEL</div>
            <div style={{ color: '#aac8e8', fontSize: '11px' }}>Municipalidad · Illapel te ayuda</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right', color: '#fff', fontSize: '11px', lineHeight: '1.5' }}>
            <div style={{ fontWeight: 'bold' }}>{adminName}</div>
            <div style={{ fontSize: '10px' }}>{adminRol}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: '#d32f2f',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '3px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#b71c1c'; }}
            onMouseLeave={(e) => { e.target.style.background = '#d32f2f'; }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Nav bar */}
      <nav style={{ background: '#2563a0', display: 'flex', alignItems: 'center', gap: '0' }}>
        {navItemsVisibles.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleNavigation(item.page)}
            style={{
              color: '#fff',
              fontSize: '13px',
              padding: '9px 18px',
              cursor: 'pointer',
              borderRight: '1px solid rgba(255,255,255,0.15)',
              background: currentPage === item.page ? '#1a4f80' : 'transparent',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => { if (currentPage !== item.page) e.target.style.background = '#1a4f80'; }}
            onMouseLeave={(e) => { if (currentPage !== item.page) e.target.style.background = 'transparent'; }}
          >
            {item.label}
          </div>
        ))}
      </nav>

      {/* Date bar */}
      <div style={{ background: '#f5f5f2', padding: '6px 16px', fontSize: '12px', color: '#555', borderBottom: '1px solid #ddd' }}>
        {capitalizedDate}
      </div>
    </>
  );
}

export default DashboardHeader;
