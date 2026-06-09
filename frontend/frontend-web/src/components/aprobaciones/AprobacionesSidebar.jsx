import React from 'react';

const AprobacionesSidebar = ({ 
  solicitudes, 
  selectedSolicitud, 
  setSelectedSolicitud, 
  loading, 
  searchTerm, 
  setSearchTerm,
  setShowRechazoInput,
  setMotivoRechazo
}) => {
  return (
    <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] overflow-hidden">
      <div className="bg-[#2563a0] text-[#ffffff] text-[13px] font-bold p-[8px_14px]">
        Solicitudes Pendientes de Revisión ({solicitudes.length})
      </div>
      <div className="p-[10px] border-b border-[#eeeeee]">
        <input
          type="text"
          placeholder="Filtrar por beneficiario, RUT o asistente..."
          className="w-full border border-[#cccccc] rounded-[3px] p-[6px_9px] text-[12px] text-[#333333] font-sans focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        {loading ? (
          <div className="p-[20px] text-center text-[12px] text-[#999999]">Cargando solicitudes...</div>
        ) : solicitudes.length === 0 ? (
          <div className="p-[20px] text-center text-[12px] text-[#999999]">No hay solicitudes pendientes</div>
        ) : (
          solicitudes.map((sol) => (
            <div
              key={sol.id_carga}
              className={`p-[10px_14px] border-b border-[#eeeeee] cursor-pointer transition-colors ${
                selectedSolicitud?.id_carga === sol.id_carga ? 'bg-[#f0f6ff]' : 'bg-[#ffffff] hover:bg-[#f9f9f9]'
              }`}
              onClick={() => {
                setSelectedSolicitud(sol);
                setShowRechazoInput(false);
                setMotivoRechazo('');
              }}
            >
              <div className="flex justify-between items-start mb-[4px]">
                <span className="text-[12px] font-bold text-[#1a3a5c]">{sol.nombre_familia}</span>
                <span className="text-[12px] font-bold text-[#1e7a3e]">${parseInt(sol.monto).toLocaleString('es-CL')}</span>
              </div>
              <div className="text-[11px] text-[#555555] mb-[2px]">RUT Representante: {sol.rut_representante}</div>
              <div className="flex justify-between text-[10px] text-[#888888] mt-[6px]">
                <span>Por: {sol.nombre_asistente || sol.solicitante_nombre || 'Asistente Social'}</span>
                <span>{new Date(sol.fecha).toLocaleDateString('es-CL')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AprobacionesSidebar;