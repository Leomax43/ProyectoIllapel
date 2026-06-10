import React from 'react';

const CargaFondosList = ({
  cargasFiltradas,
  totalCargas,
  selectedCarga,
  searchTerm,
  onSearchChange,
  estadoFilter,
  onEstadoFilterChange,
  onCargaSelect,
  onNewCarga,
  formatCurrency,
  formatDate,
  loading,
  error
}) => {
  const getEstadoBadge = (estado) => {
    const normalizado = estado ? estado.toUpperCase() : 'PENDIENTE';
    const baseClass = "p-[2px_8px] rounded-[10px] text-[11px] font-bold inline-block";
    
    if (normalizado === 'APROBADO' || normalizado === 'ACTIVO') {
      return <span className={`${baseClass} bg-[#d1e7dd] text-[#0f5132]`}>{normalizado}</span>;
    } else if (normalizado === 'PENDIENTE') {
      return <span className={`${baseClass} bg-[#fff3cd] text-[#856404]`}>{normalizado}</span>;
    } else if (normalizado === 'RECHAZADO' || normalizado === 'BLOQUEADO' || normalizado === 'BAJA') {
      return <span className={`${baseClass} bg-[#f8d7da] text-[#842029]`}>{normalizado}</span>;
    }
    
    return <span className={baseClass}>{normalizado}</span>;
  };

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
          className="flex-1 min-w-[180px] border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] text-[#333333] focus:outline-none focus:border-[#2563a0]"
        />
        
        <select
          value={estadoFilter}
          onChange={(e) => onEstadoFilterChange(e.target.value)}
          className="border border-[#cccccc] rounded-[3px] p-[5px_9px] text-[12px] text-[#333333] bg-[#ffffff] focus:outline-none focus:border-[#2563a0] min-w-[130px]"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="APROBADO">APROBADO</option>
          <option value="RECHAZADO">RECHAZADO</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead>
            <tr className="bg-[#f5f5f2] text-[#1a3a5c] font-bold">
              <th className="p-[8px_10px] border-b border-[#dddddd] w-[50px]">ID</th>
              <th className="p-[8px_10px] border-b border-[#dddddd] w-[90px]">Fecha</th>
              <th className="p-[8px_10px] border-b border-[#dddddd]">Beneficiario</th>
              <th className="p-[8px_10px] border-b border-[#dddddd]">Motivo</th>
              <th className="p-[8px_10px] border-b border-[#dddddd] w-[100px]">Monto</th>
              <th className="p-[8px_10px] border-b border-[#dddddd] w-[100px]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-[20px] text-center text-[#666666]">
                  Cargando historial de asignaciones...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="p-[20px] text-center text-[#c62828] bg-[#ffebee]">
                  {error}
                </td>
              </tr>
            ) : cargasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-[16px_10px] border-b border-[#f0f0f0] text-[#999999] text-center">
                  Sin cargas registradas con los filtros seleccionados
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
                  <td className="p-[7px_10px] border-b border-[#f0f0f0]">
                    {getEstadoBadge(carga.estado)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PIE DE LA TABLA: Implementado con el mismo estilo que BeneficiariesList */}
      <div className="p-[8px_12px] bg-[#ffffff] border-t border-[#dddddd] flex justify-between items-center text-[11px] text-[#666666] font-sans">
        <span>
          Mostrando {cargasFiltradas.length} registros (Total: {totalCargas} en historial)
        </span>
      </div>
    </div>
  );
};

export default CargaFondosList;