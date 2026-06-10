import { useState } from 'react';

function BeneficiariesTable({ 
  beneficiarios = [], 
  currentPage = 1, 
  totalPages = 1, 
  totalRecords = 0, 
  recordsPerPage = 8,
  onNextPage = () => {},
  onPrevPage = () => {},
  searchTerm = '',
  onSearchChange = () => {},
  onSearchSubmit = () => {} // Nueva prop recibida desde la página principal
}) {
  const getActionButtons = (estado) => {
    const buttons = ['Ver'];
    if (estado?.toUpperCase() === 'PENDIENTE') {
      buttons.push('Aprobar');
    } else if (estado?.toUpperCase() === 'ACTIVO') {
      buttons.push('Fondos');
    }
    return buttons;
  };

  const startRecord = totalRecords > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={{ background: '#2563a0', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>
            Excel
          </button>
          <button style={{ background: '#2563a0', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>
            CSV
          </button>
          <button style={{ background: '#2563a0', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>
            PDF
          </button>
        </div>
        
        {/* Formulario contenedor que controla el evento sin refrescar la página */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555' }}
        >
          Buscar:{' '}
          <input
            type="text"
            placeholder="Nombre, RUT..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              border: '1px solid #ccc',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '12px',
              width: '130px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2563a0',
              color: '#fff',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '3px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Buscar
          </button>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr>
            <th style={{ background: '#2563a0', color: '#fff', padding: '8px 10px', textAlign: 'left', fontWeight: 'normal' }}>RUT</th>
            <th style={{ background: '#2563a0', color: '#fff', padding: '8px 10px', textAlign: 'left', fontWeight: 'normal' }}>Beneficiario</th>
            <th style={{ background: '#2563a0', color: '#fff', padding: '8px 10px', textAlign: 'left', fontWeight: 'normal' }}>Núcleo familiar</th>
            <th style={{ background: '#2563a0', color: '#fff', padding: '8px 10px', textAlign: 'left', fontWeight: 'normal' }}>Saldo actual</th>
            <th style={{ background: '#2563a0', color: '#fff', padding: '8px 10px', textAlign: 'left', fontWeight: 'normal' }}>Última carga</th>
            <th style={{ background: '#2563a0', color: '#fff', padding: '8px 10px', textAlign: 'left', fontWeight: 'normal' }}>Estado</th>
            <th style={{ background: '#2563a0', color: '#fff', padding: '8px 10px', textAlign: 'left', fontWeight: 'normal' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {beneficiarios.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '16px', color: '#999', fontSize: '12px' }}>
                No hay beneficiarios para mostrar
              </td>
            </tr>
          ) : (
            beneficiarios.map((beneficiario) => (
              <tr key={beneficiario.id_familia} style={{ cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f6ff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>{beneficiario.rut_representante}</td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>{beneficiario.nombre_familia}</td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>Fam. {beneficiario.nombre_familia?.split(' ')[0]}</td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>${(beneficiario.saldo || 0).toLocaleString('es-CL')}</td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>—</td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    ...(beneficiario.estado?.toUpperCase() === 'ACTIVO'
                      ? { background: '#d1e7dd', color: '#0f5132' }
                      : beneficiario.estado?.toUpperCase() === 'PENDIENTE'
                        ? { background: '#fff3cd', color: '#856404' }
                        : beneficiario.estado?.toUpperCase() === 'BAJA'
                          ? { background: '#f8d7da', color: '#842029' }
                          : { background: '#e9ecef', color: '#555' })
                  }}>
                    {beneficiario.estado?.charAt(0).toUpperCase() + beneficiario.estado?.slice(1).toLowerCase()}
                  </span>
                </td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>
                  {getActionButtons(beneficiario.estado).map((btn) => (
                    <button
                      key={btn}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#fff',
                        marginRight: '3px',
                        background:
                          btn === 'Ver'
                            ? '#2563a0'
                            : btn === 'Aprobar'
                              ? '#1e7a3e'
                              : '#c47f00',
                      }}
                    >
                      {btn}
                    </button>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ padding: '8px 12px', fontSize: '12px', color: '#555', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
        <span>Mostrando registros del {startRecord} al {endRecord} de un total de {totalRecords} registros</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            style={{
              padding: '3px 8px',
              borderRadius: '3px',
              fontSize: '11px',
              border: '1px solid #ccc',
              background: currentPage === 1 ? '#e0e0e0' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              color: currentPage === 1 ? '#999' : '#333',
            }}
          >
            Anterior
          </button>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
            {currentPage} de {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '3px 8px',
              borderRadius: '3px',
              fontSize: '11px',
              border: '1px solid #ccc',
              background: currentPage >= totalPages ? '#e0e0e0' : '#fff',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              color: currentPage >= totalPages ? '#999' : '#333',
            }}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeneficiariesTable;