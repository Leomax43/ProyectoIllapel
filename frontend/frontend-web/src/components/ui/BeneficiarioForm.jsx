const BeneficiarioForm = ({ beneficiario, onBeneficiarioChange }) => {
  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex items-center gap-[8px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] flex-shrink-0"></span>
        1. Datos del representante y del núcleo familiar
      </div>
      <div className="p-[16px]">
        <div className="text-[11px] font-semibold text-azul uppercase tracking-[0.4px] mb-[10px] pb-[5px] border-b border-gris-borde">
          Datos personales del representante (beneficiario principal)
        </div>

        <div className="grid grid-cols-3 gap-[12px] mb-[14px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">RUT <span className="text-[#b52b2b]">*</span></label>
            <input type="text" value={beneficiario.rut} onChange={(e) => onBeneficiarioChange('rut', e.target.value)} placeholder="Ej: 12.345.678-9" className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Nombre completo <span className="text-[#b52b2b]">*</span></label>
            <input type="text" value={beneficiario.nombre_completo} onChange={(e) => onBeneficiarioChange('nombre_completo', e.target.value)} placeholder="Nombre y apellidos" className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Fecha de nacimiento <span className="text-[#b52b2b]">*</span></label>
            <input type="date" value={beneficiario.fecha_nacimiento} onChange={(e) => onBeneficiarioChange('fecha_nacimiento', e.target.value)} className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-[12px] mb-[14px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Sexo</label>
            <select value={beneficiario.sexo} onChange={(e) => onBeneficiarioChange('sexo', e.target.value)} className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde">
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Teléfono</label>
            <input type="text" value={beneficiario.telefono} onChange={(e) => onBeneficiarioChange('telefono', e.target.value)} placeholder="+56 9 1234 5678" className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Correo electrónico</label>
            <input type="email" value={beneficiario.correo_electronico} onChange={(e) => onBeneficiarioChange('correo_electronico', e.target.value)} placeholder="correo@ejemplo.cl" className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
          </div>
          <div className="flex flex-col gap-[4px] justify-end pb-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">¿Tiene discapacidad?</label>
            <label className="flex items-center gap-[8px] text-[12px] text-gris-texto cursor-pointer">
              <input type="checkbox" checked={beneficiario.tiene_discapacidad} onChange={(e) => onBeneficiarioChange('tiene_discapacidad', e.target.checked)} className="w-[16px] h-[16px]" />
              Sí, tiene discapacidad
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[12px] mb-[14px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Observaciones del representante</label>
            <textarea value={beneficiario.observaciones} onChange={(e) => onBeneficiarioChange('observaciones', e.target.value)} placeholder="Información adicional sobre el representante..." className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde min-h-[72px]" />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Clave de acceso a la app</label>
            <div className="bg-[#e6f7f4] border border-verde rounded-[4px] px-[10px] py-[8px] text-[12px] text-[#0a6b56]">
              🔑 Se generará una clave automáticamente si no se especifica una.
            </div>
            <label className="flex items-center gap-[8px] text-[12px] text-gris-texto cursor-pointer mt-[8px]">
              <input type="checkbox" checked={beneficiario.quiero_definir_clave} onChange={(e) => onBeneficiarioChange('quiero_definir_clave', e.target.checked)} className="w-[14px] h-[14px]" />
              Quiero definir una clave ahora
            </label>
            {beneficiario.quiero_definir_clave && (
              <div className="bg-[#f0faff] border border-celeste rounded-[4px] p-[10px_12px] mt-[8px]">
                <input type="password" value={beneficiario.clave_acceso} onChange={(e) => onBeneficiarioChange('clave_acceso', e.target.value)} placeholder="Crear clave de acceso" className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde mb-[8px]" />
                <input type="password" value={beneficiario.confirmar_clave} onChange={(e) => onBeneficiarioChange('confirmar_clave', e.target.value)} placeholder="Repetir clave" className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
                <div className="text-[10px] text-gris-texto mt-[4px]">Mínimo 6 caracteres.</div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gris-borde my-[16px]"></div>

        <div className="text-[11px] font-semibold text-azul uppercase tracking-[0.4px] mb-[10px] pb-[5px] border-b border-gris-borde">
          Datos del núcleo familiar
        </div>
        <div className="grid grid-cols-4 gap-[12px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Dirección <span className="text-[#b52b2b]">*</span></label>
            <input type="text" value={beneficiario.direccion} onChange={(e) => onBeneficiarioChange('direccion', e.target.value)} placeholder="Calle, número, villa..." className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Sector / Localidad <span className="text-[#b52b2b]">*</span></label>
            <input type="text" value={beneficiario.sector_localidad} onChange={(e) => onBeneficiarioChange('sector_localidad', e.target.value)} placeholder="Ej: Villa El Sauce, Sector Norte..." className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Teléfono del hogar</label>
            <input type="text" value={beneficiario.telefono_hogar} onChange={(e) => onBeneficiarioChange('telefono_hogar', e.target.value)} placeholder="Teléfono fijo o alternativo" className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">Rol en el hogar</label>
            <select value={beneficiario.rol_en_hogar} onChange={(e) => onBeneficiarioChange('rol_en_hogar', e.target.value)} className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde">
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