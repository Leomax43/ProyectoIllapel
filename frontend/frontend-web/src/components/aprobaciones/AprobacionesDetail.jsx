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
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Detalle de la Solicitud Seleccionada
        </div>
        <div className="p-[20px] text-center text-gris-claro text-[12px]">
          Seleccione una solicitud del listado para auditar los antecedentes
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
      {/* HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        Detalle de la Solicitud Seleccionada
      </div>
      
      {/* CABECERA DEL DETALLE */}
      <div className="px-[16px] py-[14px] border-b border-gris-borde bg-[#fcfcfc]">
        <div className="text-[14px] font-bold text-azul mb-[2px]">{solicitud.nombre_familia}</div>
        <div className="text-[11px] text-gris-texto">RUT: {solicitud.rut_representante} · ID Familia: {solicitud.id_familia}</div>
      </div>

      {/* GRID DE DATOS */}
      <div className="p-[16px] border-b border-gris-borde grid grid-cols-2 gap-[12px]">
        <div>
          <div className="text-[10px] uppercase text-gris-claro font-bold tracking-[0.5px]">Monto Solicitado</div>
          <div className="text-[18px] font-bold text-verde mt-[2px]">${parseInt(solicitud.monto).toLocaleString('es-CL')}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-gris-claro font-bold tracking-[0.5px]">Motivo / Tipo de ayuda</div>
          <div className="text-[13px] text-[#333] font-bold mt-[6px]">{solicitud.motivo}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-gris-claro font-bold tracking-[0.5px]">Asistente Solicitante</div>
          <div className="text-[12px] text-[#333] mt-[2px]">{solicitud.nombre_asistente || solicitud.solicitante_nombre || 'Asistente Social'}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-gris-claro font-bold tracking-[0.5px]">Fecha de Elevación</div>
          <div className="text-[12px] text-[#333] mt-[2px]">
            {new Date(solicitud.fecha).toLocaleDateString('es-CL')} a las {new Date(solicitud.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* OBSERVACIONES */}
      <div className="px-[16px] py-[14px] border-b border-gris-borde">
        <div className="text-[10px] uppercase text-gris-claro font-bold tracking-[0.5px] mb-[6px]">Justificación técnica del asistente</div>
        <div className="p-[10px] bg-[#f9f9f9] border border-gris-borde rounded-[3px] text-[12px] text-gris-texto italic leading-[1.4]">
          &ldquo;{solicitud.observaciones || 'Sin observaciones adicionales'}&rdquo;
        </div>
      </div>

      {/* DOCUMENTACIÓN */}
      <div className="px-[16px] py-[14px] border-b border-gris-borde flex justify-between items-center bg-[#fbfbfb]">
        <div>
          <div className="text-[12px] font-bold text-azul">Resolución Exenta / Decreto Resp.</div>
          <div className="text-[11px] text-gris-texto mt-[1px]">Documento adjunto obligatorio (.pdf)</div>
        </div>
        <button 
          className="bg-white border border-azul text-azul rounded-[3px] px-[14px] py-[6px] text-[11px] font-bold cursor-pointer hover:bg-[#f0f4f6]"
          onClick={() => verDocumento(solicitud.id_carga)}
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        >
          📄 Ver PDF adjunto
        </button>
      </div>

      {/* ACCIONES DE DECISIÓN */}
      <div className="p-[16px] bg-[#f5f5f5]">
        <div className="grid grid-cols-2 gap-[10px]">
          <button 
            className="bg-verde text-white border-none rounded-[3px] p-[10px] text-[13px] font-bold cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleAprobar(solicitud.id_carga)}
            disabled={btnLoading}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Aprobar
          </button>
          <button 
            className="bg-[#b52b2b] text-white border-none rounded-[3px] p-[10px] text-[13px] font-bold cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={() => setShowRechazoInput(!showRechazoInput)}
            disabled={btnLoading}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Rechazar
          </button>
        </div>
        
        {showRechazoInput && (
          <>
            <input
              type="text"
              placeholder="Escriba el motivo del rechazo (obligatorio)..."
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              className="w-full border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] mt-[8px] outline-none focus:border-verde"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            />
            <button
              className="w-full mt-[8px] bg-[#b52b2b] text-white border-none rounded-[3px] p-[6px] text-[12px] font-bold cursor-pointer hover:brightness-110"
              onClick={() => handleRechazar(solicitud.id_carga)}
              disabled={btnLoading}
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              Confirmar rechazo de solicitud
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AprobacionesDetail;