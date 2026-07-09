import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import ComercioForm from '../components/ui/ComercioForm';
import { useAuth } from '../hooks/useAuth';
import comerciosService from '../services/comerciosService';

const NewComercioPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 1. Agregamos los nuevos campos al estado inicial
  const [comercio, setComercio] = useState({
    nombre_comercio: '',
    rut: '',
    responsable: '',
    telefono: '',
    rubro: 'Seleccione...',
    direccion: '',
    // Nuevos campos bancarios
    correo_electronico: '',
    nombre_banco: '',
    tipo_cuenta: '',
    numero_cuenta: '',
    // Claves
    clave_acceso: '',
    confirmar_clave: '',
    quiero_definir_clave: false
  });

  const handleChange = (field, value) => {
    setComercio(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!comercio.nombre_comercio || !comercio.rut || !comercio.responsable || !comercio.telefono || comercio.rubro === 'Seleccione...' || !comercio.direccion) {
        throw new Error('Faltan campos obligatorios');
      }

      // 2. Nueva lógica de validación de contraseña idéntica a Beneficiarios
      if (comercio.quiero_definir_clave) {
        if (!comercio.clave_acceso || comercio.clave_acceso.length < 6) {
          throw new Error('La clave personalizada debe tener al menos 6 caracteres');
        }
        if (comercio.clave_acceso !== comercio.confirmar_clave) {
          throw new Error('Las claves no coinciden');
        }
      }

      // 3. Definimos la clave final (personalizada o por defecto)
      const claveFinal = comercio.quiero_definir_clave ? comercio.clave_acceso : '1234';

      const payload = {
        rut_comercio: comercio.rut,
        nombre_comercio: comercio.nombre_comercio,
        responsable: comercio.responsable,
        direccion: comercio.direccion,
        telefono: comercio.telefono,
        rubro: comercio.rubro,
        correo_electronico: comercio.correo_electronico, // Nuevo campo
        nombre_banco: comercio.nombre_banco,             // Nuevo campo
        tipo_cuenta: comercio.tipo_cuenta,               // Nuevo campo
        numero_cuenta: comercio.numero_cuenta,           // Nuevo campo
        clave_acceso: claveFinal
      };

      await comerciosService.crearComercio(payload);
      
      setMessage({ text: '✅ Comercio registrado exitosamente', type: 'success' });
      
      setTimeout(() => {
        setComercio({
          nombre_comercio: '',
          rut: '',
          responsable: '',
          telefono: '',
          rubro: 'Seleccione...',
          direccion: '',
          clave_acceso: '',
          confirmar_clave: '',
          quiero_definir_clave: false
        });
        navigate('/comercios');
      }, 2000);

    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="comercios" onLogout={logout} />

      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Registrar nuevo comercio</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Ingrese los datos del establecimiento comercial local para habilitar su integración con el sistema de subsidios. Una vez registrado, podrá recibir pagos mediante la plataforma.
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
          <ComercioForm 
            comercio={comercio} 
            onComercioChange={handleChange} 
          />

          <div className="flex justify-end gap-[8px] mt-[16px]">
            <button
              type="button"
              onClick={() => navigate('/comercios')}
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
              {loading ? 'Guardando...' : 'Registrar comercio →'}
            </button>
          </div>
        </form>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default NewComercioPage;