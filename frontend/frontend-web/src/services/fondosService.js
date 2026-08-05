import { request, API_URL } from './apiClient.js';



const fondosService = {
  // Cargar fondos a una familia
  cargarFondos: async (id_familia, id_admin, monto, motivo = null, observaciones = null, archivo = null) => {
    try {
      const formData = new FormData();
      formData.append('id_admin', id_admin);
      formData.append('monto', monto);
      if (motivo) {
        formData.append('motivo', motivo);
      }
      if (observaciones) {
        formData.append('observaciones', observaciones);
      }
      
      if (archivo) {
        formData.append('archivo', archivo);
      }

      const response = await fetch(`${API_URL}/api/fondos/cargar/${id_familia}`, {
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
  },
  obtenerCargas: async ({ page = 1, limit = 8, search = '', estado = 'TODOS' } = {}) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) {
        params.set('search', search);
      }
      if (estado && estado !== 'TODOS') {
        params.set('estado', estado);
      }

      const response = await request(`/api/fondos?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo cargas:', error);
      throw error;
    }
  },
  solicitarCargaFondos: async (id_familia, id_admin, monto, motivo, observaciones, pdfFile) => {
    try {
      const formData = new FormData();
      formData.append('id_admin', id_admin);
      formData.append('monto', monto);
      formData.append('motivo', motivo);
      formData.append('observaciones', observaciones || 'N/A');
      
      if (pdfFile) {
        formData.append('pdf_resolucion', pdfFile); // Clave exacta esperada por tu backend
      }

      // URL con el orden correcto id_familia antes de /cargar
      const response = await fetch(`${API_URL}/api/fondos/${id_familia}/cargar`, {
        method: 'POST',
        body: formData
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.mensaje || payload?.message || 'Error al procesar la solicitud.');
      }

      return payload;
    } catch (error) {
      console.error('Error en solicitarCargaFondos:', error);
      throw error;
    }
  }
};

export default fondosService;
