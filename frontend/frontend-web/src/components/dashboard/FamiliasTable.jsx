import { formatCurrency } from '../../utils/formatters.js';

function FamiliasTable({ familias, loading }) {
  return (
    <div className="bg-white border border-gray-300 shadow-sm rounded overflow-hidden">
      <div className="grid grid-cols-5 bg-[#4a5568] text-white text-xs font-semibold py-2 px-4 uppercase">
        <div className="col-span-1">ID / Expediente</div>
        <div className="col-span-2">Nombre de la Familia</div>
        <div className="col-span-1">RUT Representante</div>
        <div className="col-span-1 text-right">Saldo Actual</div>
      </div>

      <div className="divide-y divide-gray-200 min-h-[200px]">
        {loading ? (
          <p className="text-center py-8 text-gray-500 text-sm">Cargando registros...</p>
        ) : familias.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm italic">
            Mostrando 0 registros. Utilice el botón "Actualizar Tabla".
          </p>
        ) : (
          familias.map((familia, index) => (
            <div
              key={familia.id_familia ?? `${familia.rut_representante}-${index}`}
              className={`grid grid-cols-5 text-xs py-3 px-4 items-center ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-blue-50 transition`}
            >
              <div className="col-span-1 text-gray-600">{familia.id_familia} / 2026</div>
              <div className="col-span-2 font-medium text-gray-800">{familia.nombre_familia}</div>
              <div className="col-span-1 text-gray-600">{familia.rut_representante}</div>
              <div className="col-span-1 text-right font-bold text-[#2c5282]">
                {formatCurrency(familia.saldo)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 flex justify-between items-center border-t border-gray-300">
        <span>
          Mostrando registros del 1 al {familias.length} de un total de {familias.length}{' '}
          registros
        </span>
      </div>
    </div>
  );
}

export default FamiliasTable;
