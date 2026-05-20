import { request } from './apiClient.js';

export async function listFamilias() {
  const data = await request('/api/familias');
  if (!Array.isArray(data)) {
    const error = new Error('Respuesta inválida del servidor al listar familias.');
    error.payload = data;
    throw error;
  }
  return data;
}

export async function createFamilia(payload) {
  const data = await request('/api/familias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (data?.status && data.status !== 'Éxito') {
    const error = new Error(data.mensaje || 'Error del servidor al crear la familia.');
    error.payload = data;
    throw error;
  }

  return data;
}
