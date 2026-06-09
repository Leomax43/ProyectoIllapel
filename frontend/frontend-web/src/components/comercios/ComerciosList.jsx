import React from 'react';

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
  formatCurrency 
}) => {
  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px] flex justify-between items-center">
        Comercios registrados
        <button
          className="bg-[#1e7a3e] border-none text-[#ffffff] rounded-[3px] p-[4px_12px] text-[12px] cursor-pointer font-bold transition-colors hover:bg-[#157a3e]"
          onClick={onNewComercio}
        >
          + Nuevo comercio
        </button>
      </div>

      <div className="p-[8px_12px] border-b border-[#eeeeee] flex gap-[8px] items-center">
        <input
          type="text"
          placeholder="Buscar por nombre, RUT o rubro..."
          className="flex-1 border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] focus:outline-none"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          className="border border-[#cccccc] rounded-[3px] p-[5px_8px] text-[12px] text-[#555555] bg-[#ffffff] focus:outline-none"
          value={estadoFilter}
          onChange={(e) => onEstadoChange(e.target.value)}
        >
          <option>Todos</option>
          <option>ACTIVO</option>
          <option>BAJA</option>
        </select>
      </div>

      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal border-b border-[#dddddd]">RUT</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal border-b border-[#dddddd]">Nombre comercio</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal border-b border-[#dddddd]">Rubro</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal border-b border-[#dddddd]">Saldo acum.</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal border-b border-[#dddddd]">Estado</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal border-b border-[#dddddd]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredComercios.map((comercio) => (
            <tr
              key={comercio.rut_comercio}
              className={`cursor-pointer transition-colors ${
                selectedComercio?.rut_comercio === comercio.rut_comercio ? 'bg-[#e0edff]' : 'hover:bg-[#f9f9f9]'
              }`}
              onClick={() => onComercioSelect(comercio)}
            >
              <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{comercio.rut_comercio}</td>
              <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{comercio.nombre_comercio}</td>
              <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{comercio.rubro}</td>
              <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{formatCurrency(comercio.saldo_acumulado)}</td>
              <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">
                <span className={`p-[2px_8px] rounded-[10px] text-[11px] font-bold inline-block ${
                  comercio.estado === 'ACTIVO' ? 'bg-[#d1e7dd] text-[#0f5132]' : 'bg-[#f8d7da] text-[#842029]'
                }`}>
                  {comercio.estado}
                </span>
              </td>
              <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]" onClick={(e) => e.stopPropagation()}>
                <button
                  className="p-[3px_9px] rounded-[3px] text-[11px] border-none cursor-pointer text-[#ffffff] mr-[3px] bg-[#2563a0] transition-colors hover:bg-[#1a4f80]"
                  onClick={() => onComercioSelect(comercio)}
                >
                  Ver
                </button>
                {comercio.estado !== 'BAJA' && (
                  <button
                    className="p-[3px_9px] rounded-[3px] text-[11px] border-none cursor-pointer text-[#ffffff] mr-[3px] bg-[#b52b2b] transition-colors hover:bg-[#8b1a1a]"
                  >
                    Baja
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-[7px_12px] text-[12px] text-[#555555] flex justify-between border-t border-[#eeeeee]">
        <span>Mostrando {filteredComercios.length} de {totalComercios} comercios</span>
      </div>
    </div>
  );
};

export default ComerciosList;