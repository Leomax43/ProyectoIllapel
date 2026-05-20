import React from 'react';

const BeneficiariesStats = ({ stats }) => {
  const pillStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'normal'
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
      <div style={{ ...pillStyle, background: '#e0edff', color: '#1a3a5c' }}>
        <span style={{ fontWeight: 'bold' }}>{stats.total_registrados}</span>
        <span>total registrados</span>
      </div>
      <div style={{ ...pillStyle, background: '#d1e7dd', color: '#0f5132' }}>
        <span style={{ fontWeight: 'bold' }}>{stats.activos}</span>
        <span>activos</span>
      </div>
      <div style={{ ...pillStyle, background: '#fff3cd', color: '#856404' }}>
        <span style={{ fontWeight: 'bold' }}>{stats.pendientes}</span>
        <span>pendientes</span>
      </div>
      <div style={{ ...pillStyle, background: '#f8d7da', color: '#842029' }}>
        <span style={{ fontWeight: 'bold' }}>{stats.bajas}</span>
        <span>dados de baja</span>
      </div>
    </div>
  );
};

export default BeneficiariesStats;
