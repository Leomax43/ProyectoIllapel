import { request } from './apiClient';

const adminService = {
  registrarFuncionario: async (adminData) => {
    // Al usar request, el API_URL y el manejo de errores se hacen solos
    return request('/api/admin/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
  }
};

export default adminService;