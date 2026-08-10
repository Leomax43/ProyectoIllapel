import { useState, useEffect } from 'react';
import fondosService from '../services/fondosService';
import beneficiariesService from '../services/beneficiariesService';

const ITEMS_POR_PAGINA = 8;

export const useCargaFondosHistorial = (estadoFilter = 'TODOS') => {
  const [cargas, setCargas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarga, setSelectedCarga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiltradas, setTotalFiltradas] = useState(0);

  const [metricas, setMetricas] = useState({
    cargasEsteMes: 0,
    totalDistribuidoMes: 0,
    beneficiariosUnicosMes: 0,
    cargasBloqueadas: 0,
    beneficiariosHabilitados: 0,
    nombreMesAño: ''
  });

  // Reset a página 1 cuando cambia el filtro de búsqueda o de estado
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, estadoFilter]);

  // Métricas: una sola consulta con todas las cargas (sin paginación efectiva)
  useEffect(() => {
    const fetchDatosYCalcularMetricas = async () => {
      try {
        const data = await fondosService.obtenerCargas({ page: 1, limit: 10000, search: '', estado: 'TODOS' });
        const todasLasCargas = data.cargas || [];

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

        const cargasDelMes = todasLasCargas.filter(carga => {
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
        const rutsUnicosMes = new Set(cargasAprobadasDelMes.map(carga => carga.rut_representante));
        const beneficiariosUnicosMes = rutsUnicosMes.size;
        const cargasBloqueadas = todasLasCargas.filter(carga => 
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
      }
    };

    fetchDatosYCalcularMetricas();
  }, []);

  // Tabla: consulta paginada y filtrada desde el backend
  useEffect(() => {
    const fetchCargas = async () => {
      setLoading(true);
      try {
        const data = await fondosService.obtenerCargas({
          page: currentPage,
          limit: ITEMS_POR_PAGINA,
          search: searchTerm,
          estado: estadoFilter
        });

        const cargasObtenidas = data.cargas || [];
        setCargas(cargasObtenidas);
        setTotalFiltradas(data.paginacion?.total_registros || 0);
        setTotalPages(data.paginacion?.total_paginas || 1);
        setSelectedCarga(null);
      } catch (err) {
        console.error('❌ Error obteniendo las cargas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCargas();
  }, [currentPage, searchTerm, estadoFilter]);

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
    totalFiltradas,
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
