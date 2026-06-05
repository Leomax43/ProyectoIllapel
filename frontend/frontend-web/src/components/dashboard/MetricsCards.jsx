function MetricsCards({ indicadores }) {
  const cards = [
    {
      label: 'Beneficiarios activos',
      value: indicadores.beneficiariosActivos || 0,
      sub: 'núcleos familiares',
      color: 'blue',
    },
    {
      label: 'Fondos cargados este mes',
      value: `$${(indicadores.fondosCargadosTotales || 0).toLocaleString('es-CL')}`,
      sub: 'asignaciones realizadas',
      color: 'green',
    },
    {
      label: 'Solicitudes pendientes',
      value: indicadores.solicitudesPendientes || 0,
      sub: 'esperando aprobación',
      color: 'orange',
    },
    {
      label: 'Comercios registrados',
      value: indicadores.comerciosRegistrados || 0,
      sub: 'verificados y activos',
      color: 'blue',
    },
  ];

  const colorMap = {
    blue: '#2563a0',
    green: '#1e7a3e',
    orange: '#c47f00',
    red: '#b52b2b',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{card.label}</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: colorMap[card.color] }}>{card.value}</div>
          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default MetricsCards;
