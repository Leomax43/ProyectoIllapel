import React from 'react';

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
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#e67e1a] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        Resumen de la solicitud
      </div>
      <div className="p-[16px]">
        <table className="w-full border-collapse text-[11px] mt-[6px]">
          <tbody>
            <tr>
              <td className="p-[5px_8px] border border-[#eeeeee] text-[#888888]">Beneficiario</td>
              <td className="p-[5px_8px] border border-[#eeeeee] text-[#333333] font-bold">
                {selectedBeneficiario.datos_personales?.nombre_familia}
              </td>
            </tr>
            <tr>
              <td className="p-[5px_8px] border border-[#eeeeee] text-[#888888]">Monto a solicitar</td>
              <td className="p-[5px_8px] border border-[#eeeeee] font-bold text-[#e67e1a]">
                {montoInput ? formatCurrency(parseInt(montoInput)) : '$0'}
              </td>
            </tr>
            <tr>
              <td className="p-[5px_8px] border border-[#eeeeee] text-[#888888]">PDF adjunto</td>
              <td className={`p-[5px_8px] border border-[#eeeeee] ${pdfFileName ? 'text-[#2e7d32]' : 'text-[#b52b2b]'}`}>
                {pdfFileName ? '✓ ' + pdfFileName : 'Pendiente'}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end gap-[8px] mt-[14px]">
          <button
            className="bg-[#ffffff] border border-[#aaaaaa] text-[#555555] rounded-[3px] p-[8px_20px] text-[13px] cursor-pointer hover:bg-[#f5f5f5] disabled:opacity-50"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-[#1e7a3e] border-none text-[#ffffff] rounded-[3px] p-[8px_22px] text-[13px] font-bold cursor-pointer hover:bg-[#157a3e] disabled:opacity-50"
            onClick={onConfirmar}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Enviar Solicitud a Jefatura →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumenOperacionPanel;