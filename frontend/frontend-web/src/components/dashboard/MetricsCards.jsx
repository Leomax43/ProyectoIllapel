function MetricsCards({ indicadores }) {
  const cards = [
    {
      label: 'Beneficiarios activos',
      value: indicadores.beneficiariosActivos || 0,
      sub: 'núcleos familiares',
      icon: '👥',
      barClass: 'from-verde to-verde',
      valueClass: 'text-verde',
    },
    {
      label: 'Fondos distribuidos este mes',
      value: `$${(indicadores.fondosCargadosTotales || 0).toLocaleString('es-CL')}`,
      sub: `${indicadores.solicitudesPendientes || 0} asignaciones`,
      icon: '💰',
      barClass: 'from-amarillo to-amber-500',
      valueClass: 'text-[#c49300]',
    },
    {
      label: 'Solicitudes pendientes',
      value: indicadores.solicitudesPendientes || 0,
      sub: 'esperando aprobación',
      icon: '📋',
      barClass: 'from-celeste to-sky-400',
      valueClass: 'text-[#1a8fb5]',
    },
    {
      label: 'Comercios registrados',
      value: indicadores.comerciosRegistrados || 0,
      sub: 'verificados y activos',
      icon: '🏪',
      barClass: 'from-azul to-blue-800',
      valueClass: 'text-azul',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-[12px] mb-[18px]">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-gris-borde rounded-[6px] p-[14px_16px] relative overflow-hidden"
        >
          {/* Barra superior de color */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.barClass}`}></div>
          
          <div className="text-[22px] mb-[6px]">{card.icon}</div>
          <div className="text-[11px] text-gris-claro mb-[4px] font-normal">{card.label}</div>
          <div className={`text-[24px] font-bold ${card.valueClass}`}>{card.value}</div>
          <div className="text-[11px] text-[#bbb] mt-[3px] font-light">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default MetricsCards;