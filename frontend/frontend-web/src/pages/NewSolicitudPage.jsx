import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import BeneficiarioForm from '../components/ui/BeneficiarioForm';
import IntegrantesTable from '../components/ui/IntegrantesTable';
import PdfDropzone from '../components/ui/PdfDropzone';
import { useAuth } from '../hooks/useAuth';
import solicitudesService from '../services/solicitudesService';

const NewSolicitudPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [beneficiario, setBeneficiario] = useState({
    nombres: '',
    apellidos: '',
    rut: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    rol_en_hogar: 'Jefa de hogar',
    clave_acceso: ''
  });

  const [integrantesAdicionales, setIntegrantesAdicionales] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

  const handleBeneficiarioChange = (field, value) => {
    setBeneficiario(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegranteChange = (id, field, value) => {
    setIntegrantesAdicionales(prev =>
      prev.map(int => int.id === id ? { ...int, [field]: value } : int)
    );
  };

  const agregarIntegrante = () => {
    const newId = Math.max(...integrantesAdicionales.map(i => i.id), 0) + 1;
    setIntegrantesAdicionales(prev => [
      ...prev,
      { id: newId, nombre_completo: '', rut: '', parentesco: 'Cónyuge', fecha_nacimiento: '' }
    ]);
  };

  const eliminarIntegrante = (id) => {
    setIntegrantesAdicionales(prev => prev.filter(int => int.id !== id));
  };

  const handlePdfSelected = (file) => {
    setPdfFile(file);
    setPdfFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!beneficiario.nombres || !beneficiario.apellidos || !beneficiario.rut || !beneficiario.direccion || !beneficiario.fecha_nacimiento) {
        throw new Error('Faltan campos obligatorios del beneficiario principal');
      }

      if (integrantesAdicionales.some(int => !int.nombre_completo || !int.parentesco || !int.fecha_nacimiento)) {
        throw new Error('Completa todos los campos de los integrantes adicionales');
      }

      const familiaPayload = {
        rut_representante: beneficiario.rut,
        nombre_familia: `Familia ${beneficiario.apellidos}`,
        telefono: beneficiario.telefono,
        direccion: beneficiario.direccion,
        clave_acceso: beneficiario.clave_acceso || '1234'
      };

      const familiaRes = await solicitudesService.crearFamilia(familiaPayload);
      const id_familia = familiaRes.familia.id_familia;

      const primerIntegrantePayload = {
        nombre_completo: `${beneficiario.nombres} ${beneficiario.apellidos}`,
        rut: beneficiario.rut,
        parentesco: beneficiario.rol_en_hogar,
        fecha_nacimiento: beneficiario.fecha_nacimiento
      };
      await solicitudesService.agregarIntegrante(id_familia, primerIntegrantePayload);

      for (const integrante of integrantesAdicionales) {
        const integrantePayload = {
          nombre_completo: `${integrante.nombre_completo}`,
          rut: integrante.rut || null,
          parentesco: integrante.parentesco,
          fecha_nacimiento: integrante.fecha_nacimiento
        };
        await solicitudesService.agregarIntegrante(id_familia, integrantePayload);
      }

      if (pdfFile) {
        await solicitudesService.subirFichaSocial(id_familia, pdfFile);
      }

      setMessage({ text: '✅ Solicitud creada exitosamente', type: 'success' });
      
      setTimeout(() => {
        setBeneficiario({
          nombres: '',
          apellidos: '',
          rut: '',
          fecha_nacimiento: '',
          telefono: '',
          direccion: '',
          rol_en_hogar: 'Jefa de hogar',
          clave_acceso: ''
        });
        setIntegrantesAdicionales([]);
        setPdfFile(null);
        setPdfFileName('');
        navigate('/beneficiarios');
      }, 2000);

    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="beneficiarios" onLogout={logout} />

      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Ingresar nueva solicitud</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Complete los datos del beneficiario principal que solicita el beneficio. Si la solicitud incluye otros miembros del núcleo familiar (pareja, hijos, etc.), agréguelos en la segunda sección. La cuenta quedará en estado "Pendiente" hasta ser aprobada por la Jefatura.
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

        <form onSubmit={handleSubmit}>
          <BeneficiarioForm 
            beneficiario={beneficiario} 
            onBeneficiarioChange={handleBeneficiarioChange} 
          />

          <IntegrantesTable 
            integrantes={integrantesAdicionales}
            onIntegranteChange={handleIntegranteChange}
            onEliminarIntegrante={eliminarIntegrante}
            onAgregarIntegrante={agregarIntegrante}
          />

          <PdfDropzone 
            pdfFileName={pdfFileName}
            onPdfChange={handlePdfSelected}
            onMessageChange={setMessage}
          />

          <div className="flex justify-end gap-[8px] mt-[16px]">
            <button
              type="button"
              onClick={() => navigate('/beneficiarios')}
              disabled={loading}
              className="bg-white border border-gris-borde text-gris-texto rounded-[3px] px-[20px] py-[8px] text-[13px] cursor-pointer hover:bg-[#f5f5f5]"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-azul text-white border-none rounded-[3px] px-[20px] py-[8px] text-[13px] font-bold ${
                loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'
              }`}
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              {loading ? 'Guardando...' : 'Enviar solicitud →'}
            </button>
          </div>
        </form>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default NewSolicitudPage;