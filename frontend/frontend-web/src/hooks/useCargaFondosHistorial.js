import { useState, useEffect } from 'react';
import fondosService from '../services/fondosService';
import beneficiariesService from '../services/beneficiariesService';

export const useCargaFondosHistorial = () => {
  const [cargas, setCargas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarga, setSelectedCarga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado local para las métricas dinámicas
  const [metricas, setMetricas] = useState({
    cargasEsteMes: 0,
    totalDistribuidoMes: 0,
    beneficiariosUnicosMes: 0,
    cargasBloqueadas: 0,
    beneficiariosHabilitados: 0,
    nombreMesAño: ''
  });

  useEffect(() => {
    const fetchDatosYCalcularMetricas = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener cargas e historial unificado
        const dataCargas = await fondosService.obtenerTodasLasCargas();
        setCargas(dataCargas);
        if (dataCargas.length > 0 && !selectedCarga) {
          setSelectedCarga(dataCargas[0]);
        }

        // 2. Obtener estadísticas globales de beneficiarios (desde su respectivo servicio)
        let activosCount = 0;
        try {
          const statsBeneficiarios = await beneficiariesService.getBeneficiariesStats();
          activosCount = statsBeneficiarios?.datos?.activos || 0;
        } catch (errStats) {
          console.error('⚠️ No se pudieron obtener estadísticas globales de beneficiarios:', errStats);
        }

        // 3. Procesar cálculos basados en fechas y estados reales
        const ahora = new Date();
        const mesActual = ahora.getMonth(); // 0 = Enero, 4 = Mayo, etc.
        const añoActual = ahora.getFullYear();

        // Formato para el label inferior de las cards (ej: "junio 2026")
        const nombreMesAño = ahora.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

        // Filtrar cargas correspondientes al mes y año en curso
        const cargasDelMes = dataCargas.filter(carga => {
          const fechaCarga = new Date(carga.fecha);
          return fechaCarga.getMonth() === mesActual && fechaCarga.getFullYear() === añoActual;
        });

        // Sumatoria del monto total distribuido en el mes
        const totalDistribuidoMes = cargasDelMes.reduce((sum, carga) => sum + (parseInt(carga.monto) || 0), 0);

        // Contar beneficiarios únicos que recibieron fondos en el mes
        const rutsUnicosMes = new Set(cargasDelMes.map(carga => carga.rut_principal));
        const beneficiariosUnicosMes = rutsUnicosMes.size;

        // Cargas rechazadas o bloqueadas (según estados del modelo de base de datos)
        // Revisamos si en la base de datos están bajo la regla o marcadas como 'RECHAZADO' o 'BLOQUEADO'
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
      carga.nombre_familia?.toLowerCase().includes(searchLower) ||
      carga.rut_principal?.toLowerCase().includes(searchLower) ||
      carga.motivo?.toLowerCase().includes(searchLower)
    );
  });

  return {
    cargas,
    cargasFiltradas,
    searchTerm,
    setSearchTerm,
    selectedCarga,
    setSelectedCarga,
    loading,
    error,
    metricas
  };
};