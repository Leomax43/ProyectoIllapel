import { useState, useEffect } from 'react';
import { obtenerResumenDashboard } from '../services/dashboardService.js';

export function useDashboard() {
  const [data, setData] = useState({
    indicadores: {
      beneficiariosActivos: 0,
      solicitudesPendientes: 0,
      comerciosRegistrados: 0,
      fondosCargadosTotales: 0,
    },
    ultimosRegistros: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const resultado = await obtenerResumenDashboard();
        setData(resultado);
      } catch (err) {
        setError(err.message || 'Error al cargar el dashboard');
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return { data, loading, error };
}
