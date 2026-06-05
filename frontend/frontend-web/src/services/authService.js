import { request } from './apiClient.js';

export async function loginApi({ rut, clave }) {
  return request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rut, clave }),
  });
}
