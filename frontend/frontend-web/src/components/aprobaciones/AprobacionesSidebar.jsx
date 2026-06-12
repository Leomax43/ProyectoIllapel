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
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        Solicitudes Pendientes de Revisión ({solicitudes.length})
      </div>
      <div className="p-[10px] border-b border-gris-borde">
        <input
          type="text"
          placeholder="Filtrar por beneficiario, RUT o asistente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gris-borde rounded-[3px] px-[9px] py-[6px] text-[12px] outline-none focus:border-verde"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
        />
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        {loading ? (
          <div className="p-[20px] text-center text-[12px] text-gris-claro">Cargando solicitudes...</div>
        ) : solicitudes.length === 0 ? (
          <div className="p-[20px] text-center text-[12px] text-gris-claro">No hay solicitudes pendientes</div>
        ) : (
          solicitudes.map((sol) => (
            <div
              key={sol.id_carga}
              className={`px-[14px] py-[10px] border-b border-gris-borde cursor-pointer transition-colors ${
                selectedSolicitud?.id_carga === sol.id_carga ? 'bg-[#e0eaf0]' : 'bg-white hover:bg-[#f9f9f9]'
              }`}
              onClick={() => {
                setSelectedSolicitud(sol);
                setShowRechazoInput(false);
                setMotivoRechazo('');
              }}
            >
              <div className="flex justify-between items-start mb-[4px]">
                <span className="text-[12px] font-bold text-azul">{sol.nombre_familia}</span>
                <span className="text-[12px] font-bold text-verde">${parseInt(sol.monto).toLocaleString('es-CL')}</span>
              </div>
              <div className="text-[11px] text-gris-texto mb-[2px]">RUT Representante: {sol.rut_representante}</div>
              <div className="flex justify-between text-[10px] text-gris-claro mt-[6px]">
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