const ComercioDetail = ({ selectedComercio, comercioDetalle, formatCurrency, formatDate }) => {
  if (!selectedComercio) {
    return (
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Detalle del comercio seleccionado
        </div>
        <div className="p-[20px] text-center text-gris-claro text-[12px]">
          Selecciona un comercio para ver detalles
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      {/* HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        Detalle del comercio seleccionado
      </div>

      {/* DATOS DEL ESTABLECIMIENTO */}
      <div className="p-[13px_14px] border-b border-gris-borde">
        <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">
          Datos del establecimiento
        </div>
        <div className="grid grid-cols-2 gap-[4px]">
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[0px]">Nombre</div>
            <div className="text-[12px] text-[#222] font-bold">{selectedComercio.nombre_comercio}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[0px]">RUT</div>
            <div className="text-[12px] text-[#222] font-bold">{selectedComercio.rut_comercio}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[0px]">Rubro</div>
            <div className="text-[12px] text-[#222] font-bold">{selectedComercio.rubro}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[0px]">Teléfono</div>
            <div className="text-[12px] text-[#222] font-bold">{selectedComercio.telefono}</div>
          </div>
          <div className="text-[12px] col-span-2">
            <div className="text-[11px] text-gris-claro mb-[0px]">Dirección</div>
            <div className="text-[12px] text-[#222] font-bold">{selectedComercio.direccion}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[0px]">Responsable</div>
            <div className="text-[12px] text-[#222] font-bold">{selectedComercio.responsable}</div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[0px]">Estado</div>
            <div>
              <span className={`inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${
                selectedComercio.estado === 'ACTIVO'
                  ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]'
                  : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
              }`}>
                {selectedComercio.estado}
              </span>
            </div>
          </div>
          <div className="text-[12px]">
            <div className="text-[11px] text-gris-claro mb-[0px]">Fecha de registro</div>
            <div className="text-[12px] text-[#222] font-bold">{formatDate(selectedComercio.fecha_registro)}</div>
          </div>
        </div>
        {/* SALDO ACUMULADO */}
        <div className="border border-azul rounded-[4px] p-[10px_14px] text-center mt-[10px] bg-[#e0eaf0]">
          <div className="text-[11px] text-gris-texto mb-[3px]">Saldo acumulado por ventas</div>
          <div className="text-[22px] font-bold text-azul">{formatCurrency(selectedComercio.saldo_acumulado)}</div>
        </div>
      </div>

      {/* ÚLTIMAS TRANSACCIONES */}
      <div className="p-[13px_14px] border-b border-gris-borde">
        <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">
          Últimas transacciones recibidas
        </div>
        <table className="w-full border-collapse text-[11px] mt-[6px]">
          <thead>
            <tr>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Fecha</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Beneficiario</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Monto</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Método</th>
            </tr>
          </thead>
          <tbody>
            {comercioDetalle?.historial_ventas && comercioDetalle.historial_ventas.length > 0 ? (
              comercioDetalle.historial_ventas.slice(0, 5).map((venta, idx) => (
                <tr key={idx}>
                  <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{formatDate(venta.fecha)}</td>
                  <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{venta.nombre_familia || 'N/A'}</td>
                  <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{formatCurrency(venta.monto)}</td>
                  <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{venta.metodo_pago || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-[8px] py-[8px] border border-[#f0f0f0] text-gris-claro text-center">
                  Sin transacciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ACTION BUTTONS */}
      <div className="p-[13px_14px]">
        <div className="flex justify-between gap-[8px]">
          <button className="bg-[#b52b2b] text-white border-none rounded-[3px] px-[16px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
            Dar de baja
          </button>
          <button className="bg-verde text-white border-none rounded-[3px] px-[18px] py-[7px] text-[12px] font-bold cursor-pointer hover:brightness-110"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
            Editar datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComercioDetail;