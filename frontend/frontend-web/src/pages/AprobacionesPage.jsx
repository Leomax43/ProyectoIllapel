import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import { useAuth } from '../hooks/useAuth';
import aprobacionesService from '../services/aprobacionesService';
import AccesoDenegado from '../components/aprobaciones/AccesoDenegado';
import AprobacionesSidebar from '../components/aprobaciones/AprobacionesSidebar';
import AprobacionesDetail from '../components/aprobaciones/AprobacionesDetail';

const AprobacionesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const adminRol = localStorage.getItem('adminRol');
  
  const userStr = localStorage.getItem('illapel_token');
  const idJefatura = userStr ? JSON.parse(userStr).id_admin : localStorage.getItem('id_admin') || 2; 

  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [showRechazoInput, setShowRechazoInput] = useState(false);

  if (adminRol !== 'JEFATURA') {
    return <AccesoDenegado logout={logout} navigate={navigate} />;
  }

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await aprobacionesService.obtenerPendientes();
      const lista = data.solicitudes || [];
      setSolicitudes(lista);
      if (lista.length > 0) {
        setSelectedSolicitud(lista[0]);
      } else {
        setSelectedSolicitud(null);
      }
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (idCarga) => {
    setBtnLoading(true);
    setMessage(null);
    try {
      await aprobacionesService.aprobarSolicitud(idCarga, idJefatura);
      setMessage({ type: 'success', text: '✅ Solicitud aprobada. Los fondos han sido transferidos a la cuenta de la familia.' });
      setTimeout(() => {
        setMessage(null);
        fetchSolicitudes();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setBtnLoading(false);
    }
  };

  const handleRechazar = async (idCarga) => {
    if (!motivoRechazo.trim()) {
      alert('Debe ingresar un motivo para rechazar la solicitud.');
      return;
    }
    setBtnLoading(true);
    setMessage(null);
    try {
      await aprobacionesService.rechazarSolicitud(idCarga, idJefatura);
      setMessage({ type: 'success', text: '❌ Solicitud rechazada correctamente. Los saldos no se alteraron.' });
      setShowRechazoInput(false);
      setMotivoRechazo('');
      setTimeout(() => {
        setMessage(null);
        fetchSolicitudes();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setBtnLoading(false);
    }
  };

  const verDocumento = (idCarga) => {
    const url = aprobacionesService.obtenerUrlPdf(idCarga);
    window.open(url, '_blank');
  };

  const solicitudesFiltradas = solicitudes.filter(s => 
    s.nombre_familia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rut_representante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nombre_asistente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.solicitante_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="aprobaciones" onLogout={logout} />
      
      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Bandeja de Aprobaciones Financieras</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Revise, valide y autorice las solicitudes de carga de saldo elevadas por los asistentes sociales.
            </div>
          </div>
        </div>

        {message && (
          <div className={`border rounded-[3px] p-[8px_12px] text-[12px] mb-[14px] ${
            message.type === 'error' ? 'bg-[#ffebee] border-[#ffcdd2] text-[#c62828]' : 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-[1.1fr_1fr] gap-[14px] items-start">
          <AprobacionesSidebar 
            solicitudes={solicitudesFiltradas}
            selectedSolicitud={selectedSolicitud}
            setSelectedSolicitud={setSelectedSolicitud}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowRechazoInput={setShowRechazoInput}
            setMotivoRechazo={setMotivoRechazo}
          />

          <AprobacionesDetail 
            solicitud={selectedSolicitud}
            btnLoading={btnLoading}
            handleAprobar={handleAprobar}
            handleRechazar={handleRechazar}
            verDocumento={verDocumento}
            showRechazoInput={showRechazoInput}
            setShowRechazoInput={setShowRechazoInput}
            motivoRechazo={motivoRechazo}
            setMotivoRechazo={setMotivoRechazo}
          />
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default AprobacionesPage;