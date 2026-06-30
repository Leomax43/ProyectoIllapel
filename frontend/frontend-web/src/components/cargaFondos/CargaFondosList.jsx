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
  error,
  currentPage = 1,
  totalPages = 1,
  onNextPage = () => {},
  onPrevPage = () => {}
}) => {
  const getEstadoBadge = (estado) => {
    const normalizado = estado ? estado.toUpperCase() : 'PENDIENTE';
    const baseClass = "inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold border";
    
    if (normalizado === 'APROBADO' || normalizado === 'ACTIVO') {
      return <span className={`${baseClass} bg-[#e6f7f4] text-verde border-[#b2e8de]`}>{normalizado}</span>;
    } else if (normalizado === 'PENDIENTE') {
      return <span className={`${baseClass} bg-[#fff8e0] text-[#a07800] border-[#f0d970]`}>{normalizado}</span>;
    } else if (normalizado === 'RECHAZADO' || normalizado === 'BLOQUEADO' || normalizado === 'BAJA') {
      return <span className={`${baseClass} bg-[#fde8e8] text-[#b52b2b] border-[#f5b8b8]`}>{normalizado}</span>;
    }
    
    return <span className={baseClass}>{normalizado}</span>;
  };

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      {/* PANEL HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex justify-between items-center">
        <div>
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Historial de cargas
        </div>
        <button
          onClick={onNewCarga}
          className="bg-verde border-none text-white rounded-[3px] px-[14px] py-[4px] text-[12px] cursor-pointer font-bold hover:brightness-110"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          + Nueva carga
        </button>
      </div>

      {/* CONTROLS */}
      <div className="px-[12px] py-[8px] flex gap-[8px] items-center flex-wrap border-b border-gris-borde bg-[#fafafa]">
        <input
          type="text"
          placeholder="Buscar por beneficiario o RUT..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[180px] border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] outline-none focus:border-verde"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        />
        
        <select
          value={estadoFilter}
          onChange={(e) => onEstadoFilterChange(e.target.value)}
          className="border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] text-gris-texto outline-none min-w-[130px]"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="APROBADO">APROBADO</option>
          <option value="RECHAZADO">RECHAZADO</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead>
            <tr>
              <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste w-[50px]">ID</th>
              <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste w-[90px]">Fecha</th>
              <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Beneficiario</th>
              <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Motivo</th>
              <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste w-[100px]">Monto</th>
              <th className="bg-[#f0f4f6] text-azul px-[10px] py-[7px] font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste w-[100px]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-[20px] text-center text-gris-texto">
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
                <td colSpan="6" className="px-[10px] py-[16px] border-b border-[#f0f0f0] text-gris-claro text-center">
                  Sin cargas registradas con los filtros seleccionados
                </td>
              </tr>
            ) : (
              cargasFiltradas.map((carga) => (
                <tr
                  key={carga.id_carga}
                  onClick={() => onCargaSelect(carga)}
                  className={`cursor-pointer hover:bg-[#f0f8f6] ${
                    selectedCarga?.id_carga === carga.id_carga ? 'bg-[#e0eaf0]' : ''
                  }`}
                >
                  <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{carga.id_carga}</td>
                  <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{formatDate(carga.fecha)}</td>
                  <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{carga.nombre_representante || carga.nombre_familia}</td>
                  <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{carga.motivo || '—'}</td>
                  <td className="px-[10px] py-[7px] border-b border-[#f0f0f0] text-verde font-bold">
                    ${formatCurrency(carga.monto)}
                  </td>
                  <td className="px-[10px] py-[7px] border-b border-[#f0f0f0]">
                    {getEstadoBadge(carga.estado)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGER */}
      <div className="px-[12px] py-[8px] bg-white border-t border-gris-borde flex justify-between items-center text-[11px] text-gris-claro">
        <span>
          Mostrando {cargasFiltradas.length} registros (Total: {totalCargas} registros)
        </span>
        <div className="flex gap-[8px] items-center">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className={`px-[8px] py-[3px] rounded-[3px] text-[11px] border border-gris-borde ${
              currentPage === 1 ? 'bg-[#e0e0e0] text-gris-claro cursor-not-allowed' : 'bg-white text-[#333] cursor-pointer'
            }`}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Anterior
          </button>
          <span className="text-[11px] font-bold text-[#333]">{currentPage} de {totalPages}</span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className={`px-[8px] py-[3px] rounded-[3px] text-[11px] border border-gris-borde ${
              currentPage >= totalPages ? 'bg-[#e0e0e0] text-gris-claro cursor-not-allowed' : 'bg-white text-[#333] cursor-pointer'
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

export default CargaFondosList;