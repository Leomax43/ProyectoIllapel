const CargaFondosDetail = ({ detalle, formatCurrency, formatDate }) => {
  if (!detalle) {
    return (
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Detalle de carga
        </div>
        <div className="p-[13px_14px] text-gris-claro text-center text-[12px]">
          Selecciona una carga para ver los detalles
        </div>
      </div>
    );
  }

  const getEstadoBadge = (estado) => {
    const normalizado = estado ? estado.toUpperCase() : 'PENDIENTE';
    const baseClass = "inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold border";
    
    if (normalizado === 'APROBADO' || normalizado === 'ACTIVO') {
      return <span className={`${baseClass} bg-[#e6f7f4] text-verde border-[#b2e8de]`}>{normalizado}</span>;
    } else if (normalizado === 'PENDIENTE') {
      return <span className={`${baseClass} bg-[#fff8e0] text-[#a07800] border-[#f0d970]`}>{normalizado}</span>;
    } else if (normalizado === 'RECHAZADO' || normalizado === 'BLOQUEADO' || normalizado === 'BAJA') {
      return <span className={`${baseClass} bg-[#fde8e8] text-[#b52b2b] border-[#f5b8b8]`}>{normalizado}</span>;
    }
    
    return <span className={baseClass}>{normalizado}</span>;
  };

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      {/* HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        Detalle de carga #{detalle.id_carga}
      </div>

      {/* DATOS DEL BENEFICIARIO */}
      <div className="p-[13px_14px] border-b border-gris-borde">
        <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">Datos del beneficiario</div>
        <div className="grid grid-cols-2 gap-[7px] mb-[8px]">
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[3px]">Nombre Familia / Representante</div>
            <div className="text-[12px] text-[#222] font-bold">{detalle.nombre_familia}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[3px]">RUT Representante</div>
            <div className="text-[12px] text-[#222] font-bold">{detalle.rut_principal}</div>
          </div>
        </div>
      </div>

      {/* DATOS DE LA CARGA */}
      <div className="p-[13px_14px] border-b border-gris-borde">
        <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">Datos de esta carga</div>
        <div className="grid grid-cols-2 gap-[7px]">
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[3px]">Fecha</div>
            <div className="text-[12px] text-[#222] font-bold">{formatDate(detalle.fecha)}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[3px]">Monto cargado</div>
            <div className="text-[12px] font-bold text-verde">${formatCurrency(detalle.monto)}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[3px]">Motivo</div>
            <div className="text-[12px] text-[#222] font-bold">{detalle.motivo || '—'}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[3px]">Estado de Solicitud</div>
            <div className="mt-[2px]">{getEstadoBadge(detalle.estado)}</div>
          </div>
        </div>
      </div>

      {/* OBSERVACIONES */}
      {detalle.detalles && (
        <div className="p-[13px_14px] border-b border-gris-borde">
          <div className="text-[11px] font-bold text-azul mb-[4px] uppercase tracking-[0.5px]">Observaciones adicionales</div>
          <div className="text-[12px] text-gris-texto bg-[#f9f9f9] p-[8px] border border-gris-borde rounded-[3px] leading-[1.4]">
            {detalle.detalles}
          </div>
        </div>
      )}

      {/* DOCUMENTO DE RESPALDO */}
      <div className="p-[13px_14px] bg-[#fdfdfd]">
        <div className="text-[11px] font-bold text-azul mb-[6px] uppercase tracking-[0.5px]">Documento de Respaldo</div>
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
          <div className="text-[11px] text-gris-claro italic">
            No se adjuntó documento de resolución para esta carga.
          </div>
        )}
      </div>
    </div>
  );
};

export default CargaFondosDetail;