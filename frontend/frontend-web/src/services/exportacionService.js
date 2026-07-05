import { API_URL } from './apiClient';

const exportacionService = {
  obtenerTablas: async () => {
    const response = await fetch(`${API_URL}/api/exportar/tablas`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al obtener tablas');
    return data;
  },

  obtenerVistaPrevia: async (tabla) => {
    const response = await fetch(`${API_URL}/api/exportar/${tabla}/vista-previa`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al obtener vista previa');
    return data;
  },

  obtenerDatosTabla: async (tabla) => {
    const response = await fetch(`${API_URL}/api/exportar/${tabla}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || 'Error al obtener datos');
    return data;
  },

  descargarCSV: (datos, nombreTabla) => {
    if (!datos || datos.length === 0) return;

    const columnas = Object.keys(datos[0]);
    
    // Encabezados CSV
    let csv = columnas.join(',') + '\n';
    
    // Filas CSV (escapar comas y comillas)
    datos.forEach(fila => {
      const filaCSV = columnas.map(col => {
        let valor = fila[col];
        if (valor === null || valor === undefined) return '';
        valor = String(valor);
        // Escapar comillas dobles y envolver en comillas si contiene comas
        if (valor.includes(',') || valor.includes('"') || valor.includes('\n')) {
          valor = valor.replace(/"/g, '""');
          valor = `"${valor}"`;
        }
        return valor;
      });
      csv += filaCSV.join(',') + '\n';
    });

    // Descargar archivo
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nombreTabla}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  },

  descargarExcel: async (datos, nombreTabla) => {
    // Si está disponible, usamos la librería xlsx
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datos);
      XLSX.utils.book_append_sheet(wb, ws, nombreTabla);
      XLSX.writeFile(wb, `${nombreTabla}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      // Fallback a CSV si xlsx no está instalado
      console.warn('xlsx no disponible, descargando como CSV');
      exportacionService.descargarCSV(datos, nombreTabla);
    }
  }
};

export default exportacionService;