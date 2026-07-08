import { request } from './apiClient.js';

// Obtener todas las transacciones con filtros opcionales
export const obtenerTransacciones = async (filtros = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filtros.fecha_inicio) queryParams.append('fecha_inicio', filtros.fecha_inicio);
  if (filtros.fecha_fin) queryParams.append('fecha_fin', filtros.fecha_fin);
  if (filtros.tipo && filtros.tipo !== 'todos') queryParams.append('tipo', filtros.tipo);
  if (filtros.rubro && filtros.rubro !== 'todos') queryParams.append('rubro', filtros.rubro);
  if (filtros.id_familia) queryParams.append('id_familia', filtros.id_familia);

  return request(`/api/transacciones?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// Obtener métricas del mes actual
export const obtenerMetricas = async () => {
  return request('/api/transacciones/metricas', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};