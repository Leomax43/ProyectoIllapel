


// Obtener todas las transacciones con filtros opcionales

export const obtenerTransacciones = async (filtros = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filtros.fecha_inicio) queryParams.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) queryParams.append('fecha_fin', filtros.fecha_fin);
    if (filtros.tipo && filtros.tipo !== 'todos') queryParams.append('tipo', filtros.tipo);
    if (filtros.rut_comercio && filtros.rut_comercio !== 'todos') queryParams.append('rut_comercio', filtros.rut_comercio);
    if (filtros.id_familia) queryParams.append('id_familia', filtros.id_familia);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/transacciones?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    throw error;
  }
};

// Obtener métricas del mes actual
export const obtenerMetricas = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/transacciones/metricas`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo métricas:', error);
    throw error;
  }
};
