const ComerciosList = ({ 
  filteredComercios, 
  totalComercios, 
  selectedComercio, 
  searchTerm, 
  onSearchChange, 
  estadoFilter, 
  onEstadoChange, 
  onComercioSelect, 
  onNewComercio,
  formatCurrency,
  onEstadoCambiado
}) => {
  const badgeStyle = (estado) => {
    if (estado === 'ACTIVO') return 'bg-[#e6f7f4] text-verde border border-[#b2e8de]';
    if (estado === 'BAJA') return 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]';
    return 'bg-[#e9ecef] text-[#555] border border-[#ddd]';
  };

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      {/* PANEL HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex justify-between items-center">
        <div>
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Comercios registrados
        </div>
        <button
          onClick={onNewComercio}
          className="bg-verde border-none text-white rounded-[3px] px-[12px] py-[4px] text-[12px] cursor-pointer font-bold hover:brightness-110"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          + Nuevo comercio
        </button>
      </div>

      {/* CONTROLS */}
      <div className="px-[12px] py-[8px] flex gap-[8px] items-center border-b border-gris-borde bg-[#fafafa]">
        <input
          type="text"
          placeholder="Buscar por nombre, RUT o rubro..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] outline-none focus:border-verde"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        />
        <select
          value={estadoFilter}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="border border-gris-borde rounded-[3px] px-[8px] py-[5px] text-[12px] text-gris-texto outline-none"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          <option>Todos</option>
          <option>ACTIVO</option>
          <option>BAJA</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">RUT</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Nombre comercio</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Rubro</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Saldo acum.</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Estado</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredComercios.map((comercio) => (
            <tr
              key={comercio.rut_comercio}
              onClick={() => onComercioSelect(comercio)}
              className={`cursor-pointer hover:bg-[#f0f8f6] ${
                selectedComercio?.rut_comercio === comercio.rut_comercio ? 'bg-[#e0eaf0]' : ''
              }`}
            >
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{comercio.rut_comercio}</td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{comercio.nombre_comercio}</td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{comercio.rubro}</td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{formatCurrency(comercio.saldo_acumulado)}</td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">
                <span className={`inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${badgeStyle(comercio.estado)}`}>
                  {comercio.estado}
                </span>
              </td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]" onClick={(e) => e.stopPropagation()}>
                {comercio.estado === 'ACTIVO' ? (
                  <button 
                    onClick={() => onEstadoCambiado && onEstadoCambiado(comercio.rut_comercio, 'BAJA')}
                    className="px-[9px] py-[3px] rounded-[3px] text-[11px] border-none cursor-pointer text-white bg-[#b52b2b] font-medium hover:brightness-110"
                    style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
                    Dar de baja
                  </button>
                ) : (
                  <button 
                    onClick={() => onEstadoCambiado && onEstadoCambiado(comercio.rut_comercio, 'ACTIVO')}
                    className="px-[9px] py-[3px] rounded-[3px] text-[11px] border-none cursor-pointer text-white bg-verde font-medium hover:brightness-110"
                    style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
                    Activar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGER */}
      <div className="px-[12px] py-[7px] text-[12px] text-gris-claro flex justify-between border-t border-gris-borde bg-[#fafafa]">
        <span>Mostrando {filteredComercios.length} de {totalComercios} comercios</span>
      </div>
    </div>
  );
};

export default ComerciosList;