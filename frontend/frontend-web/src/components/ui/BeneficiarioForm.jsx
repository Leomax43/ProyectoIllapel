const BeneficiarioForm = ({ beneficiario, onBeneficiarioChange }) => {
  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        1. Datos del beneficiario principal
      </div>
      <div className="p-[16px]">
        <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Nombres <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Rosa María"
              value={beneficiario.nombres}
              onChange={(e) => onBeneficiarioChange('nombres', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Apellidos <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Martinez Ríos"
              value={beneficiario.apellidos}
              onChange={(e) => onBeneficiarioChange('apellidos', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              RUT <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: 12.345.678-9"
              value={beneficiario.rut}
              onChange={(e) => onBeneficiarioChange('rut', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Fecha de nacimiento <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="date"
              value={beneficiario.fecha_nacimiento}
              onChange={(e) => onBeneficiarioChange('fecha_nacimiento', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Teléfono de contacto</label>
            <input
              type="text"
              placeholder="Ej: +56 9 1234 5678"
              value={beneficiario.telefono}
              onChange={(e) => onBeneficiarioChange('telefono', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Dirección <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Calle, número, villa"
              value={beneficiario.direccion}
              onChange={(e) => onBeneficiarioChange('direccion', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Rol en el hogar <span className="text-[#b52b2b]">*</span>
            </label>
            <select
              value={beneficiario.rol_en_hogar}
              onChange={(e) => onBeneficiarioChange('rol_en_hogar', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              <option>Jefa de hogar</option>
              <option>Jefe de hogar</option>
              <option>Cónyuge</option>
              <option>Hijo/a</option>
              <option>Padre/Madre</option>
              <option>Otro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiarioForm;