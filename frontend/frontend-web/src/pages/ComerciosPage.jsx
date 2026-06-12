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

  useEffect(() => {
    fetchComercios();
  }, []);

  const fetchComercios = async () => {
    setLoading(true);
    try {
      const response = await comerciosService.getComercios();
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
      const response = await comerciosService.getComercioDetalle(rut);
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
              formatCurrency={formatCurrency}
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