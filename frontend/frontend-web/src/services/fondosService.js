import { request } from './apiClient';

const fondosService = {
  // Cargar fondos a una familia
  cargarFondos: async (id_familia, id_admin, monto, archivo = null) => {
    try {
      const formData = new FormData();
      formData.append('id_admin', id_admin);
      formData.append('monto', monto);
      
      if (archivo) {
        formData.append('archivo', archivo);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/fondos/cargar/${id_familia}`, {
        method: 'POST',
        body: formData
        // NO incluir Content-Type - el navegador lo establece automáticamente con boundary
      });

      const payload = await response.json();

      if (!response.ok) {
        const message = payload?.mensaje || payload?.message || 'Error al cargar fondos';
        throw new Error(message);
      }

      return payload;
    } catch (error) {
      console.error('Error cargando fondos:', error);
      throw error;
    }
  }
};

export default fondosService;
