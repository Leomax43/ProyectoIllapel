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
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      {/* HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex justify-between items-center">
        <div>
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Movimientos del sistema
        </div>
        <div className="flex gap-[5px]"></div>
      </div>

      {/* LEYENDA */}
      <div className="px-[12px] py-[7px] border-b border-gris-borde bg-[#fafafa] flex gap-[12px] flex-wrap text-[11px] text-gris-texto">
        <span><span className={badgeStyle('carga')}>Carga de fondos</span> Asignación municipal</span>
        <span><span className={badgeStyle('pago-qr')}>Pago QR</span> Escaneado por comercio</span>
        <span><span className={badgeStyle('pago-pin')}>Pago RUT+PIN</span> Ingreso manual</span>
        <span><span className={badgeStyle('anulado')}>Anulado</span> Operación revertida</span>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste whitespace-nowrap">ID</th>
            <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste whitespace-nowrap">Fecha y hora</th>
            <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste whitespace-nowrap">Tipo</th>
            <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste whitespace-nowrap">Beneficiario</th>
            <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste whitespace-nowrap">Comercio</th>
            <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste whitespace-nowrap">Monto</th>
            <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste whitespace-nowrap">Saldo resultante</th>
            <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste whitespace-nowrap">Respaldo</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-gris-claro text-center">
                Cargando transacciones...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="8" className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#d32f2f] text-center">
                ❌ Error: {error}
              </td>
            </tr>
          ) : transaccionesTotales.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-gris-claro text-center">
                No hay transacciones registradas
              </td>
            </tr>
          ) : (
            transaccionesPaginadas.map((transaccion) => (
              <tr 
                key={transaccion.id_transaccion}
                className="cursor-pointer hover:bg-[#f0f8f6]"
              >
                <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">#{transaccion.id_transaccion}</td>
                <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">
                  {new Date(transaccion.fecha).toLocaleDateString('es-CL')} {new Date(transaccion.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">
                  <span className={badgeStyle(getTipoBadge(transaccion.metodo_pago))}>
                    {transaccion.metodo_pago || 'Carga de fondos'}
                  </span>
                </td>
                <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{transaccion.nombre_familia || '—'}</td>
                <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{transaccion.nombre_comercio || '—'}</td>
                <td className={`px-[10px] py-[7px] border-b border-[#f0f0f0] ${getMontoCargaStyle(transaccion.metodo_pago)}`}>
                  {getMontoCarga(transaccion.metodo_pago, transaccion.monto)}
                </td>
                <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">
                  ${parseInt(transaccion.saldo || 0).toLocaleString('es-CL')}
                </td>
                <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">—</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINADOR */}
      <div className="px-[12px] py-[7px] text-[12px] text-gris-claro flex justify-between items-center border-t border-gris-borde bg-[#fafafa]">
        <span>Mostrando {indexInicio + 1} a {Math.min(indexFin, transaccionesTotales.length)} de {transaccionesTotales.length} transacciones del período</span>
        <div className="flex gap-[4px] items-center">
          <button
            onClick={() => onCambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`border-none text-white rounded-[3px] px-[8px] py-[4px] text-[11px] whitespace-nowrap font-bold ${
              paginaActual === 1 ? 'bg-[#cccccc] cursor-not-allowed' : 'bg-azul cursor-pointer hover:brightness-110'
            }`}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
            <button
              key={pagina}
              onClick={() => onCambiarPagina(pagina)}
              className={`border-none rounded-[3px] px-[8px] py-[4px] text-[11px] cursor-pointer min-w-[24px] font-bold ${
                paginaActual === pagina ? 'bg-azul text-white' : 'bg-[#e8e8e8] text-[#333]'
              }`}
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              {pagina}
            </button>
          ))}

          <button
            onClick={() => onCambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`border-none text-white rounded-[3px] px-[8px] py-[4px] text-[11px] whitespace-nowrap font-bold ${
              paginaActual === totalPaginas ? 'bg-[#cccccc] cursor-not-allowed' : 'bg-azul cursor-pointer hover:brightness-110'
            }`}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaTransacciones;