const BuscarBeneficiarioPanel = ({
  searchTerm,
  onSearchChange,
  loadingSearch,
  beneficiariosList,
  onSelectBeneficiario,
  selectedBeneficiario,
  formatCurrency,
  badgeStyle
}) => {
  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        1. Buscar beneficiario
      </div>
      <div className="p-[16px]">
        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-gris-texto font-bold">
            Buscar por RUT o nombre <span className="text-[#b52b2b]">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: 12.345.678-9 o Rosa Martínez..."
            className="border border-gris-borde rounded-[3px] px-[9px] py-[7px] text-[12px] outline-none flex-1 focus:border-verde"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {loadingSearch && (
            <div className="text-[12px] text-azul mt-[4px]">
              Buscando...
            </div>
          )}
        </div>

        {/* Lista de resultados */}
        {beneficiariosList.length > 0 && (
          <div className="border border-gris-borde rounded-[4px] max-h-[250px] overflow-y-auto mt-[4px]">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Nombre</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">RUT</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {beneficiariosList.map((beneficiario) => (
                  <tr 
                    key={beneficiario.id_familia}
                    onClick={() => onSelectBeneficiario(beneficiario)}
                    className="cursor-pointer hover:bg-[#f0f8f6]"
                  >
                    <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{beneficiario.nombre_representante}</td>
                    <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{beneficiario.rut_representante}</td>
                    <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">
                      <span className={badgeStyle(beneficiario.estado)}>{beneficiario.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {searchTerm.trim() && !loadingSearch && beneficiariosList.length === 0 && (
          <div className="p-[12px] bg-[#fff8e0] border border-[#f0d970] rounded-[4px] text-[12px] text-[#a07800] mt-[4px]">
            No se encontraron beneficiarios con ese término
          </div>
        )}

        {selectedBeneficiario && (
          <div className="border border-azul rounded-[4px] p-[12px_14px] mt-[4px] bg-[#e0eaf0]">
            <div className="flex justify-between items-start">
              <div className="text-[14px] font-bold text-azul mb-[4px]">{selectedBeneficiario.datos_personales?.nombre_familia}</div>
              <span className={badgeStyle(selectedBeneficiario.datos_personales?.estado)}>{selectedBeneficiario.datos_personales?.estado}</span>
            </div>
            <div className="grid grid-cols-2 gap-[6px] mt-[6px]">
              <div className="text-[11px]">
                <span className="text-gris-texto">RUT: </span>
                <span className="text-azul font-bold">{selectedBeneficiario.datos_personales?.rut_representante}</span>
              </div>
              <div className="text-[11px]">
                <span className="text-gris-texto">ID Familia: </span>
                <span className="text-azul font-bold">{selectedBeneficiario.datos_personales?.id_familia}</span>
              </div>
              <div className="text-[11px]">
                <span className="text-gris-texto">Integrantes: </span>
                <span className="text-azul font-bold">{selectedBeneficiario.nucleo_familiar?.length || 0}</span>
              </div>
              <div className="text-[11px]">
                <span className="text-gris-texto">Saldo actual: </span>
                <span className="text-azul font-bold">
                  {formatCurrency(selectedBeneficiario.datos_personales?.saldo || 0)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarBeneficiarioPanel;