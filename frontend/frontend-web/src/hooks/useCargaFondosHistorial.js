import { useState, useEffect } from 'react';
import fondosService from '../services/fondosService';
import beneficiariesService from '../services/beneficiariesService';

const ITEMS_POR_PAGINA = 8;

export const useCargaFondosHistorial = () => {
  const [cargas, setCargas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarga, setSelectedCarga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [metricas, setMetricas] = useState({
    cargasEsteMes: 0,
    totalDistribuidoMes: 0,
    beneficiariosUnicosMes: 0,
    cargasBloqueadas: 0,
    beneficiariosHabilitados: 0,
    nombreMesAño: ''
  });

  // Reset a página 1 cuando cambia el filtro de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchDatosYCalcularMetricas = async () => {
      try {
        setLoading(true);
        
        const dataCargas = await fondosService.obtenerTodasLasCargas();
        setCargas(dataCargas);
        if (dataCargas.length > 0 && !selectedCarga) {
          setSelectedCarga(dataCargas[0]);
        }

        let activosCount = 0;
        try {
          const statsBeneficiarios = await beneficiariesService.getBeneficiariesStats();
          activosCount = statsBeneficiarios?.datos?.activos || 0;
        } catch (errStats) {
          console.error('⚠️ No se pudieron obtener estadísticas globales de beneficiarios:', errStats);
        }

        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const añoActual = ahora.getFullYear();
        const nombreMesAño = ahora.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

        const cargasDelMes = dataCargas.filter(carga => {
          if (!carga.fecha) return false; // Ignorar cargas sin fecha
          const fechaCarga = new Date(carga.fecha);
          if (isNaN(fechaCarga.getTime())) return false; // Ignorar fechas inválidas
          return fechaCarga.getMonth() === mesActual && fechaCarga.getFullYear() === añoActual;
        });

        const cargasAprobadasDelMes = cargasDelMes.filter(carga => {
          const estado = String(carga.estado || '').trim().toUpperCase();
          return estado === 'APROBADA' || estado === 'APROBADO';
        });

        const totalDistribuidoMes = cargasAprobadasDelMes.reduce((sum, carga) => sum + (parseInt(carga.monto) || 0), 0);
        const rutsUnicosMes = new Set(cargasAprobadasDelMes.map(carga => carga.rut_principal));
        const beneficiariosUnicosMes = rutsUnicosMes.size;
        const cargasBloqueadas = dataCargas.filter(carga => 
          carga.estado === 'RECHAZADO' || carga.estado === 'BLOQUEADO'
        ).length;

        setMetricas({
          cargasEsteMes: cargasDelMes.length,
          totalDistribuidoMes,
          beneficiariosUnicosMes,
          cargasBloqueadas,
          beneficiariosHabilitados: activosCount,
          nombreMesAño
        });

      } catch (err) {
        console.error('❌ Error cargando el historial de fondos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosYCalcularMetricas();
  }, []);

  // Filtrado reactivo por término de búsqueda
  const cargasFiltradas = cargas.filter(carga => {
    const searchLower = searchTerm.toLowerCase();
    return (
      carga.nombre_representante?.toLowerCase().includes(searchLower) ||
      carga.nombre_familia?.toLowerCase().includes(searchLower) ||
      carga.rut_principal?.toLowerCase().includes(searchLower) ||
      carga.motivo?.toLowerCase().includes(searchLower)
    );
  });

  // Paginación
  const totalPages = Math.ceil(cargasFiltradas.length / ITEMS_POR_PAGINA);
  const startIndex = (currentPage - 1) * ITEMS_POR_PAGINA;
  const cargasPaginadas = cargasFiltradas.slice(startIndex, startIndex + ITEMS_POR_PAGINA);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    cargas,
    cargasFiltradas: cargasPaginadas,
    totalFiltradas: cargasFiltradas.length,
    searchTerm,
    setSearchTerm,
    selectedCarga,
    setSelectedCarga,
    loading,
    error,
    metricas,
    currentPage,
    totalPages,
    nextPage,
    prevPage
  };
};