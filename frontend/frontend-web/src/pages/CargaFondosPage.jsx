import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import BuscarBeneficiarioPanel from '../components/dashboard/BuscarBeneficiarioPanel';
import ValidacionFamiliarPanel from '../components/dashboard/ValidacionFamiliarPanel';
import FormularioMontoPanel from '../components/dashboard/FormularioMontoPanel';
import DocumentacionRespaldoPanel from '../components/dashboard/DocumentacionRespaldoPanel';
import ResumenOperacionPanel from '../components/dashboard/ResumenOperacionPanel';
import { useAuth } from '../hooks/useAuth';
import beneficiariesService from '../services/beneficiariesService';

const CargaFondosPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [beneficiariosList, setBeneficiariosList] = useState([]);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null);
  const [montoInput, setMontoInput] = useState('');
  const [tipoAyuda, setTipoAyuda] = useState('Seleccione...');
  const [observaciones, setObservaciones] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

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
      
      const formData = new FormData();
      formData.append('id_admin', user.id_admin);
      formData.append('monto', parseInt(montoInput));
      formData.append('motivo', tipoAyuda);
      formData.append('observaciones', observaciones || 'N/A');
      if (pdfFile) formData.append('pdf_resolucion', pdfFile);

      const response = await fetch(`http://localhost:3000/api/fondos/${selectedBeneficiario.datos_personales?.id_familia}/cargar`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || 'Error al procesar la solicitud.');

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
    return `inline-block p-[2px_8px] rounded-[10px] text-[11px] font-bold ${
      isActive ? 'bg-[#d1e7dd] text-[#0f5132]' : 'bg-[#f8d7da] text-[#842029]'
    }`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      <DashboardHeader currentPage="fondos" onLogout={logout} onNavigate={navigate} />
      
      <div className="p-[16px] flex-1">
        <div className="text-[16px] font-bold text-[#1a3a5c] mb-[4px]">Carga de fondos</div>
        <div className="text-[12px] text-[#666666] mb-[16px]">
          Eleve una solicitud de asignación de saldo a un beneficiario activo. Quedará en estado pendiente hasta ser aprobada por Jefatura.
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
    </div>
  );
};

export default CargaFondosPage;