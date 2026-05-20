function QuickAlerts({ indicadores }) {
  const alerts = [
    {
      label: 'solicitudes pendientes',
      count: indicadores.solicitudesPendientes || 0,
      color: '#e67e1a',
    },
    {
      label: 'fondos cargados hoy',
      count: 0,
      color: '#2563a0',
    },
    {
      label: 'transacciones hoy',
      count: 0,
      color: '#1e7a3e',
    },
    {
      label: 'cuentas dadas de baja',
      count: 0,
      color: '#666',
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            cursor: 'pointer',
            background: alert.color,
            color: '#fff',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              background: 'rgba(0,0,0,0.12)',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
            }}
          >
            {alert.count}
          </span>
          <span>{alert.label}</span>
        </div>
      ))}
    </div>
  );
}

export default QuickAlerts;
