import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import BuscarBeneficiarioPanel from '../components/dashboard/BuscarBeneficiarioPanel';
import ValidacionFamiliarPanel from '../components/dashboard/ValidacionFamiliarPanel';
import FormularioMontoPanel from '../components/dashboard/FormularioMontoPanel';
import DocumentacionRespaldoPanel from '../components/dashboard/DocumentacionRespaldoPanel';
import ResumenOperacionPanel from '../components/dashboard/ResumenOperacionPanel';
import { useAuth } from '../hooks/useAuth';
import beneficiariesService from '../services/beneficiariesService';
import fondosService from '../services/fondosService';

const CargaFondosPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [beneficiariosList, setBeneficiariosList] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null);
  const autoSelectDone = useRef(false);
  const [montoInput, setMontoInput] = useState('');
  const [tipoAyuda, setTipoAyuda] = useState('Seleccione...');
  const [observaciones, setObservaciones] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

  // Si viene un RUT en la URL, seleccionar automáticamente al beneficiario
  useEffect(() => {
    const rutParam = searchParams.get('rut');
    if (rutParam && !autoSelectDone.current) {
      autoSelectDone.current = true;
      const autoSelect = async () => {
        setLoadingSearch(true);
        try {
          const detail = await beneficiariesService.getBeneficiaryDetail(rutParam);
          if (detail && detail.datos_personales) {
            setSelectedBeneficiario(detail);
          }
        } catch (error) {
          console.warn('No se pudo cargar beneficiario desde URL:', error);
        } finally {
          setLoadingSearch(false);
        }
      };
      autoSelect();
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchBeneficiarios();
    } else {
      setBeneficiariosList([]);
    }
  }, [searchTerm]);

  const fetchBeneficiarios = async () => {
    setLoadingSearch(true);
    try {
      const results = await beneficiariesService.search(searchTerm);
      setBeneficiariosList(results || []);
    } catch (error) {
      setMessage({ text: '❌ Error al buscar beneficiarios', type: 'error' });
      setBeneficiariosList([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectBeneficiario = async (beneficiario) => {
    setLoadingSearch(true);
    try {
      const detail = await beneficiariesService.getBeneficiaryDetail(beneficiario.rut_principal || beneficiario.rut_representante);
      setSelectedBeneficiario(detail);
      setBeneficiariosList([]);
      setSearchTerm('');
    } catch (error) {
      setMessage({ text: '❌ Error al cargar detalle del beneficiario', type: 'error' });
    } finally {
      setLoadingSearch(false);
    }
  };

  const handlePdfChange = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setMessage({ text: '❌ Solo se aceptan archivos PDF', type: 'error' });
      return;
    }
    const maxSizeMB = 10;
    if (file.size / (1024 * 1024) > maxSizeMB) {
      setMessage({ text: `❌ El archivo excede el tamaño máximo de ${maxSizeMB} MB`, type: 'error' });
      return;
    }
    setPdfFile(file);
    setPdfFileName(file.name);
    setMessage(null);
  };

  const getNuevoSaldo = () => {
    if (selectedBeneficiario && montoInput) {
      return (selectedBeneficiario.datos_personales?.saldo || 0) + parseInt(montoInput || 0);
    }
    return selectedBeneficiario?.datos_personales?.saldo || 0;
  };

  const handleConfirmar = async () => {
    if (!selectedBeneficiario || !montoInput || tipoAyuda === 'Seleccione...') {
      setMessage({ type: 'error', text: 'Faltan campos obligatorios para procesar la solicitud.' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const userStr = localStorage.getItem('illapel_token');
      if (!userStr) throw new Error('No hay usuario autenticado');
      const user = JSON.parse(userStr);
      
      await fondosService.solicitarCargaFondos(
        selectedBeneficiario.datos_personales?.id_familia,
        user.id_admin,
        parseInt(montoInput),
        tipoAyuda,
        observaciones,
        pdfFile
      );

      setMessage({ text: '✅ ¡Solicitud enviada! Queda en bandeja de revisión de Jefatura.', type: 'success' });
      setTimeout(() => {
        navigate('/fondos');
      }, 2500);
    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `$${value.toLocaleString('es-CL')}`;
  const badgeStyle = (estado) => {
    const isActive = estado === 'Activo' || estado === 'ACTIVO' || estado === 'Habilitado';
    return `inline-block px-[8px] py-[3px] rounded-[12px] text-[11px] font-semibold border ${
      isActive ? 'bg-[#e6f7f4] text-verde border-[#b2e8de]' : 'bg-[#fde8e8] text-[#b52b2b] border-[#f5b8b8]'
    }`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="fondos" onLogout={logout} />
      
      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Carga de fondos</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Eleve una solicitud de asignación de saldo a un beneficiario activo. Quedará en estado pendiente hasta ser aprobada por Jefatura.
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

        <div className="grid grid-cols-[1.2fr_1fr] gap-[14px] items-start">
          <div className="flex flex-col gap-[14px]">
            <BuscarBeneficiarioPanel
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              loadingSearch={loadingSearch}
              beneficiariosList={beneficiariosList}
              onSelectBeneficiario={handleSelectBeneficiario}
              selectedBeneficiario={selectedBeneficiario}
              formatCurrency={formatCurrency}
              badgeStyle={badgeStyle}
            />
            <ValidacionFamiliarPanel
              selectedBeneficiario={selectedBeneficiario}
              badgeStyle={badgeStyle}
            />
            <FormularioMontoPanel
              selectedBeneficiario={selectedBeneficiario}
              montoInput={montoInput}
              onMontoChange={setMontoInput}
              tipoAyuda={tipoAyuda}
              onTipoAyudaChange={setTipoAyuda}
              observaciones={observaciones}
              onObservacionesChange={setObservaciones}
              getNuevoSaldo={getNuevoSaldo}
              formatCurrency={formatCurrency}
            />
          </div>

          <div className="flex flex-col gap-[14px]">
            <DocumentacionRespaldoPanel
              selectedBeneficiario={selectedBeneficiario}
              pdfFileName={pdfFileName}
              onFileInputChange={(e) => handlePdfChange(e.target.files[0])}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDragDrop={(e) => { e.preventDefault(); e.stopPropagation(); handlePdfChange(e.dataTransfer.files[0]); }}
            />
            <ResumenOperacionPanel
              selectedBeneficiario={selectedBeneficiario}
              montoInput={montoInput}
              pdfFileName={pdfFileName}
              onCancel={() => navigate('/dashboard')}
              onConfirmar={handleConfirmar}
              loading={loading}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default CargaFondosPage;