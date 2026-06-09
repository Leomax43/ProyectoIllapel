import React from 'react';

const AprobacionesDetail = ({
  solicitud,
  btnLoading,
  handleAprobar,
  handleRechazar,
  verDocumento,
  showRechazoInput,
  setShowRechazoInput,
  motivoRechazo,
  setMotivoRechazo
}) => {
  if (!solicitud) {
    return (
      <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden">
        <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
          Detalle de la Solicitud Seleccionada
        </div>
        <div className="p-[20px] text-center text-[#999999] text-[12px]">
          Seleccione una solicitud del listado para auditar los antecedentes
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        Detalle de la Solicitud Seleccionada
      </div>
      
      {/* Cabecera del Detalle */}
      <div className="p-[14px_16px] border-b border-[#eeeeee] bg-[#fcfcfc]">
        <div className="text-[14px] font-bold text-[#1a3a5c] mb-[2px]">{solicitud.nombre_familia}</div>
        <div className="text-[11px] text-[#666666]">RUT: {solicitud.rut_representante} · ID Familia: {solicitud.id_familia}</div>
      </div>

      {/* Grid de Datos */}
      <div className="p-[16px] border-b border-[#eeeeee] grid grid-cols-2 gap-[12px]">
        <div>
          <div className="text-[10px] uppercase text-[#888888] font-bold tracking-[0.5px]">Monto Solicitado</div>
          <div className="text-[18px] font-bold text-[#1e7a3e] mt-[2px]">${parseInt(solicitud.monto).toLocaleString('es-CL')}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-[#888888] font-bold tracking-[0.5px]">Motivo / Tipo de ayuda</div>
          <div className="text-[13px] text-[#333333] font-bold mt-[6px]">{solicitud.motivo}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-[#888888] font-bold tracking-[0.5px]">Asistente Solicitante</div>
          <div className="text-[12px] text-[#333333] mt-[2px]">{solicitud.nombre_asistente || solicitud.solicitante_nombre || 'Asistente Social'}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-[#888888] font-bold tracking-[0.5px]">Fecha de Elevación</div>
          <div className="text-[12px] text-[#333333] mt-[2px]">
            {new Date(solicitud.fecha).toLocaleDateString('es-CL')} a las {new Date(solicitud.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Sección de Observaciones */}
      <div className="p-[14px_16px] border-b border-[#eeeeee]">
        <div className="text-[10px] uppercase text-[#888888] font-bold tracking-[0.5px] mb-[6px]">Justificación técnica del asistente</div>
        <div className="p-[10px] bg-[#f9f9f9] border border-[#e0e0e0] rounded-[3px] text-[12px] text-[#555555] italic leading-[1.4]">
          "{solicitud.observaciones || 'Sin observaciones adicionales'}"
        </div>
      </div>

      {/* Sección de Documentación */}
      <div className="p-[14px_16px] border-b border-[#eeeeee] flex justify-between items-center bg-[#fbfbfb]">
        <div>
          <div className="text-[12px] font-bold text-[#1a3a5c]">Resolución Exenta / Decreto Resp.</div>
          <div className="text-[11px] text-[#666666] mt-[1px]">Documento adjunto obligatorio (.pdf)</div>
        </div>
        <button 
          className="bg-[#ffffff] border border-[#2563a0] text-[#2563a0] rounded-[3px] p-[6px_14px] text-[11px] font-bold cursor-pointer transition-colors hover:bg-[#f0f6ff]"
          onClick={() => verDocumento(solicitud.id_carga)}
        >
          📄 Ver PDF adjunto
        </button>
      </div>

      {/* Acciones de Decisión */}
      <div className="p-[16px] bg-[#f5f5f5]">
        <div className="grid grid-cols-2 gap-[10px]">
          <button 
            className="bg-[#1e7a3e] border-none text-[#ffffff] rounded-[3px] p-[10px] text-[13px] font-bold cursor-pointer transition-colors hover:bg-[#156130] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleAprobar(solicitud.id_carga)}
            disabled={btnLoading}
          >
            Aprobar
          </button>
          <button 
            className="bg-[#b52b2b] border-none text-[#ffffff] rounded-[3px] p-[10px] text-[13px] font-bold cursor-pointer transition-colors hover:bg-[#8b1a1a] disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={() => setShowRechazoInput(!showRechazoInput)}
            disabled={btnLoading}
          >
            Rechazar
          </button>
        </div>
        
        {showRechazoInput && (
          <input
            type="text"
            className="w-full border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] mt-[8px] font-sans focus:outline-none"
            placeholder="Escriba el motivo del rechazo (obligatorio)..."
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
          />
        )}
        {showRechazoInput && (
          <button
            className="w-full mt-[8px] bg-[#b52b2b] border-none text-[#ffffff] rounded-[3px] p-[6px] text-[12px] font-bold cursor-pointer transition-colors hover:bg-[#8b1a1a]"
            onClick={() => handleRechazar(solicitud.id_carga)}
            disabled={btnLoading}
          >
            Confirmar rechazo de solicitud
          </button>
        )}
      </div>
    </div>
  );
};

export default AprobacionesDetail;