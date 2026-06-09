import React from 'react';

const CargaFondosList = ({
  cargasFiltradas,
  totalCargas,
  selectedCarga,
  searchTerm,
  onSearchChange,
  onCargaSelect,
  onNewCarga,
  formatCurrency,
  formatDate,
  loading,
  error
}) => {
  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px] flex justify-between items-center">
        Historial de cargas
        <button
          className="bg-[#1e7a3e] border-none text-[#ffffff] rounded-[3px] p-[4px_14px] text-[12px] cursor-pointer font-bold transition-colors hover:bg-[#165a2f]"
          onClick={onNewCarga}
        >
          + Nueva carga
        </button>
      </div>

      <div className="p-[8px_12px] border-b border-[#eeeeee] flex gap-[8px] items-center flex-wrap">
        <input
          type="text"
          placeholder="Buscar por beneficiario o RUT..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[120px] border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] focus:outline-none"
        />
        <select className="border border-[#cccccc] rounded-[3px] p-[5px_8px] text-[12px] text-[#555555] bg-[#ffffff] focus:outline-none">
          <option>Todos los tipos</option>
          <option>Alimentación</option>
          <option>Materiales de construcción</option>
          <option>Útiles escolares</option>
          <option>Otro</option>
        </select>
      </div>

      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal">ID</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal">Fecha</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal">Beneficiario</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal">Motivo</th>
            <th className="bg-[#2563a0] text-[#ffffff] p-[7px_10px] text-left font-normal">Monto</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="p-[7px_10px] border-b border-[#f0f0f0] text-[#999999] text-center">
                Cargando...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="5" className="p-[7px_10px] border-b border-[#f0f0f0] text-[#d32f2f] text-center">
                Error: {error}
              </td>
            </tr>
          ) : cargasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-[7px_10px] border-b border-[#f0f0f0] text-[#999999] text-center">
                Sin cargas registradas
              </td>
            </tr>
          ) : (
            cargasFiltradas.map((carga) => (
              <tr
                key={carga.id_carga}
                onClick={() => onCargaSelect(carga)}
                className={`cursor-pointer transition-colors ${
                  selectedCarga?.id_carga === carga.id_carga ? 'bg-[#e0edff]' : 'hover:bg-[#f0f6ff]'
                }`}
              >
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{carga.id_carga}</td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{formatDate(carga.fecha)}</td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{carga.nombre_familia}</td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#333333]">{carga.motivo || '—'}</td>
                <td className="p-[7px_10px] border-b border-[#f0f0f0] text-[#1e7a3e] font-bold">
                  ${formatCurrency(carga.monto)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="p-[7px_12px] text-[12px] text-[#555555] flex justify-between border-t border-[#eeeeee]">
        <span>Mostrando {cargasFiltradas.length} de {totalCargas} cargas</span>
      </div>
    </div>
  );
};

export default CargaFondosList;