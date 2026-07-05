import { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import { useAuth } from '../hooks/useAuth';
import exportacionService from '../services/exportacionService';

const NOMBRES_TABLAS = {
  admin: 'Administradores',
  familias: 'Familias (Beneficiarios)',
  integrantes: 'Integrantes del núcleo familiar',
  comercios: 'Comercios',
  cargas_fondos: 'Cargas de Fondos',
  subrogaciones: 'Subrogaciones',
  transacciones: 'Transacciones'
};

const ExportacionPage = () => {
  const { logout } = useAuth();
  const [tablas, setTablas] = useState([]);
  const [tablaSeleccionada, setTablaSeleccionada] = useState('');
  const [vistaPrevia, setVistaPrevia] = useState([]);
  const [datosCompletos, setDatosCompletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarTablas();
  }, []);

  const cargarTablas = async () => {
    try {
      setLoading(true);
      const res = await exportacionService.obtenerTablas();
      setTablas(res.tablas || []);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarTabla = async (tabla) => {
    setTablaSeleccionada(tabla);
    if (!tabla) {
      setVistaPrevia([]);
      setDatosCompletos([]);
      return;
    }

    try {
      setLoadingPreview(true);
      const [previaRes, completaRes] = await Promise.all([
        exportacionService.obtenerVistaPrevia(tabla),
        exportacionService.obtenerDatosTabla(tabla),
      ]);
      setVistaPrevia(previaRes.datos || []);
      setDatosCompletos(completaRes.datos || []);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDescargarCSV = () => {
    if (datosCompletos.length === 0) {
      setMensaje({ tipo: 'error', texto: 'No hay datos para exportar' });
      return;
    }
    exportacionService.descargarCSV(datosCompletos, tablaSeleccionada);
    setMensaje({ tipo: 'exito', texto: `Archivo CSV descargado: ${tablaSeleccionada}.csv` });
  };

  const handleDescargarExcel = async () => {
    if (datosCompletos.length === 0) {
      setMensaje({ tipo: 'error', texto: 'No hay datos para exportar' });
      return;
    }
    await exportacionService.descargarExcel(datosCompletos, tablaSeleccionada);
    setMensaje({ tipo: 'exito', texto: `Archivo Excel descargado: ${tablaSeleccionada}.xlsx` });
  };

  const columnas = vistaPrevia.length > 0 ? Object.keys(vistaPrevia[0]) : [];

  const formatearValor = (valor) => {
    if (valor === null || valor === undefined) return '—';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    if (typeof valor === 'object') return JSON.stringify(valor);
    return String(valor);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gris-bg">
        <DashboardHeader currentPage="exportacion" onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="p-[20px] text-center text-gris-claro">Cargando...</div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="exportacion" onLogout={logout} />
      <div className="p-[18px_20px] flex-1 max-w-[1200px] mx-auto w-full">
        <h1 className="text-[18px] font-bold text-azul mb-[16px]">Exportar Datos</h1>

        {mensaje && (
          <div className={`p-[10px] mb-[12px] rounded-[4px] text-[12px] font-bold ${
            mensaje.tipo === 'exito' ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]' : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
          }`}>
            {mensaje.texto}
            <button onClick={() => setMensaje(null)} className="float-right font-bold cursor-pointer bg-transparent border-none">×</button>
          </div>
        )}

        {/* SELECTOR DE TABLA */}
        <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[16px]">
          <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
            Seleccionar tabla
          </div>
          <div className="p-[16px]">
            <select
              value={tablaSeleccionada}
              onChange={(e) => handleSeleccionarTabla(e.target.value)}
              className="w-full border border-gris-borde rounded-[4px] px-[10px] py-[8px] text-[13px] outline-none focus:border-verde"
            >
              <option value="">— Selecciona una tabla —</option>
              {tablas.map(tabla => (
                <option key={tabla} value={tabla}>
                  {NOMBRES_TABLAS[tabla] || tabla}
                </option>
              ))}
            </select>
          </div>
        </div>

        {tablaSeleccionada && (
          <>
            {/* VISTA PREVIA */}
            <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[16px]">
              <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex justify-between items-center">
                <span>Vista previa — {NOMBRES_TABLAS[tablaSeleccionada] || tablaSeleccionada}</span>
                <span className="text-[11px] text-white/70 font-normal">
                  {datosCompletos.length} registro(s) en total
                </span>
              </div>

              {loadingPreview ? (
                <div className="p-[20px] text-center text-gris-claro">Cargando vista previa...</div>
              ) : vistaPrevia.length === 0 ? (
                <div className="p-[20px] text-center text-gris-claro">No hay datos en esta tabla</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr>
                        {columnas.map(col => (
                          <th key={col} className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vistaPrevia.map((fila, idx) => (
                        <tr key={idx}>
                          {columnas.map(col => (
                            <td key={col} className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333] max-w-[200px] truncate">
                              {formatearValor(fila[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* BOTONES DE DESCARGA */}
            <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
              <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
                Descargar datos
              </div>
              <div className="p-[16px] flex gap-[10px]">
                <button
                  onClick={handleDescargarCSV}
                  disabled={datosCompletos.length === 0}
                  className="bg-verde text-white border-none rounded-[3px] px-[18px] py-[8px] text-[12px] font-bold cursor-pointer hover:brightness-110 disabled:bg-[#cccccc] disabled:cursor-not-allowed flex items-center gap-[6px]"
                >
                  <span>📄</span>
                  Descargar CSV
                </button>
                <button
                  onClick={handleDescargarExcel}
                  disabled={datosCompletos.length === 0}
                  className="bg-azul text-white border-none rounded-[3px] px-[18px] py-[8px] text-[12px] font-bold cursor-pointer hover:brightness-110 disabled:bg-[#cccccc] disabled:cursor-not-allowed flex items-center gap-[6px]"
                >
                  <span>📊</span>
                  Descargar Excel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <DashboardFooter />
    </div>
  );
};

export default ExportacionPage;