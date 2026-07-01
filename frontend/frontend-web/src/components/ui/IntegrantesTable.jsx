const IntegrantesTable = ({ integrantes, onIntegranteChange, onEliminarIntegrante, onAgregarIntegrante }) => {
  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex items-center gap-[8px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] flex-shrink-0"></span>
        2. Integrantes adicionales del núcleo
      </div>
      <div className="p-[16px]">
        <p className="text-[12px] text-gris-texto mb-[10px]">Si la familia tiene más integrantes (pareja, hijos, etc.), agréguelos aquí. Si el beneficiario vive solo, puede dejar esta sección vacía.</p>

        {integrantes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] min-w-[920px]">
              <thead>
                <tr>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">Nombre completo</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">RUT</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">Parentesco</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">Sexo</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">Fecha nacimiento</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">Teléfono</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">Correo</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">Discap.</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold">Obs.</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[7px] text-left border border-gris-borde font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {integrantes.map((integrante) => (
                  <tr key={integrante.id}>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2]">
                      <input type="text" value={integrante.nombre_completo} onChange={(e) => onIntegranteChange(integrante.id, 'nombre_completo', e.target.value)} placeholder="Nombre completo" className="border-none bg-transparent p-[3px_4px] text-[11px] w-full outline-none" />
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2]">
                      <input type="text" value={integrante.rut} onChange={(e) => onIntegranteChange(integrante.id, 'rut', e.target.value)} placeholder="RUT" className="border-none bg-transparent p-[3px_4px] text-[11px] w-full outline-none" />
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2]">
                      <select value={integrante.parentesco} onChange={(e) => onIntegranteChange(integrante.id, 'parentesco', e.target.value)} className="border-none bg-transparent p-[3px_4px] text-[11px] w-full outline-none">
                        <option value="">—</option>
                        <option value="Cónyuge">Cónyuge</option>
                        <option value="Hijo/a">Hijo/a</option>
                        <option value="Padre">Padre</option>
                        <option value="Madre">Madre</option>
                        <option value="Hermano/a">Hermano/a</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2]">
                      <select value={integrante.sexo} onChange={(e) => onIntegranteChange(integrante.id, 'sexo', e.target.value)} className="border-none bg-transparent p-[3px_4px] text-[11px] w-full outline-none">
                        <option value="">—</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2]">
                      <input type="date" value={integrante.fecha_nacimiento} onChange={(e) => onIntegranteChange(integrante.id, 'fecha_nacimiento', e.target.value)} className="border-none bg-transparent p-[3px_4px] text-[11px] w-full outline-none" />
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2]">
                      <input type="text" value={integrante.telefono} onChange={(e) => onIntegranteChange(integrante.id, 'telefono', e.target.value)} placeholder="+56 9..." className="border-none bg-transparent p-[3px_4px] text-[11px] w-full outline-none" />
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2]">
                      <input type="email" value={integrante.correo_electronico} onChange={(e) => onIntegranteChange(integrante.id, 'correo_electronico', e.target.value)} placeholder="correo@..." className="border-none bg-transparent p-[3px_4px] text-[11px] w-full outline-none" />
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2] text-center">
                      <input type="checkbox" checked={integrante.tiene_discapacidad} onChange={(e) => onIntegranteChange(integrante.id, 'tiene_discapacidad', e.target.checked)} className="w-[14px] h-[14px]" />
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2]">
                      <input type="text" value={integrante.observaciones} onChange={(e) => onIntegranteChange(integrante.id, 'observaciones', e.target.value)} placeholder="..." className="border-none bg-transparent p-[3px_4px] text-[11px] w-full outline-none" />
                    </td>
                    <td className="px-[6px] py-[5px] border border-[#eef0f2] text-center text-[#b52b2b] cursor-pointer">
                      <span onClick={() => onEliminarIntegrante(integrante.id)}>✕</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-[18px] text-[12px] text-gris-texto border border-dashed border-gris-borde rounded-[4px]">
            Aún no se han agregado miembros adicionales.
          </div>
        )}

        <button type="button" onClick={onAgregarIntegrante} className="mt-[8px] bg-white border border-verde text-verde rounded-[4px] px-[12px] py-[6px] text-[12px] font-semibold cursor-pointer hover:bg-[#f6fffb]">
          + Agregar integrante
        </button>
      </div>
    </div>
  );
};

export default IntegrantesTable;