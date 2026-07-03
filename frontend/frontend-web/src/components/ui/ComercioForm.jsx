const ComercioForm = ({ comercio, onComercioChange }) => {
  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        Datos del Establecimiento comercial
      </div>
      <div className="p-[16px]">
        <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Nombre del comercio <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Almacén El Sol"
              value={comercio.nombre_comercio}
              onChange={(e) => onComercioChange('nombre_comercio', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              RUT Comercio <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: 76.123.456-K"
              value={comercio.rut}
              onChange={(e) => onComercioChange('rut', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Nombre del Responsable <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={comercio.responsable}
              onChange={(e) => onComercioChange('responsable', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Teléfono de contacto <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: +56 9 8765 4321"
              value={comercio.telefono}
              onChange={(e) => onComercioChange('telefono', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Rubro <span className="text-[#b52b2b]">*</span>
            </label>
            <select
              value={comercio.rubro}
              onChange={(e) => onComercioChange('rubro', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              <option disabled value="Seleccione...">Seleccione...</option>
              <option>Almacén / Minimarket</option>
              <option>Panadería / Pastelería</option>
              <option>Carnicería / Rotisería</option>
              <option>Feria libre / Frutas y Verduras</option>
              <option>Farmacia</option>
              <option>Librería / Bazar</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-gris-texto font-bold">
              Dirección <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Calle y número"
              value={comercio.direccion}
              onChange={(e) => onComercioChange('direccion', e.target.value)}
              className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
          </div>

          {/* NUEVA SECCIÓN: Clave de acceso */}
          <div className="flex flex-col gap-[4px] col-span-2 mt-[8px]">
            <label className="text-[11px] text-gris-texto font-bold">Clave de acceso a la app</label>
            
            <div className="bg-[#e8f5e9] border border-[#a5d6a7] text-[#2e7d32] rounded-[3px] p-[8px_12px] text-[12px] flex items-center gap-[8px] mb-[4px]">
              <span>🔑</span> Se generará una clave automáticamente si no se especifica una.
            </div>
            
            <label className="flex items-center gap-[8px] text-[12px] text-gris-texto cursor-pointer w-fit mb-[4px] mt-[4px]">
              <input
                type="checkbox"
                checked={comercio.quiero_definir_clave || false}
                onChange={(e) => onComercioChange('quiero_definir_clave', e.target.checked)}
                className="accent-verde cursor-pointer"
              />
              Quiero definir una clave ahora
            </label>

            {/* Inputs de contraseña (Solo se muestran si el checkbox está activo) */}
            {comercio.quiero_definir_clave && (
              <div className="grid grid-cols-2 gap-[12px] mt-[8px]">
                <div className="flex flex-col gap-[4px]">
                  <input
                    type="password"
                    placeholder="Nueva clave (mín. 6 caracteres)"
                    value={comercio.clave_acceso || ''}
                    onChange={(e) => onComercioChange('clave_acceso', e.target.value)}
                    className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
                    style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <input
                    type="password"
                    placeholder="Confirmar clave"
                    value={comercio.confirmar_clave || ''}
                    onChange={(e) => onComercioChange('confirmar_clave', e.target.value)}
                    className="border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] w-full outline-none focus:border-verde"
                    style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComercioForm;