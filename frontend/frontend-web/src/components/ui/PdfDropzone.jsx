const PdfDropzone = ({ pdfFileName, onPdfChange, onMessageChange }) => {
  
  const handlePdfValidation = (file) => {
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      onMessageChange({ text: '❌ Solo se aceptan archivos PDF', type: 'error' });
      return;
    }

    const maxSizeMB = 10;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      onMessageChange({ text: `❌ El archivo excede el tamaño máximo de ${maxSizeMB} MB`, type: 'error' });
      return;
    }

    onPdfChange(file);
    onMessageChange(null);
  };

  const handleFileInputChange = (e) => {
    handlePdfValidation(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handlePdfValidation(e.dataTransfer.files[0]);
  };

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        3. Ficha Social (PDF)
      </div>
      <div className="p-[16px]">
        <label className="text-[11px] text-gris-texto font-bold block mb-[6px]">
          Adjunta la ficha social en formato PDF
        </label>
        <div
          className="border-2 border-dashed border-azul rounded-[4px] p-[24px] text-center bg-[#f9fafb] cursor-pointer transition-all hover:bg-[#f0f4f6]"
          onDragOver={handleDragOver}
          onDrop={handleDragDrop}
          onClick={() => document.getElementById('pdfInput').click()}
        >
          <input
            id="pdfInput"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileInputChange}
          />
          {pdfFileName ? (
            <div>
              <div className="text-[24px] mb-[8px]">📄</div>
              <div className="text-[13px] font-bold text-azul mb-[4px]">
                {pdfFileName}
              </div>
              <div className="text-[11px] text-gris-texto">
                Haz clic para cambiar el archivo
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[24px] mb-[8px]">📤</div>
              <div className="text-[13px] font-bold text-azul mb-[4px]">
                Arrastra tu PDF aquí
              </div>
              <div className="text-[11px] text-gris-texto">
                o haz clic para seleccionar (máx 10 MB)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfDropzone;