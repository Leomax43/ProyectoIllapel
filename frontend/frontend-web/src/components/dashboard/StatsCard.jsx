function StatsCard({ label, value, helper }) {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <div className="mt-2 text-lg font-semibold text-gray-800">{value}</div>
      {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
    </div>
  );
}

export default StatsCard;
