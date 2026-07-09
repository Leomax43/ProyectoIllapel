import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import { useAuth } from '../hooks/useAuth';
import comerciosService from '../services/comerciosService';

const LiquidarComercioPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  // Recibimos los datos "escondidos" que nos envió la página anterior
  const comercio = location.state?.comercio;

  const userStr = localStorage.getItem('illapel_token');
  const idAdmin = userStr ? JSON.parse(userStr).id_admin : localStorage.getItem('id_admin') || 1;

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [file, setFile] = useState(null);

  // Si alguien entra a la URL directamente o recarga la página, los datos se pierden.
  // Lo devolvemos a la lista de comercios automáticamente.
  useEffect(() => {
    if (!comercio) {
      navigate('/comercios');
    }
  }, [comercio, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      alert('Solo se permiten archivos en formato PDF.');
      setFile(null);
      e.target.value = '';
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ type: 'error', text: 'Debe adjuntar el comprobante de transferencia bancaria (PDF).' });
      return;
    }

    if (!confirm(`¿Confirma que se ha realizado la transferencia de $${parseInt(comercio.saldo_acumulado).toLocaleString('es-CL')} al comercio ${comercio.nombre_comercio}?`)) {
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('id_admin', idAdmin);
      formData.append('monto_liquidado', comercio.saldo_acumulado);
      formData.append('comprobante', file);

      // Usamos el RUT que venía en los datos de memoria para la petición al backend
      await comerciosService.liquidarFondos(comercio.rut_comercio, formData);

      setMessage({ type: 'success', text: '✅ Liquidación registrada con éxito. El saldo del comercio ha sido reiniciado a $0.' });
      
      setTimeout(() => {
        navigate('/comercios');
      }, 2500);

    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error al liquidar: ${error.message}` });
      setSubmitting(false);
    }
  };

  // Prevenir un error visual milisegundos antes de redireccionar si no hay comercio
  if (!comercio) return null; 

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="comercios" onLogout={logout} />

      <div className="flex-1 p-[20px] max-w-[800px] mx-auto w-full">
        {/* Cabecera */}
        <div className="mb-[20px] flex items-center gap-[15px]">
          <button 
            onClick={() => navigate('/comercios')}
            className="w-[36px] h-[36px] rounded-full bg-white border border-gris-borde flex items-center justify-center text-azul hover:bg-[#f0f4f6] cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div>
            <div className="text-[20px] font-bold text-azul">Liquidar Fondos a Comercio</div>
            <div className="text-[12px] text-gris-texto">
              Cierre de ciclo: Registre el pago municipal por las ventas realizadas a través de la Billetera Digital.
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-[12px] mb-[15px] rounded-[4px] text-[13px] font-bold ${
            message.type === 'success' ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]' : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-[6px] border border-gris-borde overflow-hidden shadow-sm">
          <div className="bg-azul text-white px-[20px] py-[12px] font-bold text-[14px]">
            Resumen de Liquidación
          </div>

          <div className="p-[24px]">
            {/* Info del Comercio y Monto */}
            <div className="flex gap-[20px] mb-[30px] p-[15px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px]">
              <div className="flex-1 border-r border-[#e2e8f0] pr-[20px]">
                <div className="text-[11px] text-gris-claro font-bold uppercase tracking-[0.5px] mb-[4px]">Datos del receptor</div>
                <div className="text-[16px] font-bold text-[#1e293b]">{comercio.nombre_comercio}</div>
                <div className="text-[13px] text-[#475569] mt-[2px]">RUT: {comercio.rut_comercio}</div>
                <div className="text-[13px] text-[#475569]">Responsable: {comercio.responsable}</div>
              </div>
              <div className="w-[200px] flex flex-col justify-center items-center">
                <div className="text-[11px] text-gris-claro font-bold uppercase tracking-[0.5px] mb-[4px]">Monto Total a Pagar</div>
                <div className="text-[28px] font-bold text-[#c49300]">
                  ${parseInt(comercio.saldo_acumulado).toLocaleString('es-CL')}
                </div>
              </div>
            </div>

            {/* Input para el Documento */}
            <div className="mb-[25px]">
              <label className="block text-[13px] font-bold text-azul mb-[8px]">
                Comprobante de Transferencia (Obligatorio)
              </label>
              <div className="text-[11px] text-gris-texto mb-[10px]">
                Adjunte el PDF del comprobante bancario emitido por la Municipalidad de Illapel que acredite el depósito de estos fondos a la cuenta del comercio.
              </div>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full text-[13px] text-[#333] border border-dashed border-gris-borde p-[15px] rounded-[4px] bg-[#fbfbfb] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-[#e1f0ff] file:text-azul hover:file:bg-[#cce4ff]"
                required
              />
            </div>

            {/* Botones de acción */}
            <div className="border-t border-gris-borde pt-[20px] flex justify-end gap-[12px]">
              <button 
                type="button"
                onClick={() => navigate('/comercios')}
                className="px-[20px] py-[10px] text-[13px] font-bold text-gris-texto bg-transparent border border-gris-borde rounded-[4px] hover:bg-[#f5f5f5]"
                disabled={submitting}
                style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-[20px] py-[10px] text-[13px] font-bold text-white bg-verde rounded-[4px] hover:brightness-110 disabled:opacity-50 flex items-center gap-[8px]"
                disabled={submitting}
                style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
              >
                {submitting ? 'Procesando pago...' : 'Registrar Liquidación y Reiniciar Saldo'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default LiquidarComercioPage;