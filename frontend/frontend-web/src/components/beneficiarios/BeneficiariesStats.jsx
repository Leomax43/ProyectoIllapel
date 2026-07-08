const BeneficiariesStats = ({ stats }) => {
  const pills = [
    { label: 'total registrados', count: stats?.total_registrados || 0, style: 'bg-[#e0eaf0] text-azul border-[#b0ccd8]' },
    { label: 'activos', count: stats?.activos || 0, style: 'bg-[#e6f7f4] text-verde border-[#b2e8de]' },
    { label: 'dados de baja', count: stats?.bajas || 0, style: 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]' },
  ];

  return (
    <div className="flex gap-[8px] mb-[12px] flex-wrap">
      {pills.map((pill, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-[6px] px-[12px] py-[5px] rounded-[20px] text-[12px] font-medium border ${pill.style}`}
        >
          <span className="font-bold bg-black/12 rounded-full w-[20px] h-[20px] flex items-center justify-center text-[11px]">
            {pill.count}
          </span>
          <span>{pill.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BeneficiariesStats;