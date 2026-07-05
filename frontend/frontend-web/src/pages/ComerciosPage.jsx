import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import ComerciosList from '../components/comercios/ComerciosList'; 
import ComercioDetail from '../components/comercios/ComercioDetail';
import { useAuth } from '../hooks/useAuth';
import comerciosService from '../services/comerciosService';

const ComerciosPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [comercios, setComercios] = useState([]);
  const [selectedComercio, setSelectedComercio] = useState(null);
  const [comercioDetalle, setComercioDetalle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchComercios();
  }, []);

  const fetchComercios = async () => {
    setLoading(true);
    try {
      const response = await comerciosService.obtenerComercios();
      setComercios(response);
      if (response.length > 0) {
        setSelectedComercio(response[0]);
        fetchComercioDetalle(response[0].rut_comercio);
      }
    } catch (error) {
      console.error('Error fetching comercios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComercioDetalle = async (rut) => {
    try {
      const response = await comerciosService.obtenerComercioDetalle(rut);
      setComercioDetalle(response);
    } catch (error) {
      console.error('Error fetching detalle:', error);
    }
  };

  const filteredComercios = comercios.filter(c => {
    const matchesSearch = searchTerm === '' ||
      c.nombre_comercio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rut_comercio.includes(searchTerm) ||
      c.rubro.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = estadoFilter === 'Todos' || c.estado === estadoFilter;
    
    return matchesSearch && matchesEstado;
  });

  const handleComercioSelect = (comercio) => {
    setSelectedComercio(comercio);
    fetchComercioDetalle(comercio.rut_comercio);
  };

  const handleEstadoCambiado = async (rut, nuevoEstado) => {
    if (!confirm(`¿Estás seguro de ${nuevoEstado === 'BAJA' ? 'dar de baja' : 'activar'} este comercio?`)) return;
    
    try {
      await comerciosService.cambiarEstado(rut, nuevoEstado);
      setMensaje({ tipo: 'exito', texto: `Comercio ${nuevoEstado === 'BAJA' ? 'dado de baja' : 'activado'} correctamente` });
      fetchComercios();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  };

  const formatCurrency = (value) => `$${value.toLocaleString('es-CL')}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('es-CL');

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="comercios" onLogout={logout} />
      
      <div className="p-[18px_20px] flex-1">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <div className="text-[18px] font-bold text-azul">Gestión de comercios</div>
            <div className="text-[12px] text-gris-texto mt-[2px] font-light">
              Administre los comercios locales verificados por la municipalidad. Puede registrar nuevos establecimientos, revisar su saldo acumulado y darlos de baja.
            </div>
          </div>
        </div>

        {mensaje && (
          <div className={`p-[10px] mb-[12px] rounded-[4px] text-[12px] font-bold ${
            mensaje.tipo === 'exito' ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]' : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
          }`}>
            {mensaje.texto}
            <button onClick={() => setMensaje(null)} className="float-right font-bold cursor-pointer bg-transparent border-none">×</button>
          </div>
        )}

        {loading ? (
          <div className="text-center text-[12px] text-gris-texto py-[32px]">Cargando comercios...</div>
        ) : (
          <div className="grid grid-cols-[1.3fr_1fr] gap-[14px] items-start">
      <ComerciosList
        filteredComercios={filteredComercios}
        totalComercios={comercios.length}
        selectedComercio={selectedComercio}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        estadoFilter={estadoFilter}
        onEstadoChange={setEstadoFilter}
        onComercioSelect={handleComercioSelect}
        onNewComercio={() => navigate('/nuevo-comercio')}
        formatCurrency={(val) => `$${parseInt(val || 0).toLocaleString('es-CL')}`}
        onEstadoCambiado={handleEstadoCambiado}
      />

            <ComercioDetail 
              selectedComercio={selectedComercio}
              comercioDetalle={comercioDetalle}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </div>
        )}
      </div>

      <DashboardFooter />
    </div>
  );
};

export default ComerciosPage;