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
  
  // Nueva función para liquidar el saldo del comercio
  liquidarFondos: async (rut, formData) => {
    // 1. Obtenemos el token de seguridad
    const tokenStr = localStorage.getItem('illapel_token');
    const token = tokenStr ? JSON.parse(tokenStr).token : '';
    
    // 2. Obtenemos la URL base
    const baseUrl = import.meta.env.VITE_API_URL || 'https://proyectoillapel.onrender.com/api';

    // 3. Hacemos la petición nativa
    const response = await fetch(`${baseUrl}/comercios/${rut}/liquidar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // IMPORTANTE: Cuando enviamos formData, NO debemos poner 'Content-Type'. 
        // El navegador lo configura automáticamente como 'multipart/form-data'.
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || 'Error al procesar la liquidación en el servidor');
    }

    return await response.json();
  }
    
};

export default comerciosService;