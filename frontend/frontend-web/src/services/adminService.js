// Antes:
// const API_URL = 'http://localhost:3000/api/admin'; 

// Ahora:
import { API_URL } from './apiClient'; // Importa la variable de apiClient.js



const adminService = {
  registrarFuncionario: async (adminData) => {
    try {
      const response = await fetch(`${API_URL}/admin/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Aquí en el futuro enviarías el Token JWT en el 'Authorization' para seguridad
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || 'Error al registrar funcionario');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default adminService;