import React from 'react';

const CargaFondosDetail = ({ detalle, formatCurrency, formatDate }) => {
  if (!detalle) {
    return (
      <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
        <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">Detalle de carga</div>
        <div className="p-[13px_14px] text-[#999999] text-center text-[12px]">
          Selecciona una carga para ver los detalles
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">Detalle de carga #{detalle.id_carga}</div>

      <div className="p-[13px_14px] border-b border-[#eeeeee]">
        <div className="text-[11px] font-bold text-[#2563a0] mb-[8px] uppercase tracking-[0.5px]">Datos del beneficiario</div>
        <div className="grid grid-cols-2 gap-[7px] mb-[8px]">
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Nombre Familia</div>
            <div className="text-[12px] text-[#222222] font-bold">{detalle.nombre_familia}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">RUT</div>
            <div className="text-[12px] text-[#222222] font-bold">{detalle.rut_principal}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[8px] mb-[4px]">
          <div className="border border-[#1e7a3e] rounded-[4px] p-[8px_12px] text-center bg-[#d1e7dd]">
            <div className="text-[10px] text-[#888888] mb-[3px]">Saldo actual</div>
            <div className="text-[17px] font-bold text-[#1a3a5c]">${formatCurrency(detalle.saldo)}</div>
          </div>
        </div>
        {detalle.pdf_resolucion && (
          <div className="mt-[12px]">
            <div className="text-[11px] font-bold text-[#2563a0] mb-[8px] uppercase tracking-[0.5px]">Documento adjunto</div>
            <a 
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${detalle.pdf_resolucion}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#2563a0] text-[#ffffff] p-[8px_14px] rounded-[3px] text-[12px] font-bold no-underline mt-[6px] transition-colors hover:bg-[#1e4a8b]"
            >
              📄 Descargar PDF
            </a>
          </div>
        )}
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
        </div>
      </div>

      {detalle.detalles && (
        <div className="p-[13px_14px]">
          <div className="text-[11px] font-bold text-[#2563a0] mb-[8px] uppercase tracking-[0.5px]">Detalles adicionales</div>
          <div className="bg-[#f9f9f9] border border-[#eeeeee] rounded-[3px] p-[7px_10px] text-[12px] text-[#444444] leading-[1.5]">
            {detalle.detalles}
          </div>
        </div>
      )}
    </div>
  );
};

export default CargaFondosDetail;