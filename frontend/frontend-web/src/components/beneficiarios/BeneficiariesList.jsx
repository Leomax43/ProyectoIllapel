const BeneficiariesList = ({ 
  beneficiaries, 
  searchTerm, 
  estadoFilter, 
  onSearchChange, 
  onEstadoChange,
  onSelectBeneficiary,
  selectedBeneficiaryId,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onNewSolicitud
}) => {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  const badgeStyle = (estado) => {
    if (estado === 'ACTIVO') return 'bg-[#e6f7f4] text-verde border border-[#b2e8de]';
    if (estado === 'PENDIENTE') return 'bg-[#fff8e0] text-[#a07800] border border-[#f0d970]';
    if (estado === 'BAJA') return 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]';
    return 'bg-[#e9ecef] text-[#555] border border-[#ddd]';
  };

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      {/* PANEL HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex justify-between items-center">
        <div>
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Listado de beneficiarios
        </div>
        <button
          onClick={() => onNewSolicitud && onNewSolicitud()}
          className="bg-verde border-none text-white rounded-[3px] px-[12px] py-[4px] text-[12px] cursor-pointer font-bold hover:brightness-110"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          + Nueva solicitud
        </button>
      </div>

      {/* CONTROLS */}
      <div className="px-[14px] py-[8px] flex gap-[8px] items-center flex-wrap border-b border-gris-borde bg-[#fafafa]">
        <input
          type="text"
          placeholder="Buscar por nombre, RUT o ficha..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[120px] border border-gris-borde rounded-[3px] px-[9px] py-[5px] text-[12px] outline-none focus:border-verde"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        />
        <select
          value={estadoFilter}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="border border-gris-borde rounded-[3px] px-[8px] py-[5px] text-[12px] text-gris-texto outline-none"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="BAJA">Baja</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">RUT</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Nombre</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Núcleo familiar</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Saldo</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Estado</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[7px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((ben) => (
            <tr
              key={ben.id_familia}
              onClick={() => onSelectBeneficiary(ben)}
              className={`hover:bg-[#f0f8f6] cursor-pointer ${
                selectedBeneficiaryId === ben.id_familia ? 'bg-[#e0eaf0]' : ''
              }`}
            >
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{ben.rut_representante}</td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{ben.nombre_familia}</td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">Fam. {ben.nombre_familia?.split(' ')[1] || 'N/A'}</td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">{formatMoney(ben.saldo)}</td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">
                <span className={`inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${badgeStyle(ben.estado)}`}>
                  {ben.estado}
                </span>
              </td>
              <td className="px-[12px] py-[7px] border-b border-[#f0f0f0] text-[#333]">
                <button className="px-[9px] py-[3px] rounded-[3px] text-[11px] border-none cursor-pointer text-white mr-[3px] bg-azul font-medium"
                  style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
                  Ver
                </button>
                {ben.estado === 'ACTIVO' && (
                  <button className="px-[9px] py-[3px] rounded-[3px] text-[11px] border-none cursor-pointer text-white bg-[#c49300] font-medium"
                    style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
                    Fondos
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGER */}
      <div className="px-[14px] py-[7px] text-[12px] text-gris-claro flex justify-between items-center border-t border-gris-borde bg-[#fafafa]">
        <span>Mostrando {beneficiaries.length} registros (Página {currentPage} de {totalPages})</span>
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
          <span className="text-[11px] font-bold text-[#333]">{currentPage}</span>
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

export default BeneficiariesList;