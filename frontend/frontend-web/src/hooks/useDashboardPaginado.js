import { useState, useEffect, useRef } from 'react';
import { obtenerResumenDashboard } from '../services/dashboardService.js';

export function useDashboardPaginado(searchTerm = '') {
  const [data, setData] = useState({
    indicadores: {
      beneficiariosActivos: 0,
      solicitudesPendientes: 0,
      comerciosRegistrados: 0,
      fondosCargadosTotales: 0,
    },
    familias: [],
    paginacion: {
      paginaActual: 1,
      totalPaginas: 1,
      totalRegistros: 0,
      registrosPorPagina: 8,
    },
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstRender = useRef(true);

  // Reset a página 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (isFirstRender.current) {
          setInitialLoading(true);
          isFirstRender.current = false;
        }
        
        const resultado = await obtenerResumenDashboard(currentPage, 8, searchTerm);
        setData(resultado);
      } catch (err) {
        setError(err.message || 'Error al cargar el dashboard');
        console.error('Error cargando dashboard:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    cargarDatos();
  }, [currentPage, searchTerm]);

  const goToPage = (page) => {
    if (page >= 1 && page <= data.paginacion.totalPaginas) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  return { 
    data, 
    initialLoading, 
    error, 
    currentPage, 
    goToPage, 
    nextPage, 
    prevPage 
  };
}
