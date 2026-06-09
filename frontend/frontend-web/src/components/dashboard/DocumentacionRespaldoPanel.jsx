import React from 'react';

const DocumentacionRespaldoPanel = ({
  selectedBeneficiario,
  pdfFileName,
  onFileInputChange,
  onDragOver,
  onDragDrop
}) => {
  if (!selectedBeneficiario) return null;

  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden mb-[14px]">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        4. Documentación de respaldo
      </div>
      <div className="p-[16px]">
        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-[#444444] font-bold">
            Adjuntar resolución / solicitud en PDF <span className="text-[#b52b2b]">*</span>
          </label>
          <input
            id="pdfInput"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onFileInputChange}
          />
          <div
            className="border-[2px] border-dashed border-[#2563a0] rounded-[4px] p-[16px] text-center bg-[#f0f6ff] cursor-pointer mt-[4px]"
            onDragOver={onDragOver}
            onDrop={onDragDrop}
            onClick={() => document.getElementById('pdfInput').click()}
          >
            <div className="text-[26px] mb-[8px]">📄</div>
            {pdfFileName ? (
              <>
                <div className="text-[12px] font-bold text-[#2563a0] mb-[4px]">
                  {pdfFileName}
                </div>
                <div className="text-[11px] text-[#888888]">Haz clic para cambiar</div>
              </>
            ) : (
              <>
                <div className="text-[12px] font-bold text-[#2563a0]">Haga clic para adjuntar el PDF</div>
                <div className="text-[11px] text-[#888888] mt-[3px]">o arrastre el archivo aquí</div>
                <div className="text-[11px] text-[#b52b2b] mt-[5px]">* Obligatorio · Solo .PDF · Máximo 10 MB</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentacionRespaldoPanel;