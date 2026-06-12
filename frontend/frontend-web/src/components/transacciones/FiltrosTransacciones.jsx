const FiltrosTransacciones = ({
  searchTerm,
  onSearchChange,
  fechaInicio,
  onFechaInicioChange,
  fechaFin,
  onFechaFinChange,
  tipoFiltro,
  onTipoFiltroChange,
  comercioFiltro,
  onComercioFiltroChange
}) => {
  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        Filtros de búsqueda
      </div>
      <div className="p-[10px_12px] border-b border-gris-borde grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-[8px] items-center">
        <input
          type="text"
          placeholder="Buscar por beneficiario, RUT o comercio..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] w-[92%] outline-none focus:border-verde"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => onFechaInicioChange(e.target.value)}
          className="border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] w-[92%] outline-none focus:border-verde"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => onFechaFinChange(e.target.value)}
          className="border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] w-[92%] outline-none focus:border-verde"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        />
        <select
          value={tipoFiltro}
          onChange={(e) => onTipoFiltroChange(e.target.value)}
          className="border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] text-gris-texto w-[92%] outline-none"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          <option value="todos">Todos los tipos</option>
          <option value="CARGA">Carga de fondos</option>
          <option value="QR">Pago QR</option>
          <option value="RUT+PIN">Pago RUT+PIN</option>
          <option value="ANULADO">Anulado</option>
        </select>
        <select
          value={comercioFiltro}
          onChange={(e) => onComercioFiltroChange(e.target.value)}
          className="border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] text-gris-texto w-[92%] outline-none"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          <option value="todos">Todos los comercios</option>
          <option value="11.111.111-1">Minimarket Don Jorge</option>
          <option value="22.222.222-2">Ferretería El Clavo</option>
          <option value="33.333.333-3">Supermercado La Esperanza</option>
          <option value="44.444.444-4">Librería Saber</option>
        </select>
        <button className="bg-azul text-white border-none rounded-[3px] px-[14px] py-[6px] text-[12px] cursor-pointer whitespace-nowrap font-bold hover:brightness-110"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
          Filtrar
        </button>
      </div>
    </div>
  );
};

export default FiltrosTransacciones;