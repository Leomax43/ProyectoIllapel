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
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        3. Monto a asignar
      </div>
      <div className="p-[16px]">
        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-gris-texto font-bold">
            Monto <span className="text-[#b52b2b]">*</span>
          </label>
          <input
            type="number"
            placeholder="Ej: 50000"
            value={montoInput}
            onChange={(e) => onMontoChange(e.target.value)}
            min="1000"
            className="border border-gris-borde rounded-[3px] px-[9px] py-[7px] text-[12px] outline-none focus:border-verde"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          />
        </div>

        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-gris-texto font-bold">
            Motivo de la carga <span className="text-[#b52b2b]">*</span>
          </label>
          <select
            value={tipoAyuda}
            onChange={(e) => onTipoAyudaChange(e.target.value)}
            className="border border-gris-borde rounded-[3px] px-[9px] py-[7px] text-[12px] outline-none"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            <option>Seleccione...</option>
            <option>Alimentos</option>
            <option>Servicios funerarios</option>
            <option>Prestación Salud</option>
            <option>Prestación Pasaje</option>
            <option>Prestación Vivienda</option>
            <option>Prestación Educación</option>
            <option>Prestación Mediaguas</option>
            <option>Prestación Vestuario</option>
            <option>Gastos Básicos</option>
            <option>Otro</option>
          </select>
        </div>

        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-gris-texto font-bold">Observaciones</label>
          <textarea
            placeholder="Información adicional sobre esta asignación..."
            value={observaciones}
            onChange={(e) => onObservacionesChange(e.target.value)}
            className="border border-gris-borde rounded-[3px] px-[9px] py-[7px] text-[12px] outline-none resize-y min-h-[55px] focus:border-verde"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          />
        </div>

        <div className="border-2 border-azul rounded-[4px] p-[12px_14px] text-center mt-[8px] bg-[#e0eaf0]">
          <div className="text-[11px] text-gris-texto mb-[4px]">Nuevo saldo (Aproximado si se aprueba)</div>
          <div className="text-[26px] font-bold text-azul">{formatCurrency(getNuevoSaldo())}</div>
        </div>
      </div>
    </div>
  );
};

export default FormularioMontoPanel;