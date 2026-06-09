import React from 'react';

const BeneficiariesList = ({ 
  beneficiaries, 
  searchTerm, 
  estadoFilter, 
  onSearchChange, 
  onEstadoChange,
  onSelectBeneficiary,
  selectedBeneficiaryId,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onNewSolicitud
}) => {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  const formatRUT = (rut) => {
    return rut;
  };

  const getStateBadgeStyle = (estado) => {
    const badgeStyle = {
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      display: 'inline-block'
    };

    if (estado === 'ACTIVO') {
      return { ...badgeStyle, background: '#d1e7dd', color: '#0f5132' };
    } else if (estado === 'PENDIENTE') {
      return { ...badgeStyle, background: '#fff3cd', color: '#856404' };
    } else if (estado === 'BAJA') {
      return { ...badgeStyle, background: '#f8d7da', color: '#842029' };
    }
    return badgeStyle;
  };

  const panelStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '14px'
  };

  const panelHeaderStyle = {
    background: '#2563a0',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '8px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const controlsRowStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap'
  };

  const inputStyle = {
    flex: '1',
    minWidth: '120px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '5px 9px',
    fontSize: '12px'
  };

  const selectStyle = {
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '5px 8px',
    fontSize: '12px',
    color: '#555'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px'
  };

  const thStyle = {
    background: '#2563a0',
    color: '#fff',
    padding: '7px 10px',
    textAlign: 'left',
    fontWeight: 'normal'
  };

  const tdStyle = {
    padding: '7px 10px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333'
  };

  const actionBtnStyle = {
    padding: '3px 9px',
    borderRadius: '3px',
    fontSize: '11px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    marginRight: '3px',
    background: '#2563a0'
  };

  const pagerStyle = {
    padding: '7px 12px',
    fontSize: '12px',
    color: '#555',
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #eee'
  };

  return (
    <div style={panelStyle}>
      <div style={panelHeaderStyle}>
        Listado de beneficiarios
        <button 
          type="button"
          onClick={() => onNewSolicitud && onNewSolicitud()}
          style={{ background: '#1e7a3e', border: 'none', color: '#fff', borderRadius: '3px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
          onMouseEnter={(e) => { e.target.style.background = '#165a2f'; }}
          onMouseLeave={(e) => { e.target.style.background = '#1e7a3e'; }}
        >
          + Nueva solicitud
        </button>
      </div>

      <div style={controlsRowStyle}>
        <input
          type="text"
          placeholder="Buscar por nombre, RUT o ficha..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={inputStyle}
        />
        <select value={estadoFilter} onChange={(e) => onEstadoChange(e.target.value)} style={selectStyle}>
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="BAJA">Baja</option>
        </select>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>RUT</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Núcleo familiar</th>
            <th style={thStyle}>Saldo</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((ben) => (
            <tr 
              key={ben.id_familia}
              style={{
                background: selectedBeneficiaryId === ben.id_familia ? '#e0edff' : 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => onSelectBeneficiary(ben)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f0f6ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = selectedBeneficiaryId === ben.id_familia ? '#e0edff' : 'transparent'}
            >
              <td style={tdStyle}>{formatRUT(ben.rut_representante)}</td>
              <td style={tdStyle}>{ben.nombre_familia}</td>
              <td style={tdStyle}>Fam. {ben.nombre_familia.split(' ')[1] || 'N/A'}</td>
              <td style={tdStyle}>{formatMoney(ben.saldo)}</td>
              <td style={tdStyle}>
                <span style={getStateBadgeStyle(ben.estado)}>{ben.estado}</span>
              </td>
              <td style={tdStyle}>
                <button style={actionBtnStyle}>Ver</button>
                {ben.estado === 'ACTIVO' && (
                  <button style={{ ...actionBtnStyle, background: '#c47f00' }}>Fondos</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={pagerStyle}>
        <span>Mostrando {beneficiaries.length} registros (Página {currentPage} de {totalPages})</span>
        <span>
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            style={{
              background: currentPage === 1 ? '#ccc' : '#2563a0',
              color: '#fff',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '3px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '11px',
              marginRight: '8px'
            }}
          >
            Anterior
          </button>
          <span style={{ marginRight: '8px' }}>{currentPage}</span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            style={{
              background: currentPage >= totalPages ? '#ccc' : '#2563a0',
              color: '#fff',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '3px',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: '11px'
            }}
          >
            Siguiente
          </button>
        </span>
      </div>
    </div>
  );
};

export default BeneficiariesList;
