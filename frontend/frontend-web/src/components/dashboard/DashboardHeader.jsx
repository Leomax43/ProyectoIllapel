import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function DashboardHeader({ onLogout }) {
  // Inicializamos los hooks de navegación y ubicación actual
  const navigate = useNavigate();
  const location = useLocation();
  
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
      window.location.href = '/login'; // Nos aseguramos de mandarlo al login
    }
  };

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = today.toLocaleDateString('es-ES', options);
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  // ¡NUEVO! Mapeamos los botones directamente a las URLs de tu App.jsx
  const NAV_ITEMS = [
    { label: 'Inicio', path: '/' },
    { label: 'Beneficiarios', path: '/beneficiarios' },
    { label: 'Comercios', path: '/comercios' },
    { label: 'Carga de Fondos', path: '/fondos' },
    { label: 'Transacciones', path: '/transacciones' },
    { label: 'Aprobaciones', path: '/aprobaciones' }
  ];

  // Si no es jefatura, ocultamos la pestaña de Aprobaciones
  const navItemsVisibles = NAV_ITEMS.filter(item => {
    if (item.label === 'Aprobaciones' && adminRol !== 'JEFATURA') {
      return false;
    }
    return true;
  });

  return (
    <div style={{ borderBottom: '1px solid #ddd' }}>
      {/* Top bar azul oscuro */}
      <div style={{
        background: '#1a3a5c',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#fff',
            color: '#1a3a5c',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            UCN
          </div>
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ILLAPEL</div>
            <div style={{ fontSize: '10px', color: '#a0bce0' }}>Municipalidad · Illapel te ayuda</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{adminName}</div>
            <div style={{ fontSize: '10px', color: '#a0bce0' }}>{adminRol}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: '#d32f2f',
              border: 'none',
              color: '#fff',
              padding: '4px 12px',
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
        {navItemsVisibles.map((item, idx) => {
          
          // ¡MAGIA DE REACT ROUTER! 
          // Verificamos si la URL del navegador coincide con el path del botón para pintarlo oscuro
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);

          return (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              style={{
                color: '#fff',
                fontSize: '13px',
                padding: '9px 18px',
                cursor: 'pointer',
                borderRight: '1px solid rgba(255,255,255,0.15)',
                background: isActive ? '#1a4f80' : 'transparent',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => { if (!isActive) e.target.style.background = '#1a4f80'; }}
              onMouseLeave={(e) => { if (!isActive) e.target.style.background = 'transparent'; }}
            >
              {item.label}
            </div>
          );
        })}
      </nav>
      
      <div style={{ padding: '8px 20px', background: '#fff', fontSize: '11px', color: '#666', borderBottom: '1px solid #eee' }}>
        {capitalizedDate}
      </div>
    </div>
  );
}

export default DashboardHeader;