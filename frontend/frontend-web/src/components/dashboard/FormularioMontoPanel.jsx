import React from 'react';

const FormularioMontoPanel = ({
  selectedBeneficiario,
  montoInput,
  onMontoChange,
  tipoAyuda,
  onTipoAyudaChange,
  observaciones,
  onObservacionesChange,
  getNuevoSaldo,
  formatCurrency
}) => {
  if (!selectedBeneficiario) return null;

  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        3. Monto a asignar
      </div>
      <div className="p-[16px]">
        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-[#444444] font-bold">
            Monto <span className="text-[#b52b2b]">*</span>
          </label>
          <input
            type="number"
            placeholder="Ej: 50000"
            className="border border-[#cccccc] rounded-[3px] p-[7px_9px] text-[12px] text-[#333333] font-sans focus:outline-none"
            value={montoInput}
            onChange={(e) => onMontoChange(e.target.value)}
            min="1000"
          />
        </div>

        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-[#444444] font-bold">
            Motivo de la carga <span className="text-[#b52b2b]">*</span>
          </label>
          <select
            className="border border-[#cccccc] rounded-[3px] p-[7px_9px] text-[12px] text-[#333333] font-sans bg-[#ffffff] focus:outline-none"
            value={tipoAyuda}
            onChange={(e) => onTipoAyudaChange(e.target.value)}
          >
            <option>Seleccione...</option>
            <option>Alimentación</option>
            <option>Materiales de construcción</option>
            <option>Útiles escolares</option>
            <option>Otro</option>
          </select>
        </div>

        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-[#444444] font-bold">Observaciones</label>
          <textarea
            placeholder="Información adicional sobre esta asignación..."
            className="border border-[#cccccc] rounded-[3px] p-[7px_9px] text-[12px] text-[#333333] focus:outline-none resize-y min-h-[55px] font-sans"
            value={observaciones}
            onChange={(e) => onObservacionesChange(e.target.value)}
          />
        </div>

        <div className="bg-[#f0f6ff] border-[2px] border-[#2563a0] rounded-[4px] p-[12px_14px] text-center mt-[8px]">
          <div className="text-[11px] text-[#5580aa] mb-[4px]">Nuevo saldo (Aproximado si se aprueba)</div>
          <div className="text-[26px] font-bold text-[#1a3a5c]">{formatCurrency(getNuevoSaldo())}</div>
        </div>
      </div>
    </div>
  );
};

export default FormularioMontoPanel;