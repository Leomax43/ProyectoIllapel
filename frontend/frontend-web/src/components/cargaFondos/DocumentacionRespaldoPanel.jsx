const DocumentacionRespaldoPanel = ({
  selectedBeneficiario,
  pdfFileName,
  onFileInputChange,
  onDragOver,
  onDragDrop
}) => {
  if (!selectedBeneficiario) return null;

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        4. Documentación de respaldo
      </div>
      <div className="p-[16px]">
        <div className="flex flex-col gap-[4px] mb-[13px]">
          <label className="text-[11px] text-gris-texto font-bold">
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
            className="border-2 border-dashed border-azul rounded-[4px] p-[16px] text-center bg-[#f0f4f6] cursor-pointer mt-[4px] hover:bg-[#e0eaf0]"
            onDragOver={onDragOver}
            onDrop={onDragDrop}
            onClick={() => document.getElementById('pdfInput').click()}
          >
            <div className="text-[26px] mb-[8px]">📄</div>
            {pdfFileName ? (
              <>
                <div className="text-[12px] font-bold text-azul mb-[4px]">
                  {pdfFileName}
                </div>
                <div className="text-[11px] text-gris-claro">Haz clic para cambiar</div>
              </>
            ) : (
              <>
                <div className="text-[12px] font-bold text-azul">Haga clic para adjuntar el PDF</div>
                <div className="text-[11px] text-gris-claro mt-[3px]">o arrastre el archivo aquí</div>
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