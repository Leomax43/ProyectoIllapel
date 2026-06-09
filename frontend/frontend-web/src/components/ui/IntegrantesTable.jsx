import React from 'react';

const IntegrantesTable = ({ integrantes, onIntegranteChange, onEliminarIntegrante, onAgregarIntegrante }) => {
  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        2. Otros integrantes del núcleo familiar (opcional)
      </div>
      <div className="p-[16px]">
        <label className="text-[11px] text-[#444444] font-bold block mb-[6px]">
          Si la solicitud incluye otros miembros (pareja, hijos, etc.), agréguelos aquí:
        </label>
        
        {integrantes.length > 0 && (
          <table className="w-full border-collapse text-[12px] mt-[8px]">
            <thead>
              <tr>
                <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[6px_10px] text-left border border-[#dddddd] font-bold">Nombres y apellidos</th>
                <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[6px_10px] text-left border border-[#dddddd] font-bold">RUT</th>
                <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[6px_10px] text-left border border-[#dddddd] font-bold">Parentesco</th>
                <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[6px_10px] text-left border border-[#dddddd] font-bold">Fecha de nacimiento</th>
                <th className="bg-[#e8f0f8] text-[#1a3a5c] p-[6px_10px] text-left border border-[#dddddd] font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {integrantes.map((integrante) => (
                <tr key={integrante.id}>
                  <td className="p-[6px_10px] border border-[#eeeeee] text-[#333333]">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="border-none bg-transparent p-[4px] text-[12px] text-[#333333] w-full focus:outline-none"
                      value={integrante.nombre_completo}
                      onChange={(e) => onIntegranteChange(integrante.id, 'nombre_completo', e.target.value)}
                    />
                  </td>
                  <td className="p-[6px_10px] border border-[#eeeeee] text-[#333333]">
                    <input
                      type="text"
                      placeholder="RUT"
                      className="border-none bg-transparent p-[4px] text-[12px] text-[#333333] w-full focus:outline-none"
                      value={integrante.rut}
                      onChange={(e) => onIntegranteChange(integrante.id, 'rut', e.target.value)}
                    />
                  </td>
                  <td className="p-[6px_10px] border border-[#eeeeee] text-[#333333]">
                    <select
                      className="border-none bg-transparent p-[4px] text-[12px] text-[#333333] w-full focus:outline-none"
                      value={integrante.parentesco}
                      onChange={(e) => onIntegranteChange(integrante.id, 'parentesco', e.target.value)}
                    >
                      <option>Cónyuge</option>
                      <option>Hijo/a</option>
                      <option>Padre/Madre</option>
                      <option>Otro</option>
                    </select>
                  </td>
                  <td className="p-[6px_10px] border border-[#eeeeee] text-[#333333]">
                    <input
                      type="date"
                      className="border-none bg-transparent p-[4px] text-[12px] text-[#333333] w-full focus:outline-none"
                      value={integrante.fecha_nacimiento}
                      onChange={(e) => onIntegranteChange(integrante.id, 'fecha_nacimiento', e.target.value)}
                    />
                  </td>
                  <td className="p-[6px_10px] border border-[#eeeeee] text-[#b52b2b] cursor-pointer text-center text-[14px]">
                    <span onClick={() => onEliminarIntegrante(integrante.id)}>✕</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button
          type="button"
          className="mt-[8px] bg-[#ffffff] border border-[#2563a0] text-[#2563a0] rounded-[3px] p-[5px_12px] text-[12px] cursor-pointer font-bold transition-colors hover:bg-[#f0f6ff]"
          onClick={onAgregarIntegrante}
        >
          + Agregar integrante
        </button>
      </div>
    </div>
  );
};

export default IntegrantesTable;