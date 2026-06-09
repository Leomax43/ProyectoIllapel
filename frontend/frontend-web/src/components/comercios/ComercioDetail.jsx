import React from 'react';

const ComercioDetail = ({ selectedComercio, comercioDetalle, formatCurrency, formatDate }) => {
  if (!selectedComercio) {
    return (
      <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
        <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
          Detalle del comercio seleccionado
        </div>
        <div className="p-[20px] text-center text-[#999999] text-[12px]">
          Selecciona un comercio para ver detalles
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        Detalle del comercio seleccionado
      </div>

      <div className="p-[13px_14px] border-b border-[#eeeeee]">
        <div className="text-[11px] font-bold text-[#2563a0] mb-[8px] uppercase tracking-[0.5px]">
          Datos del establecimiento
        </div>
        <div className="grid grid-cols-2 gap-[7px]">
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Nombre</div>
            <div className="text-[12px] text-[#222222] font-bold">{selectedComercio.nombre_comercio}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">RUT</div>
            <div className="text-[12px] text-[#222222] font-bold">{selectedComercio.rut_comercio}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Rubro</div>
            <div className="text-[12px] text-[#222222] font-bold">{selectedComercio.rubro}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Teléfono</div>
            <div className="text-[12px] text-[#222222] font-bold">{selectedComercio.telefono}</div>
          </div>
          <div className="text-[12px] col-span-2">
            <div className="text-[11px] text-[#888888] mb-[3px]">Dirección</div>
            <div className="text-[12px] text-[#222222] font-bold">{selectedComercio.direccion}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Responsable</div>
            <div className="text-[12px] text-[#222222] font-bold">{selectedComercio.responsable}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Estado</div>
            <div>
              <span className={`p-[2px_8px] rounded-[10px] text-[11px] font-bold inline-block ${
                selectedComercio.estado === 'ACTIVO' ? 'bg-[#d1e7dd] text-[#0f5132]' : 'bg-[#f8d7da] text-[#842029]'
              }`}>
                {selectedComercio.estado}
              </span>
            </div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Fecha de registro</div>
            <div className="text-[12px] text-[#222222] font-bold">{formatDate(selectedComercio.fecha_registro)}</div>
          </div>
        </div>
        <div className="bg-[#e0edff] border border-[#2563a0] rounded-[4px] p-[10px_14px] text-center mt-[10px]">
          <div className="text-[11px] text-[#5580aa] mb-[3px]">Saldo acumulado por ventas</div>
          <div className="text-[22px] font-bold text-[#1a3a5c]">{formatCurrency(selectedComercio.saldo_acumulado)}</div>
        </div>
      </div>

      <div className="p-[13px_14px] border-b border-[#eeeeee]">
        <div className="text-[11px] font-bold text-[#2563a0] mb-[8px] uppercase tracking-[0.5px]">
          Últimas transacciones recibidas
        </div>
        <table className="w-full border-collapse text-[11px] mt-[6px]">
          <thead>
            <tr>
              <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[4px_8px] text-left border border-[#dddddd]">Fecha</th>
              <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[4px_8px] text-left border border-[#dddddd]">Beneficiario</th>
              <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[4px_8px] text-left border border-[#dddddd]">Monto</th>
              <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[4px_8px] text-left border border-[#dddddd]">Método</th>
            </tr>
          </thead>
          <tbody>
            {comercioDetalle?.historial_ventas && comercioDetalle.historial_ventas.length > 0 ? (
              comercioDetalle.historial_ventas.slice(0, 5).map((venta, idx) => (
                <tr key={idx}>
                  <td className="p-[4px_8px] border border-[#eeeeee] text-[#333333]">
                    {formatDate(venta.fecha)}
                  </td>
                  <td className="p-[4px_8px] border border-[#eeeeee] text-[#333333]">
                    {venta.nombre_familia || 'N/A'}
                  </td>
                  <td className="p-[4px_8px] border border-[#eeeeee] text-[#333333]">
                    {formatCurrency(venta.monto)}
                  </td>
                  <td className="p-[4px_8px] border border-[#eeeeee] text-[#333333]">
                    {venta.metodo_pago || 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-[8px] border border-[#eeeeee] text-[#999999] text-center">
                  Sin transacciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-[13px_14px]">
        <div className="flex justify-between gap-[8px]">
          <button
            className="bg-[#b52b2b] border-none text-[#ffffff] rounded-[3px] p-[7px_16px] text-[12px] cursor-pointer transition-colors hover:bg-[#8b1a1a]"
          >
            Dar de baja
          </button>
          <button
            className="bg-[#1e7a3e] border-none text-[#ffffff] rounded-[3px] p-[7px_18px] text-[12px] font-bold cursor-pointer transition-colors hover:bg-[#157a3e]"
          >
            Editar datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComercioDetail;