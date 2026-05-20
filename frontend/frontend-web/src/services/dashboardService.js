import { request } from './apiClient.js';

export async function obtenerResumenDashboard(page = 1, limit = 8, search = '') {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  return request(`/api/dashboard/resumen?page=${page}&limit=${limit}${searchParam}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}
