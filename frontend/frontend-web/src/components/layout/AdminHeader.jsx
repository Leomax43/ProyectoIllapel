import logoIllapel from '../../assets/logoillapel.png';
import StatusBadge from '../ui/StatusBadge.jsx';

function AdminHeader({ status, onRefreshStatus, loading, onLogout }) {
  return (
    <header className="bg-white flex justify-between items-center px-6 py-3 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <img
          src={logoIllapel}
          alt="Logo Municipalidad"
          style={{ maxHeight: '70px', width: 'auto' }}
          className="object-contain"
        />
        <div className="text-xs text-gray-500">
          <p className="font-semibold text-gray-700 uppercase">Illapel Te Ayuda</p>
          <p>Panel administrativo municipal</p>
        </div>
      </div>
      <div className="text-right text-xs text-gray-600 uppercase">
        <p className="font-bold">Jorge Malave Romero</p>
        <p>Encargado Unidad de Informática / SECPLAN</p>
        <div className="mt-2 flex justify-end items-center gap-2">
          <span>Estado DB:</span>
          <StatusBadge status={status} loading={loading} onClick={onRefreshStatus} />
          <button
            onClick={onLogout}
            className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
            type="button"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

