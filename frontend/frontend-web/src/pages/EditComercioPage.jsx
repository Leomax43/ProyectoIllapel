import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import ComercioForm from '../components/ui/ComercioForm';
import { useAuth } from '../hooks/useAuth';
import comerciosService from '../services/comerciosService';

const EditComercioPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { rut } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [comercio, setComercio] = useState({
    nombre_comercio: '',
    rut: '',
    responsable: '',
    telefono: '',
    rubro: 'Seleccione...',
    direccion: '',
    // Nuevos campos
    correo_electronico: '',
    nombre_banco: '',
    tipo_cuenta: '',
    numero_cuenta: '',
    clave_acceso: '',
    confirmar_clave: '',
    quiero_definir_clave: false
  });

  useEffect(() => {
    const cargarComercio = async () => {
      try {
        setLoading(true);
        const data = await comerciosService.obtenerComercioDetalle(rut);
        const datos = data.datos_comercio || data;
        setComercio({
          nombre_comercio: datos.nombre_comercio || '',
          rut: datos.rut_comercio || '',
          responsable: datos.responsable || '',
          telefono: datos.telefono || '',
          rubro: datos.rubro || 'Seleccione...',
          direccion: datos.direccion || '',
          // Rellenar nuevos campos
          correo_electronico: datos.correo_electronico || '',
          nombre_banco: datos.nombre_banco || '',
          tipo_cuenta: datos.tipo_cuenta || '',
          numero_cuenta: datos.numero_cuenta || '',
          clave_acceso: '',
          confirmar_clave: '',
          quiero_definir_clave: false
        });
      } catch (error) {
        setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (rut) {
      cargarComercio();
    }
  }, [rut]);

  const handleChange = (field, value) => {
    setComercio(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!comercio.nombre_comercio || !comercio.responsable || !comercio.telefono || comercio.rubro === 'Seleccione...' || !comercio.direccion) {
        throw new Error('Faltan campos obligatorios');
      }

      const payload = {
        nombre_comercio: comercio.nombre_comercio,
        responsable: comercio.responsable,
        direccion: comercio.direccion,
        telefono: comercio.telefono,
        rubro: comercio.rubro,
        // Incluir campos bancarios en el envío
        correo_electronico: comercio.correo_electronico,
        nombre_banco: comercio.nombre_banco,
        tipo_cuenta: comercio.tipo_cuenta,
        numero_cuenta: comercio.numero_cuenta
      };

      await comerciosService.actualizarComercio(rut, payload);
      
      setMessage({ text: '✅ Comercio actualizado exitosamente', type: 'success' });
      
      setTimeout(() => {
        navigate('/comercios');
      }, 2000);

    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gris-bg">
        <DashboardHeader currentPage="comercios" onLogout={logout} />
        <div className="flex-1 flex items-center justify-center text-[12px] text-gris-texto">
          Cargando datos del comercio...
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="comercios" onLogout={logout} />

      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Editar comercio</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Modifique los datos del establecimiento comercial. El RUT no se puede modificar.
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
              disabled={saving}
              className="bg-white border border-gris-borde text-gris-texto rounded-[3px] px-[20px] py-[8px] text-[13px] cursor-pointer hover:bg-[#f5f5f5]"
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`bg-azul text-white border-none rounded-[3px] px-[20px] py-[8px] text-[13px] font-bold ${
                saving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'
              }`}
              style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
            >
              {saving ? 'Guardando...' : 'Guardar cambios →'}
            </button>
          </div>
        </form>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default EditComercioPage;