import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import BeneficiarioForm from '../components/ui/BeneficiarioForm';
import IntegrantesTable from '../components/ui/IntegrantesTable';
import { useAuth } from '../hooks/useAuth';
import beneficiariesService from '../services/beneficiariesService';

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

const EditBeneficiarioPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { rut } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [beneficiario, setBeneficiario] = useState(initialBeneficiario);
  const [integrantesAdicionales, setIntegrantesAdicionales] = useState([]);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setLoading(true);
        const data = await beneficiariesService.getBeneficiaryDetail(rut);
        const personal = data?.datos_personales || {};
        const representante = data?.nucleo_familiar?.[0] || {};

        setBeneficiario({
          nombre_completo: personal.nombre_representante || representante.nombre_completo || '',
          rut: personal.rut_representante || '',
          fecha_nacimiento: representante.fecha_nacimiento || '',
          sexo: personal.sexo || representante.sexo || '',
          telefono: personal.telefono || representante.telefono || '',
          correo_electronico: personal.correo_electronico || representante.correo_electronico || '',
          direccion: personal.direccion || '',
          sector_localidad: personal.sector_localidad || '',
          telefono_hogar: personal.telefono_hogar || '',
          tiene_discapacidad: Boolean(personal.tiene_discapacidad ?? representante.tiene_discapacidad ?? false),
          observaciones: personal.observaciones || representante.observaciones || '',
          rol_en_hogar: representante.parentesco || 'Jefa de hogar',
          clave_acceso: '',
          confirmar_clave: '',
          quiero_definir_clave: false
        });

        setIntegrantesAdicionales((data?.nucleo_familiar || []).slice(1).map((member, index) => ({
          id: `integrante-${index}`,
          ...initialIntegrante,
          ...member
        })));
      } catch (error) {
        setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (rut) {
      cargarDetalle();
    }
  }, [rut]);

  const handleBeneficiarioChange = (field, value) => {
    setBeneficiario(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegranteChange = (id, field, value) => {
    setIntegrantesAdicionales(prev => prev.map(int => (int.id === id ? { ...int, [field]: value } : int)));
  };

  const agregarIntegrante = () => {
    const newId = `integrante-${Date.now()}`;
    setIntegrantesAdicionales(prev => [...prev, { id: newId, ...initialIntegrante }]);
  };

  const eliminarIntegrante = (id) => {
    setIntegrantesAdicionales(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
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

      if (integrantesAdicionales.some(int => !int.nombre_completo || !int.parentesco || !int.fecha_nacimiento)) {
        throw new Error('Completa todos los campos de los integrantes adicionales');
      }

      const payload = {
        rut_representante: rutRepresentante,
        nombre_representante: nombreCompleto,
        direccion: beneficiario.direccion,
        sector_localidad: beneficiario.sector_localidad,
        telefono: beneficiario.telefono || beneficiario.telefono_hogar || null,
        telefono_hogar: beneficiario.telefono_hogar,
        correo_electronico: beneficiario.correo_electronico || null,
        sexo: beneficiario.sexo || null,
        observaciones: beneficiario.observaciones || null,
        tiene_discapacidad: beneficiario.tiene_discapacidad,
        ...(beneficiario.quiero_definir_clave ? { clave_acceso: beneficiario.clave_acceso } : {}),
        integrantes: [
          {
            nombre_completo: nombreCompleto,
            rut: rutRepresentante,
            parentesco: beneficiario.rol_en_hogar,
            sexo: beneficiario.sexo || null,
            fecha_nacimiento: beneficiario.fecha_nacimiento,
            correo_electronico: beneficiario.correo_electronico || null,
            telefono: beneficiario.telefono || beneficiario.telefono_hogar || null,
            tiene_discapacidad: beneficiario.tiene_discapacidad,
            observaciones: beneficiario.observaciones || null
          },
          ...integrantesAdicionales.map(integrante => ({
            nombre_completo: integrante.nombre_completo,
            rut: integrante.rut || null,
            parentesco: integrante.parentesco,
            sexo: integrante.sexo || null,
            fecha_nacimiento: integrante.fecha_nacimiento,
            correo_electronico: integrante.correo_electronico || null,
            telefono: integrante.telefono || null,
            tiene_discapacidad: integrante.tiene_discapacidad,
            observaciones: integrante.observaciones || null
          }))
        ]
      };

      await beneficiariesService.updateBeneficiary(rut, payload);
      setMessage({ text: '✅ Datos actualizados correctamente', type: 'success' });
      setTimeout(() => navigate('/beneficiarios'), 1200);
    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="beneficiarios" onLogout={logout} />

      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Editar datos del beneficiario</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Actualice la información del beneficiario y del núcleo familiar en una vista más amplia y ordenada.
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

        {loading ? (
          <div className="bg-white border border-gris-borde rounded-[6px] p-[24px] text-center text-gris-claro">
            Cargando datos del beneficiario...
          </div>
        ) : (
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

            <div className="flex justify-end gap-[10px] mt-[4px]">
              <button type="button" onClick={() => navigate('/beneficiarios')} disabled={saving} className="bg-white border border-gris-borde text-gris-texto rounded-[4px] px-[22px] py-[9px] text-[13px] cursor-pointer hover:bg-[#f5f5f5]">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className={`bg-verde text-white border-none rounded-[4px] px-[24px] py-[9px] text-[13px] font-semibold ${saving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'}`}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        )}
      </div>

      <DashboardFooter />
    </div>
  );
};

export default EditBeneficiarioPage;
