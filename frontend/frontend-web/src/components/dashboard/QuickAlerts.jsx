function QuickAlerts({ indicadores }) {
  const alerts = [
    {
      label: 'solicitudes pendientes',
      count: indicadores.solicitudesPendientes || 0,
      style: 'bg-[#fff8e0] text-[#a07800] border-[#f0d970]',
    },
    {
      label: 'fondos cargados hoy',
      count: 0,
      style: 'bg-[#e6f7f4] text-verde border-[#b2e8de]',
    },
    {
      label: 'transacciones hoy',
      count: 0,
      style: 'bg-[#e6f5fc] text-[#1a8fb5] border-[#b3dff0]',
    },
    {
      label: 'cuentas dadas de baja',
      count: 0,
      style: 'bg-[#fde8e8] text-[#b52b2b] border-[#f5b8b8]',
    },
  ];

  return (
    <div className="flex gap-[8px] mb-[16px] flex-wrap">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-[6px] px-[12px] py-[5px] rounded-[20px] text-[12px] font-medium border ${alert.style}`}
        >
          <span className="font-bold bg-black/12 rounded-full w-[20px] h-[20px] flex items-center justify-center text-[11px]">
            {alert.count}
          </span>
          <span>{alert.label}</span>
        </div>
      ))}
    </div>
  );
}

export default QuickAlerts;