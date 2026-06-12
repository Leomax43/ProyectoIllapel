const MetricasTransacciones = ({ metricas }) => {
  const cards = [
    {
      label: 'Transacciones este mes',
      value: metricas?.totalTransacciones || 0,
      sub: metricas?.mesActual || 'Cargando...',
      barClass: 'bg-azul',
      valueClass: 'text-azul',
    },
    {
      label: 'Total fondos cargados',
      value: `$${(metricas?.totalFondosCargados || 0).toLocaleString('es-CL')}`,
      sub: `${metricas?.totalCargas || 0} cargas realizadas`,
      barClass: 'bg-verde',
      valueClass: 'text-verde',
    },
    {
      label: 'Total pagos procesados',
      value: `$${(metricas?.totalPagos || 0).toLocaleString('es-CL')}`,
      sub: `${metricas?.pagosQr || 0} pagos este mes`,
      barClass: 'bg-amarillo',
      valueClass: 'text-[#c49300]',
    },
    {
      label: 'Pagos por RUT+PIN',
      value: metricas?.pagosRutPin || 0,
      sub: `vs ${metricas?.pagosQr || 0} por QR`,
      barClass: 'bg-azul',
      valueClass: 'text-azul',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-[12px] mb-[18px]">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white border border-gris-borde rounded-[6px] p-[14px_16px] relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${card.barClass}`}></div>
          <div className="text-[11px] text-gris-claro mb-[4px] font-normal">{card.label}</div>
          <div className={`text-[20px] font-bold ${card.valueClass}`}>{card.value}</div>
          <div className="text-[11px] text-[#bbb] mt-[2px] font-light">{card.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricasTransacciones;