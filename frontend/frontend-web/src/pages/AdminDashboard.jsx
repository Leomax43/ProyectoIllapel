import FamiliasTable from '../components/dashboard/FamiliasTable.jsx';
import PageHeader from '../components/dashboard/PageHeader.jsx';
import QuickStats from '../components/dashboard/QuickStats.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { useFamilias } from '../hooks/useFamilias.js';
import { formatCurrency } from '../utils/formatters.js';

function AdminDashboard({ status, onRefreshStatus, statusLoading }) {
  const { familias, loading, submitting, error, cargarFamilias, crearFamiliaDemo } =
    useFamilias();

  const saldoTotal = familias.reduce((acc, familia) => acc + Number(familia.saldo ?? 0), 0);

  const stats = [
    {
      label: 'Familias registradas',
      value: familias.length,
      helper: 'Cuentas con saldo disponible',
    },
    {
      label: 'Saldo total asignado',
      value: formatCurrency(saldoTotal),
      helper: 'Suma de saldos actuales',
    },
    {
      label: 'Estado de backend',
      value: <StatusBadge status={status} loading={statusLoading} />,
      helper: 'Conexión con la API municipal',
    },
  ];

  const actions = [
    {
      label: 'Verificar Conexión',
      onClick: onRefreshStatus,
      variant: 'neutral',
      disabled: statusLoading,
    },
    {
      label: '+ Nueva Familia',
      onClick: crearFamiliaDemo,
      variant: 'outline',
      disabled: submitting,
    },
    {
      label: 'Actualizar Tabla',
      onClick: cargarFamilias,
      variant: 'primary',
      disabled: loading,
    },
  ];

  return (
    <>
      <PageHeader
        title="Panel de Control: Billetera Digital Municipal"
        subtitle="En esta sección se gestionan los saldos y transacciones de las familias beneficiarias."
        actions={actions}
      />

      <QuickStats items={stats} />

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <FamiliasTable familias={familias} loading={loading} />
    </>
  );
}

export default AdminDashboard;
