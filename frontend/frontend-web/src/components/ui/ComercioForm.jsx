import React from 'react';

const ComercioForm = ({ comercio, onComercioChange }) => {
  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        Datos del Establecimiento comercial
      </div>
      <div className="p-[16px]">
        <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Nombre del comercio <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Almacén El Sol"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full focus:outline-none"
              value={comercio.nombre_comercio}
              onChange={(e) => onComercioChange('nombre_comercio', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              RUT Comercio <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: 76.123.456-K"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full focus:outline-none"
              value={comercio.rut}
              onChange={(e) => onComercioChange('rut', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Nombre del Responsable <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full focus:outline-none"
              value={comercio.responsable}
              onChange={(e) => onComercioChange('responsable', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Teléfono de contacto <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: +56 9 8765 4321"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full focus:outline-none"
              value={comercio.telefono}
              onChange={(e) => onComercioChange('telefono', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Rubro <span className="text-[#b52b2b]">*</span>
            </label>
            <select
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full bg-[#ffffff] focus:outline-none"
              value={comercio.rubro}
              onChange={(e) => onComercioChange('rubro', e.target.value)}
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
            <label className="text-[11px] text-[#444444] font-bold">
              Dirección <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Calle y número"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full focus:outline-none"
              value={comercio.direccion}
              onChange={(e) => onComercioChange('direccion', e.target.value)}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComercioForm;