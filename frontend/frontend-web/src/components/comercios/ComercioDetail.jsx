import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ComercioDetail = ({ selectedComercio, comercioDetalle, formatCurrency, formatDate, onEstadoCambiado }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('informacion');
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [loadingLiq, setLoadingLiq] = useState(false);

  // Cada vez que seleccionamos un comercio distinto, reiniciamos la pestaña y buscamos sus liquidaciones
  useEffect(() => {
    if (selectedComercio) {
      setActiveTab('informacion');
      fetchLiquidaciones();
    }
  }, [selectedComercio]);

  // Función interna para buscar el historial de pagos y los PDFs directamente desde el backend
  const fetchLiquidaciones = async () => {
    try {
      setLoadingLiq(true);
      const tokenStr = localStorage.getItem('illapel_token');
      const token = tokenStr ? JSON.parse(tokenStr).token : '';
      
      let baseUrl = import.meta.env.VITE_API_URL || 'https://proyectoillapel.onrender.com/api';
      if (!baseUrl.endsWith('/api')) baseUrl += '/api';

      const response = await fetch(`${baseUrl}/comercios/${selectedComercio.rut_comercio}/liquidaciones`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiquidaciones(data);
      }
    } catch (error) {
      console.error("Error al obtener liquidaciones:", error);
    } finally {
      setLoadingLiq(false);
    }
  };

  if (!selectedComercio) {
    return (
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px]">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Detalle del comercio seleccionado
        </div>
        <div className="p-[20px] text-center text-gris-claro text-[12px]">
          Selecciona un comercio para ver detalles
        </div>
      </div>
    );
  }

  // Calculamos la URL base para descargar los PDFs sin el "/api"
  const BASE_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'https://proyectoillapel.onrender.com';

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[14px] flex flex-col h-full">
      {/* HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        Detalle del comercio seleccionado
      </div>

      {/* SISTEMA DE PESTAÑAS (TABS) */}
      <div className="flex border-b-2 border-azul bg-white">
        <div
          onClick={() => setActiveTab('informacion')}
          className={`px-[14px] py-[7px] text-[12px] cursor-pointer transition-colors ${
            activeTab === 'informacion'
              ? 'text-azul border-b-2 border-azul font-bold bg-[#f0f4f6]'
              : 'text-gris-texto border-b-2 border-transparent hover:text-azul'
          }`}
        >
          Información general
        </div>
        <div
          onClick={() => setActiveTab('transacciones')}
          className={`px-[14px] py-[7px] text-[12px] cursor-pointer transition-colors ${
            activeTab === 'transacciones'
              ? 'text-azul border-b-2 border-azul font-bold bg-[#f0f4f6]'
              : 'text-gris-texto border-b-2 border-transparent hover:text-azul'
          }`}
        >
          Ventas recibidas
        </div>
        <div
          onClick={() => setActiveTab('liquidaciones')}
          className={`px-[14px] py-[7px] text-[12px] cursor-pointer transition-colors ${
            activeTab === 'liquidaciones'
              ? 'text-azul border-b-2 border-azul font-bold bg-[#f0f4f6]'
              : 'text-gris-texto border-b-2 border-transparent hover:text-azul'
          }`}
        >
          Pagos y Documentos
        </div>
      </div>

      {/* CONTENIDO DINÁMICO DE LAS PESTAÑAS */}
      <div className="p-[13px_14px] flex-1">
        
        {/* PESTAÑA 1: INFORMACIÓN GENERAL */}
        {activeTab === 'informacion' && (
          <div>
            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">
              Datos del establecimiento
            </div>
            <div className="grid grid-cols-2 gap-[8px]">
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Nombre</div>
                <div className="text-[12px] text-[#222] font-bold">{selectedComercio.nombre_comercio}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">RUT</div>
                <div className="text-[12px] text-[#222] font-bold">{selectedComercio.rut_comercio}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Rubro</div>
                <div className="text-[12px] text-[#222] font-bold">{selectedComercio.rubro}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Teléfono</div>
                <div className="text-[12px] text-[#222] font-bold">{selectedComercio.telefono}</div>
              </div>
              <div className="text-[12px] col-span-2">
                <div className="text-[11px] text-gris-claro mb-[0px]">Dirección</div>
                <div className="text-[12px] text-[#222] font-bold">{selectedComercio.direccion}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Responsable</div>
                <div className="text-[12px] text-[#222] font-bold">{selectedComercio.responsable}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Estado</div>
                <div>
                  <span className={`inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${
                    selectedComercio.estado === 'ACTIVO'
                      ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]'
                      : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
                  }`}>
                    {selectedComercio.estado}
                  </span>
                </div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Fecha de registro</div>
                <div className="text-[12px] text-[#222] font-bold">{formatDate(selectedComercio.fecha_registro)}</div>
              </div>
            </div>

            {/* CAJA DE SALDO ACUMULADO */}
            <div className="border border-azul rounded-[4px] p-[10px_14px] text-center mt-[15px] bg-[#e0eaf0]">
              <div className="text-[11px] text-gris-texto mb-[3px] font-bold uppercase">Deuda pendiente por pagar (Saldo)</div>
              <div className="text-[26px] font-bold text-azul">{formatCurrency(selectedComercio.saldo_acumulado)}</div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: TRANSACCIONES */}
        {activeTab === 'transacciones' && (
          <div>
            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">
              Historial de ventas por la aplicación
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Fecha</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Beneficiario</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Monto</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Método</th>
                  </tr>
                </thead>
                <tbody>
                  {comercioDetalle?.historial_ventas && comercioDetalle.historial_ventas.length > 0 ? (
                    comercioDetalle.historial_ventas.map((venta, idx) => (
                      <tr key={idx}>
                        <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{formatDate(venta.fecha)}</td>
                        <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{venta.nombre_familia || 'N/A'}</td>
                        <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{formatCurrency(venta.monto)}</td>
                        <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{venta.metodo_pago || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-[8px] py-[15px] border border-[#f0f0f0] text-gris-claro text-center italic">
                        Sin transacciones registradas aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: LIQUIDACIONES Y DOCUMENTOS */}
        {activeTab === 'liquidaciones' && (
          <div>
            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">
              Historial de pagos municipales
            </div>
            {loadingLiq ? (
              <div className="text-center p-4 text-[12px] text-gris-claro">Cargando documentos...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr>
                      <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Fecha de Pago</th>
                      <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Autorizado por</th>
                      <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Monto Pagado</th>
                      <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-center border border-gris-borde font-semibold">Comprobante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liquidaciones.length > 0 ? (
                      liquidaciones.map((liq, idx) => (
                        <tr key={idx}>
                          <td className="px-[8px] py-[6px] border border-[#f0f0f0] text-[#333]">{formatDate(liq.fecha_liquidacion)}</td>
                          <td className="px-[8px] py-[6px] border border-[#f0f0f0] text-[#333]">{liq.responsable || 'N/A'}</td>
                          <td className="px-[8px] py-[6px] border border-[#f0f0f0] text-[#c49300] font-bold">${Number(liq.monto_liquidado).toLocaleString('es-CL')}</td>
                          <td className="px-[8px] py-[6px] border border-[#f0f0f0] text-center">
                            {liq.pdf_comprobante ? (
                              <a
                                href={`${BASE_URL}${liq.pdf_comprobante}`}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-azul text-white border-none rounded-[3px] px-[10px] py-[4px] text-[10px] cursor-pointer font-bold no-underline hover:brightness-110 inline-flex items-center gap-[4px]"
                              >
                                <span>📄</span> Descargar
                              </a>
                            ) : (
                              <span className="text-gris-claro italic">Sin PDF</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-[8px] py-[15px] border border-[#f0f0f0] text-gris-claro text-center italic">
                          La municipalidad aún no ha registrado pagos para este comercio.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTONES DE ACCIÓN (FOOTER DEL COMPONENTE) */}
      <div className="px-[14px] py-[12px] border-t border-gris-borde bg-[#f9f9f9]">
        <div className="flex justify-between items-center gap-[8px]">
          <div className="flex gap-[8px]">
            {selectedComercio.estado === 'ACTIVO' ? (
              <button 
                onClick={() => onEstadoCambiado && onEstadoCambiado(selectedComercio.rut_comercio, 'BAJA')}
                className="bg-[#b52b2b] text-white border-none rounded-[3px] px-[16px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
                style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
                Dar de baja
              </button>
            ) : (
              <button 
                onClick={() => onEstadoCambiado && onEstadoCambiado(selectedComercio.rut_comercio, 'ACTIVO')}
                className="bg-verde text-white border-none rounded-[3px] px-[16px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
                style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
                Activar
              </button>
            )}
            <button 
              onClick={() => navigate(`/comercios/editar/${selectedComercio.rut_comercio}`)}
              className="bg-azul text-white border-none rounded-[3px] px-[18px] py-[7px] text-[12px] font-bold cursor-pointer hover:brightness-110"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
              Editar datos
            </button>
          </div>

          {/* BOTÓN DORADO DE PAGO (Aparece solo si hay deuda) */}
          {parseFloat(selectedComercio.saldo_acumulado) > 0 && (
            <button 
              onClick={() => navigate('/comercios/liquidar', { state: { comercio: selectedComercio } })}
              className="bg-[#c49300] text-white border-none rounded-[3px] px-[18px] py-[7px] text-[12px] font-bold cursor-pointer hover:brightness-110 flex items-center gap-[6px] animate-pulse"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Liquidar Fondos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComercioDetail;