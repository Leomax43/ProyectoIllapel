import React from 'react';

const ValidacionFamiliarPanel = ({ selectedBeneficiario, badgeStyle }) => {
  if (!selectedBeneficiario) return null;

  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        2. Validación familiar (regla 30 días)
      </div>
      <div className="p-[16px]">
        <div className="bg-[#d1e7dd] border border-[#0f5132] rounded-[3px] p-[8px_12px] text-[12px] text-[#0f5132] mb-[14px]">
          ✔ El núcleo familiar de {selectedBeneficiario.datos_personales?.nombre_familia} no ha recibido fondos en los últimos 30 días. La carga puede proceder.
        </div>
        <table className="w-full border-collapse text-[11px] mt-[6px]">
          <thead>
            <tr>
              <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[5px_8px] text-left border border-[#dddddd]">Integrante</th>
              <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[5px_8px] text-left border border-[#dddddd]">RUT</th>
              <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[5px_8px] text-left border border-[#dddddd]">Parentesco</th>
              <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[5px_8px] text-left border border-[#dddddd]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {selectedBeneficiario.nucleo_familiar?.map((integrante, idx) => (
              <tr key={idx}>
                <td className="p-[5px_8px] border border-[#eeeeee] text-[#333333]">{integrante.nombre_completo}</td>
                <td className="p-[5px_8px] border border-[#eeeeee] text-[#333333]">{integrante.rut}</td>
                <td className="p-[5px_8px] border border-[#eeeeee] text-[#333333]">{integrante.parentesco || '—'}</td>
                <td className="p-[5px_8px] border border-[#eeeeee] text-[#333333]">
                  <span className={badgeStyle('Activo')}>Activo</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidacionFamiliarPanel;