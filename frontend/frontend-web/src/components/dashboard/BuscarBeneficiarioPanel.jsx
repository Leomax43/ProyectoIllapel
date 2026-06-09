import React from 'react';

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
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        1. Buscar beneficiario
      </div>
      <div className="p-[16px]">
        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-[#444444] font-bold">
            Buscar por RUT o nombre <span className="text-[#b52b2b]">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: 12.345.678-9 o Rosa Martínez..."
            className="border border-[#cccccc] rounded-[3px] p-[7px_9px] text-[12px] text-[#333333] font-sans focus:outline-none flex-1"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {loadingSearch && (
            <div className="text-[12px] text-[#2563a0] mt-[4px]">
              Buscando...
            </div>
          )}
        </div>

        {/* Lista de resultados de búsqueda */}
        {beneficiariosList.length > 0 && (
          <div className="border border-[#dddddd] rounded-[4px] max-h-[250px] overflow-y-auto mt-[4px]">
            <table className="w-full border-collapse text-[11px] m-0 mt-0">
              <thead>
                <tr>
                  <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[5px_8px] text-left border border-[#dddddd]">Nombre</th>
                  <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[5px_8px] text-left border border-[#dddddd]">RUT</th>
                  <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[5px_8px] text-left border border-[#dddddd]">Estado</th>
                </tr>
              </thead>
              <tbody>
                {beneficiariosList.map((beneficiario) => (
                  <tr 
                    key={beneficiario.id_familia}
                    onClick={() => onSelectBeneficiario(beneficiario)}
                    className="cursor-pointer transition-colors bg-[#ffffff] hover:bg-[#f0f6ff]"
                  >
                    <td className="p-[5px_8px] border border-[#eeeeee] text-[#333333]">{beneficiario.nombre_familia}</td>
                    <td className="p-[5px_8px] border border-[#eeeeee] text-[#333333]">{beneficiario.rut_representante}</td>
                    <td className="p-[5px_8px] border border-[#eeeeee] text-[#333333]">
                      <span className={badgeStyle(beneficiario.estado)}>{beneficiario.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {searchTerm.trim() && !loadingSearch && beneficiariosList.length === 0 && (
          <div className="p-[12px] bg-[#fff3cd] border border-[#ffc107] rounded-[4px] text-[12px] text-[#856404] mt-[4px]">
            No se encontraron beneficiarios con ese término
          </div>
        )}

        {selectedBeneficiario && (
          <div className="bg-[#e0edff] border border-[#2563a0] rounded-[4px] p-[12px_14px] mt-[4px]">
            <div className="flex justify-between items-start">
              <div className="text-[14px] font-bold text-[#1a3a5c] mb-[4px]">{selectedBeneficiario.datos_personales?.nombre_familia}</div>
              <span className={badgeStyle(selectedBeneficiario.datos_personales?.estado)}>{selectedBeneficiario.datos_personales?.estado}</span>
            </div>
            <div className="grid grid-cols-2 gap-[6px] mt-[6px]">
              <div className="text-[11px]">
                <span className="text-[#5580aa]">RUT: </span>
                <span className="text-[#1a3a5c] font-bold">{selectedBeneficiario.datos_personales?.rut_representante}</span>
              </div>
              <div className="text-[11px]">
                <span className="text-[#5580aa]">ID Familia: </span>
                <span className="text-[#1a3a5c] font-bold">{selectedBeneficiario.datos_personales?.id_familia}</span>
              </div>
              <div className="text-[11px]">
                <span className="text-[#5580aa]">Integrantes: </span>
                <span className="text-[#1a3a5c] font-bold">{selectedBeneficiario.nucleo_familiar?.length || 0}</span>
              </div>
              <div className="text-[11px]">
                <span className="text-[#5580aa]">Saldo actual: </span>
                <span className="text-[#1a3a5c] font-bold">
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