import { request } from './apiClient';

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
  },
  obtenerTodasLasCargas: async () => {
    try {
      const response = await request('/api/familias', {
        method: 'GET'
      });
      console.log('📦 Familias obtenidas:', response);
      
      // Para cada familia, obtener su detalle con historial
      let todasLasCargas = [];
      if (response.familias && Array.isArray(response.familias)) {
        for (const familia of response.familias) {
          try {
            // Obtener detalle de la familia con historial usando rut_representante
            const detalleResponse = await request(`/api/familias/${familia.rut_representante}`, {
              method: 'GET'
            });
            
            console.log('📋 Respuesta detalle:', detalleResponse);
            
            // historial_cargas está en el nivel raíz de la respuesta
            if (detalleResponse.historial_cargas && Array.isArray(detalleResponse.historial_cargas)) {
              const cargasConNombreFamilia = detalleResponse.historial_cargas.map(carga => ({
                id_carga: carga.id_carga,
                fecha: carga.fecha,
                monto: carga.monto,
                motivo: carga.motivo,
                detalles: carga.detalles,
                pdf_resolucion: carga.pdf_resolucion,
                nombre_familia: familia.nombre_familia,
                rut_principal: familia.rut_representante,
                saldo: familia.saldo,
                estado: carga.estado
              }));
              todasLasCargas = [...todasLasCargas, ...cargasConNombreFamilia];
            }
          } catch (err) {
            console.warn(`⚠️ Error obteniendo detalle de familia ${familia.rut_representante}:`, err.message);
          }
        }
      }
      
      // Ordenar por fecha descendente
      todasLasCargas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      console.log('✅ Total de cargas compiladas:', todasLasCargas.length);
      return todasLasCargas;
    } catch (error) {
      console.error('Error obteniendo cargas:', error);
      console.error('Status error:', error.status);
      console.error('Payload error:', error.payload);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/fondos/${id_familia}/cargar`, {
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
