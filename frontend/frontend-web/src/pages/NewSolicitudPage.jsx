import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import BeneficiarioForm from '../components/ui/BeneficiarioForm';
import IntegrantesTable from '../components/ui/IntegrantesTable';
import PdfDropzone from '../components/ui/PdfDropzone';
import { useAuth } from '../hooks/useAuth';
import solicitudesService from '../services/solicitudesService';

const initialBeneficiario = {
  nombre_completo: '',
  rut: '',
  fecha_nacimiento: '',
  sexo: '',
  telefono: '',
  correo_electronico: '',
  direccion: '',
  sector_localidad: '',
  telefono_hogar: '',
  tiene_discapacidad: false,
  observaciones: '',
  rol_en_hogar: 'Jefa de hogar',
  clave_acceso: '',
  confirmar_clave: '',
  quiero_definir_clave: false
};

const initialIntegrante = {
  nombre_completo: '',
  rut: '',
  parentesco: 'Cónyuge',
  sexo: '',
  fecha_nacimiento: '',
  telefono: '',
  correo_electronico: '',
  tiene_discapacidad: false,
  observaciones: ''
};

const NewSolicitudPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [beneficiario, setBeneficiario] = useState(initialBeneficiario);
  const [integrantesAdicionales, setIntegrantesAdicionales] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

  const handleBeneficiarioChange = (field, value) => {
    setBeneficiario(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegranteChange = (id, field, value) => {
    setIntegrantesAdicionales(prev =>
      prev.map(int => (int.id === id ? { ...int, [field]: value } : int))
    );
  };

  const agregarIntegrante = () => {
    const newId = Math.max(...integrantesAdicionales.map(item => item.id), 0) + 1;
    setIntegrantesAdicionales(prev => [
      ...prev,
      { id: newId, ...initialIntegrante }
    ]);
  };

  const eliminarIntegrante = (id) => {
    setIntegrantesAdicionales(prev => prev.filter(item => item.id !== id));
  };

  const handlePdfSelected = (file) => {
    setPdfFile(file);
    setPdfFileName(file.name);
  };

  const resetForm = () => {
    setBeneficiario(initialBeneficiario);
    setIntegrantesAdicionales([]);
    setPdfFile(null);
    setPdfFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const nombreCompleto = beneficiario.nombre_completo.trim();
      const rutRepresentante = beneficiario.rut.trim();

      if (!nombreCompleto || !rutRepresentante || !beneficiario.fecha_nacimiento || !beneficiario.direccion || !beneficiario.sector_localidad) {
        throw new Error('Faltan campos obligatorios del beneficiario principal');
      }

      if (beneficiario.quiero_definir_clave) {
        if (!beneficiario.clave_acceso || beneficiario.clave_acceso.length < 6) {
          throw new Error('La clave personalizada debe tener al menos 6 caracteres');
        }
        if (beneficiario.clave_acceso !== beneficiario.confirmar_clave) {
          throw new Error('Las claves no coinciden');
        }
      }

      if (!pdfFile) {
        throw new Error('Adjunta la ficha social en formato PDF');
      }

      if (integrantesAdicionales.some(int => !int.nombre_completo || !int.parentesco || !int.fecha_nacimiento)) {
        throw new Error('Completa todos los campos de los integrantes adicionales');
      }

      const claveAcceso = beneficiario.quiero_definir_clave ? beneficiario.clave_acceso : '1234';

      const familiaPayload = {
        rut_representante: rutRepresentante,
        nombre_representante: nombreCompleto,
        nombre_familia: `Familia ${nombreCompleto}`,
        direccion: beneficiario.direccion,
        sector_localidad: beneficiario.sector_localidad,
        telefono: beneficiario.telefono || beneficiario.telefono_hogar || null,
        telefono_hogar: beneficiario.telefono_hogar,
        correo_electronico: beneficiario.correo_electronico || null,
        sexo: beneficiario.sexo || null,
        observaciones: beneficiario.observaciones || null,
        tiene_discapacidad: beneficiario.tiene_discapacidad,
        clave_acceso: claveAcceso
      };

      const familiaRes = await solicitudesService.crearFamilia(familiaPayload);
      const id_familia = familiaRes.familia.id_familia;

      const primerIntegrantePayload = {
        nombre_completo: nombreCompleto,
        rut: rutRepresentante,
        parentesco: beneficiario.rol_en_hogar,
        sexo: beneficiario.sexo || null,
        fecha_nacimiento: beneficiario.fecha_nacimiento,
        correo_electronico: beneficiario.correo_electronico || null,
        telefono: beneficiario.telefono || beneficiario.telefono_hogar || null,
        tiene_discapacidad: beneficiario.tiene_discapacidad,
        observaciones: beneficiario.observaciones || null
      };
      await solicitudesService.agregarIntegrante(id_familia, primerIntegrantePayload);

      for (const integrante of integrantesAdicionales) {
        const integrantePayload = {
          nombre_completo: integrante.nombre_completo,
          rut: integrante.rut || null,
          parentesco: integrante.parentesco,
          sexo: integrante.sexo || null,
          fecha_nacimiento: integrante.fecha_nacimiento,
          correo_electronico: integrante.correo_electronico || null,
          telefono: integrante.telefono || null,
          tiene_discapacidad: integrante.tiene_discapacidad,
          observaciones: integrante.observaciones || null
        };
        await solicitudesService.agregarIntegrante(id_familia, integrantePayload);
      }

      await solicitudesService.subirFichaSocial(id_familia, pdfFile);

      setMessage({ text: '✅ Solicitud creada exitosamente', type: 'success' });

      setTimeout(() => {
        resetForm();
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
              Complete los datos del representante familiar. Los integrantes adicionales del núcleo son opcionales y se guardarán en el mismo expediente.
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

          <div className="flex justify-end gap-[10px] mt-[4px]">
            <button type="button" onClick={() => navigate('/beneficiarios')} disabled={loading} className="bg-white border border-gris-borde text-gris-texto rounded-[4px] px-[22px] py-[9px] text-[13px] cursor-pointer hover:bg-[#f5f5f5]">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={`bg-verde text-white border-none rounded-[4px] px-[24px] py-[9px] text-[13px] font-semibold ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'}`}>
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