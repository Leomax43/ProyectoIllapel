import { API_URL } from './apiClient';

const comerciosService = {
  obtenerComercios: async () => {
    const response = await fetch(`${API_URL}/api/comercios`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al obtener comercios');
    return data.comercios || data.datos || data;
  },

  obtenerComercioDetalle: async (rut) => {
    const response = await fetch(`${API_URL}/api/comercios/${rut}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al obtener detalle');
    return data.comercio || data.datos || data;
  },

  crearComercio: async (comercioData) => {
    const response = await fetch(`${API_URL}/api/comercios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comercioData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al crear comercio');
    return data;
  },

  actualizarComercio: async (rut, comercioData) => {
    const response = await fetch(`${API_URL}/api/comercios/${rut}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comercioData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al actualizar comercio');
    return data;
  },

  cambiarEstado: async (rut, nuevoEstado) => {
    const response = await fetch(`${API_URL}/api/comercios/${rut}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevo_estado: nuevoEstado }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al cambiar estado');
    return data;
  },
};

export default comerciosService;