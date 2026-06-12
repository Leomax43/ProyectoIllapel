const ValidacionFamiliarPanel = ({ selectedBeneficiario, badgeStyle }) => {
  if (!selectedBeneficiario) return null;

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        2. Validación familiar (regla 30 días)
      </div>
      <div className="p-[16px]">
        <div className="bg-[#e6f7f4] border border-[#b2e8de] rounded-[3px] p-[8px_12px] text-[12px] text-verde mb-[14px]">
          ✔ El núcleo familiar de {selectedBeneficiario.datos_personales?.nombre_familia} no ha recibido fondos en los últimos 30 días. La carga puede proceder.
        </div>
        <table className="w-full border-collapse text-[11px] mt-[6px]">
          <thead>
            <tr>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Integrante</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">RUT</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Parentesco</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {selectedBeneficiario.nucleo_familiar?.map((integrante, idx) => (
              <tr key={idx}>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{integrante.nombre_completo}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{integrante.rut}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{integrante.parentesco || '—'}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">
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