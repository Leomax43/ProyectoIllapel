import React from 'react';

const MetricasTransacciones = ({ metricas }) => {
  return (
    <div className="grid grid-cols-4 gap-[10px] mb-[14px]">
      <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
        <div className="text-[11px] text-[#888888] mb-[3px]">Transacciones este mes</div>
        <div className="text-[20px] font-bold text-[#2563a0]">{metricas?.totalTransacciones || 0}</div>
        <div className="text-[11px] text-[#aaaaaa] mt-[2px]">{metricas?.mesActual || 'Cargando...'}</div>
      </div>
      <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
        <div className="text-[11px] text-[#888888] mb-[3px]">Total fondos cargados</div>
        <div className="text-[20px] font-bold text-[#1e7a3e]">
          ${(metricas?.totalFondosCargados || 0).toLocaleString('es-CL')}
        </div>
        <div className="text-[11px] text-[#aaaaaa] mt-[2px]">{metricas?.totalCargas || 0} cargas realizadas</div>
      </div>
      <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
        <div className="text-[11px] text-[#888888] mb-[3px]">Total pagos procesados</div>
        <div className="text-[20px] font-bold text-[#c47f00]">
          ${(metricas?.totalPagos || 0).toLocaleString('es-CL')}
        </div>
        <div className="text-[11px] text-[#aaaaaa] mt-[2px]">{metricas?.pagosQr || 0} pagos este mes</div>
      </div>
      <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
        <div className="text-[11px] text-[#888888] mb-[3px]">Pagos por RUT+PIN</div>
        <div className="text-[20px] font-bold text-[#2563a0]">{metricas?.pagosRutPin || 0}</div>
        <div className="text-[11px] text-[#aaaaaa] mt-[2px]">vs {metricas?.pagosQr || 0} por QR</div>
      </div>
    </div>
  );
};

export default MetricasTransacciones;