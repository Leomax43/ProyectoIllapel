import { API_URL } from './apiClient';

const subrogacionService = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_URL}/api/subrogaciones`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al obtener subrogaciones');
    return data;
  },

  obtenerAdministradores: async () => {
    const response = await fetch(`${API_URL}/api/admin`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al obtener administradores');
    return data;
  },

  crear: async (subrogacionData) => {
    const response = await fetch(`${API_URL}/api/subrogaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subrogacionData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al crear subrogación');
    return data;
  },

  finalizar: async (id_subrogacion, id_super_admin) => {
    const response = await fetch(`${API_URL}/api/subrogaciones/${id_subrogacion}/finalizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_super_admin }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al finalizar subrogación');
    return data;
  },
};

export default subrogacionService;