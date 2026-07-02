const AppMovilQR = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-[8px] p-[24px] max-w-[420px] w-full mx-[16px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-[16px]">
          <div className="text-[16px] font-bold text-azul">App Móvil — Billetera Digital</div>
          <button 
            onClick={onClose}
            className="text-gris-texto hover:text-[#333] text-[20px] leading-none cursor-pointer bg-transparent border-none"
          >
            ✕
          </button>
        </div>

        {/* Instrucciones */}
        <div className="bg-[#f0f8f6] border border-[#b2e8de] rounded-[6px] p-[14px] mb-[16px]">
          <div className="text-[13px] font-bold text-verde mb-[8px]">📱 Instrucciones de uso</div>
          <ol className="text-[12px] text-[#333] space-y-[6px] list-decimal pl-[18px]">
            <li>Descarga <strong>Expo Go</strong> desde Google Play o App Store.</li>
            <li>Abre Expo Go en tu celular.</li>
            <li>Escanea el código QR que aparece en la terminal al ejecutar <code className="bg-[#f5f5f5] px-[4px] py-[1px] rounded text-[10px]">npx expo start</code>.</li>
            <li>Ingresa con tu RUT y clave de acceso.</li>
            <li>Podrás ver tu saldo, historial y generar código QR para pagar.</li>
          </ol>
        </div>

        {/* Nota */}
        <div className="text-[11px] text-gris-claro italic bg-[#fff8e0] border border-[#f0d970] rounded-[4px] p-[10px]">
          ⚠️ Para usar la app, un funcionario debe ejecutar <code className="bg-[#f5f5f5] px-[4px] py-[1px] rounded text-[10px]">npx expo start</code> en la carpeta <code className="bg-[#f5f5f5] px-[4px] py-[1px] rounded text-[10px]">app-movil</code> del servidor. Luego escanear el QR generado con Expo Go.
        </div>
      </div>
    </div>
  );
};

export default AppMovilQR;