import { request } from './apiClient.js';

const solicitudesService = {
  // Crear nueva familia/solicitud
  crearFamilia: async (familiaData) => {
    try {
      const data = await request('/api/familias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familiaData)
      });
      return data;
    } catch (error) {
      console.error('Error creating familia:', error);
      throw error;
    }
  },

  // Agregar integrante a una familia
  agregarIntegrante: async (id_familia, integranteData) => {
    try {
      const data = await request(`/api/integrantes/familia/${id_familia}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integranteData)
      });
      return data;
    } catch (error) {
      console.error('Error adding integrante:', error);
      throw error;
    }
  },

  // Subir ficha social en PDF
  subirFichaSocial: async (id_familia, archivo) => {
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);

      const data = await request(`/api/familias/${id_familia}/ficha-social`, {
        method: 'POST',
        body: formData
      });
      return data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }
};

export default solicitudesService;
