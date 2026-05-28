import { request } from './apiClient';

const comerciosService = {
  // Obtener todos los comercios
  getComercios: async () => {
    try {
      const data = await request('/api/comercios', {
        method: 'GET'
      });
      return data;
    } catch (error) {
      console.error('Error fetching comercios:', error);
      throw error;
    }
  },

  // Obtener detalle de un comercio específico
  getComercioDetalle: async (rut) => {
    try {
      const data = await request(`/api/comercios/${rut}`, {
        method: 'GET'
      });
      return data;
    } catch (error) {
      console.error('Error fetching comercio detail:', error);
      throw error;
    }
  },

  // Crear un nuevo comercio
  crearComercio: async (comercioData) => {
    try {
      const data = await request('/api/comercios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comercioData)
      });
      return data;
    } catch (error) {
      console.error('Error creating comercio:', error);
      throw error;
    }
  },

  // Cambiar estado de un comercio
  cambiarEstadoComercio: async (rut, nuevoEstado) => {
    try {
      const data = await request(`/api/comercios/${rut}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado: nuevoEstado })
      });
      return data;
    } catch (error) {
      console.error('Error changing comercio status:', error);
      throw error;
    }
  }
};

export default comerciosService;
