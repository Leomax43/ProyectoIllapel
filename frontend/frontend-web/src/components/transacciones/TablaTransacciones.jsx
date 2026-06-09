import React from 'react';

const TablaTransacciones = ({
  loading,
  error,
  transaccionesPaginadas,
  transaccionesTotales,
  paginaActual,
  totalPaginas,
  indexInicio,
  indexFin,
  onCambiarPagina,
  badgeStyle,
  getTipoBadge,
  getMontoCargaStyle,
  getMontoCarga
}) => {
  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px] flex justify-between items-center">
        Movimientos del sistema
        <div className="flex gap-[5px]">
          <button className="bg-[#2563a0] border-none text-[#ffffff] rounded-[3px] p-[6px_14px] text-[12px] cursor-pointer whitespace-nowrap transition-colors hover:bg-[#1a4f80]">Excel</button>
          <button className="bg-[#2563a0] border-none text-[#ffffff] rounded-[3px] p-[6px_14px] text-[12px] cursor-pointer whitespace-nowrap transition-colors hover:bg-[#1a4f80]">CSV</button>
          <button className="bg-[#2563a0] border-none text-[#ffffff] rounded-[3px] p-[6px_14px] text-[12px] cursor-pointer whitespace-nowrap transition-colors hover:bg-[#1a4f80]">PDF</button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="p-[7px_12px] border-b border-[#eeeeee] bg-[#fafafa] flex gap-[12px] flex-wrap text-[11px] text-[#666666]">
        <span>
          <span className={badgeStyle('carga')}>Carga de fondos</span> Asignación municipal
        </span>
        <span>
          <span className={badgeStyle('pago-qr')}>Pago QR</span> Escaneado por comercio
        </span>
        <span>
          <span className={badgeStyle('pago-pin')}>Pago RUT+PIN</span> Ingreso manual
        </span>
        <span>
          <span className={badgeStyle('anulado')}>Anulado</span> Operación revertida
        </span>
      </div>

      {/* Tabla */}
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal whitespace-nowrap">ID</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal whitespace-nowrap">Fecha y hora</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal whitespace-nowrap">Tipo</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal whitespace-nowrap">Beneficiario</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal whitespace-nowrap">Comercio</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal whitespace-nowrap">Monto</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal whitespace-nowrap">Saldo resultante</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal whitespace-nowrap">Respaldo</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="p-[7px_10px] border-b border-[#f0f0f0] text-[#999999] text-center">
                Cargando transacciones...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="8" className="p-[7px_10px] border-b border-[#f0f0f0] text-[#d32f2f] text-center">
                ❌ Error: {error}
              </td>
            </tr>
          ) : transaccionesTotales.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-[7px_10px] border-b border-[#f0f0f0] text-[#999999] text-center">
                No hay transacciones registradas
              </td>
            </tr>
          ) : (
            transaccionesPaginadas.map((transaccion) => (
              <tr 
                key={transaccion.id_transaccion}
                className="cursor-pointer transition-colors bg-transparent hover:bg-[#f0f6ff]"
              >
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">#{transaccion.id_transaccion}</td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">
                  {new Date(transaccion.fecha).toLocaleDateString('es-CL')} {new Date(transaccion.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">
                  <span className={badgeStyle(getTipoBadge(transaccion.metodo_pago))}>
                    {transaccion.metodo_pago || 'Carga de fondos'}
                  </span>
                </td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{transaccion.nombre_familia || '—'}</td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{transaccion.nombre_comercio || '—'}</td>
                <td className={`p-[7px_10px] border-b border-[#f0f0f0] ${getMontoCargaStyle(transaccion.metodo_pago)}`}>
                  {getMontoCarga(transaccion.metodo_pago, transaccion.monto)}
                </td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">
                  ${parseInt(transaccion.saldo || 0).toLocaleString('es-CL')}
                </td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">—</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginador */}
      <div className="p-[7px_12px] text-[12px] text-[#555555] flex justify-between items-center border-t border-[#eeeeee]">
        <span>Mostrando {indexInicio + 1} a {Math.min(indexFin, transaccionesTotales.length)} de {transaccionesTotales.length} transacciones del período</span>
        <div className="flex gap-[4px] items-center">
          <button
            onClick={() => onCambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`border-none text-[#ffffff] rounded-[3px] p-[4px_8px] text-[11px] whitespace-nowrap ${
              paginaActual === 1 ? 'bg-[#cccccc] cursor-not-allowed' : 'bg-[#2563a0] cursor-pointer transition-colors hover:bg-[#1a4f80]'
            }`}
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
            <button
              key={pagina}
              onClick={() => onCambiarPagina(pagina)}
              className={`border-none rounded-[3px] p-[4px_8px] text-[11px] cursor-pointer min-w-[24px] ${
                paginaActual === pagina ? 'bg-[#1a3a5c] text-[#ffffff] font-bold' : 'bg-[#e8e8e8] text-[#333333] font-normal'
              }`}
            >
              {pagina}
            </button>
          ))}

          <button
            onClick={() => onCambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`border-none text-[#ffffff] rounded-[3px] p-[4px_8px] text-[11px] whitespace-nowrap ${
              paginaActual === totalPaginas ? 'bg-[#cccccc] cursor-not-allowed' : 'bg-[#2563a0] cursor-pointer transition-colors hover:bg-[#1a4f80]'
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaTransacciones;