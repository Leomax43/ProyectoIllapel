import React from 'react';

const CargaFondosDetail = ({ detalle, formatCurrency, formatDate }) => {
  if (!detalle) {
    return (
      <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
        {/* Cabecero restaurado al azul original #1a3a5c */}
        <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">Detalle de carga</div>
        <div className="p-[13px_14px] text-[#999999] text-center text-[12px]">
          Selecciona una carga para ver los detalles
        </div>
      </div>
    );
  }

  const getEstadoBadge = (estado) => {
    const normalizado = estado ? estado.toUpperCase() : 'PENDIENTE';
    const baseClass = "p-[2px_8px] rounded-[10px] text-[11px] font-bold inline-block";
    
    if (normalizado === 'APROBADO' || normalizado === 'ACTIVO') {
      return <span className={`${baseClass} bg-[#d1e7dd] text-[#0f5132]`}>{normalizado}</span>;
    } else if (normalizado === 'PENDIENTE') {
      return <span className={`${baseClass} bg-[#fff3cd] text-[#856404]`}>{normalizado}</span>;
    } else if (normalizado === 'RECHAZADO' || normalizado === 'BLOQUEADO' || normalizado === 'BAJA') {
      return <span className={`${baseClass} bg-[#f8d7da] text-[#842029]`}>{normalizado}</span>;
    }
    
    return <span className={baseClass}>{normalizado}</span>;
  };

  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      {/* Cabecero restaurado al azul original #1a3a5c */}
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">Detalle de carga #{detalle.id_carga}</div>

      <div className="p-[13px_14px] border-b border-[#eeeeee]">
        <div className="text-[11px] font-bold text-[#2563a0] mb-[8px] uppercase tracking-[0.5px]">Datos del beneficiario</div>
        <div className="grid grid-cols-2 gap-[7px] mb-[8px]">
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Nombre Familia / Representante</div>
            <div className="text-[12px] text-[#222222] font-bold">{detalle.nombre_familia}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">RUT Representante</div>
            <div className="text-[12px] text-[#222222] font-bold">{detalle.rut_principal}</div>
          </div>
        </div>
      </div>

      <div className="p-[13px_14px] border-b border-[#eeeeee]">
        <div className="text-[11px] font-bold text-[#2563a0] mb-[8px] uppercase tracking-[0.5px]">Datos de esta carga</div>
        <div className="grid grid-cols-2 gap-[7px]">
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Fecha</div>
            <div className="text-[12px] text-[#222222] font-bold">{formatDate(detalle.fecha)}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Monto cargado</div>
            <div className="text-[12px] font-bold text-[#1e7a3e]">${formatCurrency(detalle.monto)}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Motivo</div>
            <div className="text-[12px] text-[#222222] font-bold">{detalle.motivo || '—'}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Estado de Solicitud</div>
            <div className="mt-[2px]">{getEstadoBadge(detalle.estado)}</div>
          </div>
        </div>
      </div>

      {detalle.detalles && (
        <div className="p-[13px_14px] border-b border-[#eeeeee]">
          <div className="text-[11px] font-bold text-[#2563a0] mb-[4px] uppercase tracking-[0.5px]">Observaciones adicionales</div>
          <div className="text-[12px] text-[#444444] bg-[#f9f9f9] p-[8px] border border-[#e8e8e8] rounded-[3px] font-sans leading-[1.4]">
            {detalle.detalles}
          </div>
        </div>
      )}

      <div className="p-[13px_14px] bg-[#fdfdfd]">
        <div className="text-[11px] font-bold text-[#2563a0] mb-[6px] uppercase tracking-[0.5px]">Documento de Respaldo</div>
        {detalle.pdf_resolucion ? (
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/resoluciones/${detalle.pdf_resolucion}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[6px] text-[12px] text-[#b52b2b] font-bold no-underline hover:underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Ver Resolución Exenta (PDF)
          </a>
        ) : (
          <div className="text-[11px] text-[#999999] italic">
            No se adjuntó documento de resolución para esta carga.
          </div>
        )}
      </div>
    </div>
  );
};

export default CargaFondosDetail;