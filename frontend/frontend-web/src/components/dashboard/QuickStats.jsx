import StatsCard from './StatsCard.jsx';

function QuickStats({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {items.map((item) => (
        <StatsCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export default QuickStats;
