const STATUS_STYLES = {
  Conectado: 'bg-green-600',
  'Error BD': 'bg-yellow-600',
  'Servidor Apagado': 'bg-red-600',
  Desconectado: 'bg-gray-500',
};

function StatusBadge({ status = 'Desconectado', loading = false, onClick }) {
  const label = loading ? 'Comprobando...' : status;
  const colorClass = STATUS_STYLES[status] ?? STATUS_STYLES.Desconectado;
  const baseClass = `px-2 py-0.5 rounded text-white font-bold ${colorClass}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={`${baseClass} ${loading ? 'opacity-80 cursor-wait' : 'hover:opacity-90'}`}
      >
        {label}
      </button>
    );
  }

  return <span className={baseClass}>{label}</span>;
}

export default StatusBadge;
