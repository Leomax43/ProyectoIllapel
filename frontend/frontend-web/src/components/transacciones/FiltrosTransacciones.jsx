import React from 'react';

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
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">Filtros de búsqueda</div>
      <div className="p-[10px_12px] border-b border-[#eeeeee] grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-[8px] items-center">
        <input
          type="text"
          placeholder="Buscar por beneficiario, RUT o comercio..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] text-[#333333] w-[92%] focus:outline-none"
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => onFechaInicioChange(e.target.value)}
          className="border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] text-[#333333] w-[92%] focus:outline-none"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => onFechaFinChange(e.target.value)}
          className="border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] text-[#333333] w-[92%] focus:outline-none"
        />
        <select
          value={tipoFiltro}
          onChange={(e) => onTipoFiltroChange(e.target.value)}
          className="border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] text-[#333333] w-[92%] bg-[#ffffff] focus:outline-none"
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
          className="border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] text-[#333333] w-[92%] bg-[#ffffff] focus:outline-none"
        >
          <option value="todos">Todos los comercios</option>
          {/* NOTA: Aquí debes poner el RUT real de cada comercio como valor en lugar de su rubro */}
          <option value="11.111.111-1">Minimarket Don Jorge</option>
          <option value="22.222.222-2">Ferretería El Clavo</option>
          <option value="33.333.333-3">Supermercado La Esperanza</option>
          <option value="44.444.444-4">Librería Saber</option>
        </select>
        <button className="bg-[#2563a0] border-none text-[#ffffff] rounded-[3px] p-[6px_14px] text-[12px] cursor-pointer whitespace-nowrap transition-colors hover:bg-[#1a4f80]">
          Filtrar
        </button>
      </div>
    </div>
  );
};

export default FiltrosTransacciones;