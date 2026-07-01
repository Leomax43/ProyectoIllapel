import { request } from './apiClient';

const beneficiariesService = {
  // Obtener lista de beneficiarios con paginación, búsqueda y filtros
  getBeneficiaries: async (page = 1, limit = 8, search = '', estado = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search) params.append('search', search);
      if (estado) params.append('estado', estado);

      const data = await request(`/api/familias?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      throw error;
    }
  },

  // Búsqueda rápida de beneficiarios (devuelve lista sin paginación)
  search: async (searchTerm) => {
    try {
      const params = new URLSearchParams();
      params.append('search', searchTerm);
      params.append('limit', 50);

      const data = await request(`/api/familias?${params.toString()}`);
      return data.familias || [];
    } catch (error) {
      console.error('Error searching beneficiaries:', error);
      throw error;
    }
  },

  // Obtener estadísticas de beneficiarios (pills)
  getBeneficiariesStats: async () => {
    try {
      const data = await request('/api/familias/stats/beneficiarios');
      return data;
    } catch (error) {
      console.error('Error fetching beneficiaries stats:', error);
      throw error;
    }
  },

  // Obtener detalle completo de un beneficiario
  getBeneficiaryDetail: async (rut) => {
    try {
      const data = await request(`/api/familias/${rut}`);
      return data;
    } catch (error) {
      console.error('Error fetching beneficiary detail:', error);
      throw error;
    }
  },

  updateBeneficiary: async (rut, payload) => {
    try {
      const data = await request(`/api/familias/${rut}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return data;
    } catch (error) {
      console.error('Error updating beneficiary:', error);
      throw error;
    }
  }
};

export default beneficiariesService;
