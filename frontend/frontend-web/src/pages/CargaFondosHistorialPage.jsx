import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import CargaFondosList from '../components/cargaFondos/CargaFondosList';
import CargaFondosDetail from '../components/cargaFondos/CargaFondosDetail'; 
import { useAuth } from '../hooks/useAuth';
import fondosService from '../services/fondosService';

const CargaFondosHistorialPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarga, setSelectedCarga] = useState(null);
  const [cargas, setCargas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCargas = async () => {
      try {
        setLoading(true);
        const data = await fondosService.obtenerTodasLasCargas();
        setCargas(data);
        if (data.length > 0) {
          setSelectedCarga(data[0]);
        }
      } catch (err) {
        console.error('❌ Error cargando cargas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCargas();
  }, []);

  const formatCurrency = (value) => parseInt(value).toLocaleString('es-CL');
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('es-CL') : '—';

  const cargasFiltradas = cargas.filter(carga => {
    const searchLower = searchTerm.toLowerCase();
    return (
      carga.nombre_familia?.toLowerCase().includes(searchLower) ||
      carga.rut_principal?.toLowerCase().includes(searchLower) ||
      carga.motivo?.toLowerCase().includes(searchLower)
    );
  });

  const detalle = selectedCarga || (cargas.length > 0 ? cargas[0] : null);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      <DashboardHeader currentPage="fondos" onLogout={logout} onNavigate={navigate} />

      <div className="p-[16px] flex-1">
        <div className="text-[16px] font-bold text-[#1a3a5c] mb-[4px]">Carga de fondos</div>
        <div className="text-[12px] text-[#666666] mb-[16px]">
          Historial de todas las cargas realizadas a beneficiarios. Seleccione una fila para ver el detalle, o presione "Nueva carga" para iniciar una nueva asignación.
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-4 gap-[10px] mb-[14px]">
          <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Cargas este mes</div>
            <div className="text-[20px] font-bold text-[#2563a0]">23</div>
            <div className="text-[11px] text-[#aaaaaa] mt-[2px]">mayo 2026</div>
          </div>
          <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Total distribuido este mes</div>
            <div className="text-[20px] font-bold text-[#1e7a3e]">$3.840.000</div>
            <div className="text-[11px] text-[#aaaaaa] mt-[2px]">a 23 beneficiarios</div>
          </div>
          <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Cargas bloqueadas</div>
            <div className="text-[20px] font-bold text-[#c47f00]">4</div>
            <div className="text-[11px] text-[#aaaaaa] mt-[2px]">por regla 30 días</div>
          </div>
          <div className="bg-[#ffffff] border border-[#dddddd] rounded-[4px] p-[10px_14px]">
            <div className="text-[11px] text-[#888888] mb-[3px]">Beneficiarios habilitados</div>
            <div className="text-[20px] font-bold text-[#2563a0]">128</div>
            <div className="text-[11px] text-[#aaaaaa] mt-[2px]">pueden recibir fondos</div>
          </div>
        </div>

        {/* Layout de componentes modulares */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-[14px] items-start">
          <CargaFondosList 
            cargasFiltradas={cargasFiltradas}
            totalCargas={cargas.length}
            selectedCarga={selectedCarga}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCargaSelect={setSelectedCarga}
            onNewCarga={() => navigate('/nueva-carga')}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            loading={loading}
            error={error}
          />

          <CargaFondosDetail 
            detalle={detalle}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

export default CargaFondosHistorialPage;