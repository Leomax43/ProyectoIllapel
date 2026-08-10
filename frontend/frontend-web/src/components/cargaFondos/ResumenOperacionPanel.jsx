const ResumenOperacionPanel = ({
  selectedBeneficiario,
  montoInput,
  pdfFileName,
  onCancel,
  onConfirmar,
  loading,
  formatCurrency
}) => {
  if (!selectedBeneficiario) return null;

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-amarillo text-azul text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-verde rounded-[2px] mr-[8px] align-middle"></span>
        Resumen de la solicitud
      </div>
      <div className="p-[16px]">
        <table className="w-full border-collapse text-[11px] mt-[6px]">
          <tbody>
            <tr>
              <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-gris-claro">Beneficiario</td>
              <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333] font-bold">
                {selectedBeneficiario.datos_personales?.nombre_familia}
              </td>
            </tr>
            <tr>
              <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-gris-claro">Monto a solicitar</td>
              <td className="px-[8px] py-[5px] border border-[#f0f0f0] font-bold text-[#c49300]">
                {montoInput ? formatCurrency(parseInt(montoInput)) : '$0'}
              </td>
            </tr>
            <tr>
              <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-gris-claro">PDF adjunto</td>
              <td className={`px-[8px] py-[5px] border border-[#f0f0f0] ${pdfFileName ? 'text-verde' : 'text-[#b52b2b]'}`}>
                {pdfFileName ? '✓ ' + pdfFileName : 'Pendiente'}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end gap-[8px] mt-[14px]">
          <button
            className="bg-white border border-gris-borde text-gris-texto rounded-[3px] px-[20px] py-[8px] text-[13px] cursor-pointer hover:bg-[#f5f5f5] disabled:opacity-50"
            onClick={onCancel}
            disabled={loading}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Cancelar
          </button>
          <button
            className="bg-verde text-white border-none rounded-[3px] px-[22px] py-[8px] text-[13px] font-bold cursor-pointer hover:brightness-110 disabled:opacity-50"
            onClick={onConfirmar}
            disabled={loading}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            {loading ? 'Procesando...' : 'Enviar Solicitud a Jefatura →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumenOperacionPanel;