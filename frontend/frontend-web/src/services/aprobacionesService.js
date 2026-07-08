import { request, API_URL } from './apiClient';

const aprobacionesService = {
  obtenerPendientes: async () => {
    return request('/api/aprobaciones/fondos/pendientes');
  },

  aprobarSolicitud: async (idCarga, idJefatura) => {
    return request(`/api/aprobaciones/fondos/${idCarga}/aprobar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_jefatura: idJefatura }),
    });
  },

  rechazarSolicitud: async (idCarga, idJefatura) => {
    return request(`/api/aprobaciones/fondos/${idCarga}/rechazar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_jefatura: idJefatura }),
    });
  },

  obtenerUrlPdf: (rutaArchivo) => {
    const BASE_URL = API_URL.replace('/api', '');
    return `${BASE_URL}${rutaArchivo}`;
  }
};

export default aprobacionesService;