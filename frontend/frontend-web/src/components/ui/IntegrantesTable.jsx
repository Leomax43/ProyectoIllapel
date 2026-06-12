const IntegrantesTable = ({ integrantes, onIntegranteChange, onEliminarIntegrante, onAgregarIntegrante }) => {
  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        2. Otros integrantes del núcleo familiar (opcional)
      </div>
      <div className="p-[16px]">
        <label className="text-[11px] text-gris-texto font-bold block mb-[6px]">
          Si la solicitud incluye otros miembros (pareja, hijos, etc.), agréguelos aquí:
        </label>
        
        {integrantes.length > 0 && (
          <table className="w-full border-collapse text-[12px] mt-[8px]">
            <thead>
              <tr>
                <th className="bg-[#f0f4f6] text-azul px-[10px] py-[6px] text-left border border-gris-borde font-semibold text-[11px]">Nombres y apellidos</th>
                <th className="bg-[#f0f4f6] text-azul px-[10px] py-[6px] text-left border border-gris-borde font-semibold text-[11px]">RUT</th>
                <th className="bg-[#f0f4f6] text-azul px-[10px] py-[6px] text-left border border-gris-borde font-semibold text-[11px]">Parentesco</th>
                <th className="bg-[#f0f4f6] text-azul px-[10px] py-[6px] text-left border border-gris-borde font-semibold text-[11px]">Fecha de nacimiento</th>
                <th className="bg-[#f0f4f6] text-azul px-[10px] py-[6px] text-left border border-gris-borde font-semibold text-[11px]"></th>
              </tr>
            </thead>
            <tbody>
              {integrantes.map((integrante) => (
                <tr key={integrante.id}>
                  <td className="px-[10px] py-[6px] border border-[#f0f0f0] text-[#333]">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={integrante.nombre_completo}
                      onChange={(e) => onIntegranteChange(integrante.id, 'nombre_completo', e.target.value)}
                      className="border-none bg-transparent p-[4px] text-[12px] w-full outline-none"
                      style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                    />
                  </td>
                  <td className="px-[10px] py-[6px] border border-[#f0f0f0] text-[#333]">
                    <input
                      type="text"
                      placeholder="RUT"
                      value={integrante.rut}
                      onChange={(e) => onIntegranteChange(integrante.id, 'rut', e.target.value)}
                      className="border-none bg-transparent p-[4px] text-[12px] w-full outline-none"
                      style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                    />
                  </td>
                  <td className="px-[10px] py-[6px] border border-[#f0f0f0] text-[#333]">
                    <select
                      value={integrante.parentesco}
                      onChange={(e) => onIntegranteChange(integrante.id, 'parentesco', e.target.value)}
                      className="border-none bg-transparent p-[4px] text-[12px] w-full outline-none"
                      style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                    >
                      <option>Cónyuge</option>
                      <option>Hijo/a</option>
                      <option>Padre/Madre</option>
                      <option>Otro</option>
                    </select>
                  </td>
                  <td className="px-[10px] py-[6px] border border-[#f0f0f0] text-[#333]">
                    <input
                      type="date"
                      value={integrante.fecha_nacimiento}
                      onChange={(e) => onIntegranteChange(integrante.id, 'fecha_nacimiento', e.target.value)}
                      className="border-none bg-transparent p-[4px] text-[12px] w-full outline-none"
                      style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                    />
                  </td>
                  <td className="px-[10px] py-[6px] border border-[#f0f0f0] text-[#b52b2b] cursor-pointer text-center text-[14px]">
                    <span onClick={() => onEliminarIntegrante(integrante.id)}>✕</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button
          type="button"
          onClick={onAgregarIntegrante}
          className="mt-[8px] bg-white border border-azul text-azul rounded-[3px] px-[12px] py-[5px] text-[12px] cursor-pointer font-bold hover:bg-[#f0f4f6]"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          + Agregar integrante
        </button>
      </div>
    </div>
  );
};

export default IntegrantesTable;