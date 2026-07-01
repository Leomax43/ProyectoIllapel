import { useRef } from 'react';

const PdfDropzone = ({ pdfFileName, onPdfChange, onMessageChange }) => {
  const fileInputRef = useRef(null);

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
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex items-center gap-[8px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] flex-shrink-0"></span>
        3. Documentación de respaldo
      </div>
      <div className="p-[16px]">
        <div className="border-2 border-dashed border-celeste rounded-[5px] p-[18px] text-center bg-[#f0faff] cursor-pointer" onDragOver={handleDragOver} onDrop={handleDragDrop} onClick={() => fileInputRef.current?.click()}>
          <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileInputChange} />
          <div className="text-[28px] mb-[6px]">📄</div>
          <div className="text-[12px] font-semibold text-azul">Haga clic para adjuntar la Ficha Social en PDF</div>
          <div className="text-[11px] text-gris-texto mt-[3px]">o arrastre el archivo a esta zona</div>
          <div className="text-[11px] text-[#b52b2b] mt-[5px]">* Obligatorio · Solo archivos .PDF · Máximo 10 MB</div>
          {pdfFileName && (
            <div className="mt-[8px] text-[12px] font-semibold text-verde">{pdfFileName}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfDropzone;