import { API_URL } from './apiClient';

const familiasService = {
  obtenerFamilias: async () => {
    const response = await fetch(`${API_URL}/api/familias`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al obtener familias');
    return data;
  },

  cambiarEstado: async (id_familia, nuevoEstado) => {
    const response = await fetch(`${API_URL}/api/aprobaciones/familia/${id_familia}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevo_estado: nuevoEstado }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al cambiar estado');
    return data;
  },
};

export default familiasService;