import React from 'react';

const BeneficiarioForm = ({ beneficiario, onBeneficiarioChange }) => {
  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        1. Datos del beneficiario principal
      </div>
      <div className="p-[16px]">
        <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Nombres <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Rosa María"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full"
              value={beneficiario.nombres}
              onChange={(e) => onBeneficiarioChange('nombres', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Apellidos <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Martinez Ríos"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full"
              value={beneficiario.apellidos}
              onChange={(e) => onBeneficiarioChange('apellidos', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              RUT <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: 12.345.678-9"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full"
              value={beneficiario.rut}
              onChange={(e) => onBeneficiarioChange('rut', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Fecha de nacimiento <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="date"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full"
              value={beneficiario.fecha_nacimiento}
              onChange={(e) => onBeneficiarioChange('fecha_nacimiento', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">Teléfono de contacto</label>
            <input
              type="text"
              placeholder="Ej: +56 9 1234 5678"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full"
              value={beneficiario.telefono}
              onChange={(e) => onBeneficiarioChange('telefono', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Dirección <span className="text-[#b52b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="Calle, número, villa"
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full"
              value={beneficiario.direccion}
              onChange={(e) => onBeneficiarioChange('direccion', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-[4px]">
            <label className="text-[11px] text-[#444444] font-bold">
              Rol en el hogar <span className="text-[#b52b2b]">*</span>
            </label>
            <select
              className="border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] w-full bg-[#ffffff]"
              value={beneficiario.rol_en_hogar}
              onChange={(e) => onBeneficiarioChange('rol_en_hogar', e.target.value)}
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