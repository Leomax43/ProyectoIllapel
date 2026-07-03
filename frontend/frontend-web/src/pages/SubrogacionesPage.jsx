import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import { useAuth } from '../hooks/useAuth';
import subrogacionService from '../services/subrogacionService';

const ROLES = ['SUPER_ADMIN', 'JEFATURA', 'ASISTENTE_SOCIAL', 'ENCARGADO_COMERCIOS'];

const SubrogacionesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [administradores, setAdministradores] = useState([]);
  const [subrogaciones, setSubrogaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    rol_asignado: '',
    fecha_inicio: '',
    fecha_fin: '',
    motivo: '',
  });
  const [mensaje, setMensaje] = useState(null);

  const idSuperAdmin = JSON.parse(localStorage.getItem('illapel_user') || '{}').id_admin;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [adminsRes, subroRes] = await Promise.all([
        subrogacionService.obtenerAdministradores(),
        subrogacionService.obtenerTodos(),
      ]);
      console.log('Admins response:', adminsRes);
      console.log('Subrogaciones response:', subroRes);
      
      // El endpoint GET /api/admin devuelve { administradores: [...] }
      const admins = Array.isArray(adminsRes) ? adminsRes : (adminsRes.administradores || []);
      const subros = Array.isArray(subroRes) ? subroRes : (subroRes.subrogaciones || []);
      
      setAdministradores(admins);
      setSubrogaciones(subros);
      
      if (admins.length === 0) {
        setMensaje({ tipo: 'error', texto: 'No se encontraron administradores. Verifica que el backend esté funcionando.' });
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setMensaje({ tipo: 'error', texto: `Error al cargar: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const administradoresFiltrados = administradores.filter(admin => {
    const matchRol = !filtroRol || admin.rol === filtroRol;
    const matchBusqueda = !busqueda || 
      admin.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      admin.rut?.toLowerCase().includes(busqueda.toLowerCase());
    return matchRol && matchBusqueda;
  });

  const handleSeleccionar = (admin) => {
    setSelectedAdmin(admin);
    setFormData({ rol_asignado: '', fecha_inicio: '', fecha_fin: '', motivo: '' });
    setShowModal(true);
  };

  const handleCrearSubrogacion = async () => {
    if (!formData.rol_asignado || !formData.fecha_inicio || !formData.fecha_fin) {
      setMensaje({ tipo: 'error', texto: 'Completa todos los campos obligatorios' });
      return;
    }

    try {
      await subrogacionService.crear({
        id_admin_subrogado: selectedAdmin.id_admin,
        rol_asignado: formData.rol_asignado,
        fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
        fecha_fin: new Date(formData.fecha_fin).toISOString(),
        motivo: formData.motivo,
        id_super_admin: idSuperAdmin,
      });
      setMensaje({ tipo: 'exito', texto: `Subrogación creada para ${selectedAdmin.nombre_completo}` });
      setShowModal(false);
      setSelectedAdmin(null);
      cargarDatos();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  };

  const handleFinalizar = async (id_subrogacion) => {
    if (!confirm('¿Estás seguro de finalizar esta subrogación? Se restaurará el rol original.')) return;
    try {
      await subrogacionService.finalizar(id_subrogacion, idSuperAdmin);
      setMensaje({ tipo: 'exito', texto: 'Subrogación finalizada correctamente' });
      cargarDatos();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-CL');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gris-bg">
        <DashboardHeader currentPage="subrogaciones" onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="p-[20px] text-center text-gris-claro">Cargando...</div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      <DashboardHeader currentPage="subrogaciones" onLogout={logout} />
      <div className="p-[18px_20px] flex-1 max-w-[1200px] mx-auto w-full">
        <h1 className="text-[18px] font-bold text-azul mb-[16px]">Gestión de Subrogaciones</h1>

      {/* Mensaje de feedback */}
      {mensaje && (
        <div className={`p-[10px] mb-[12px] rounded-[4px] text-[12px] font-bold ${
          mensaje.tipo === 'exito' ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]' : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
        }`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)} className="float-right font-bold cursor-pointer bg-transparent border-none">×</button>
        </div>
      )}

      {/* FILTROS */}
      <div className="flex gap-[10px] mb-[16px] items-center">
        <input
          type="text"
          placeholder="Buscar por nombre o RUT..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gris-borde rounded-[4px] px-[10px] py-[6px] text-[12px] flex-1"
        />
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="border border-gris-borde rounded-[4px] px-[10px] py-[6px] text-[12px]"
        >
          <option value="">Todos los roles</option>
          {ROLES.map(rol => (
            <option key={rol} value={rol}>{rol.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* LISTA DE ADMINISTRADORES */}
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden mb-[20px]">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
          Administradores del sistema
        </div>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Nombre</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">RUT</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Rol actual</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Estado</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-center border border-gris-borde font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {administradoresFiltrados.map(admin => (
              <tr key={admin.id_admin}>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{admin.nombre_completo}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{admin.rut}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{admin.rol}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0]">
                  <span className={`inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${
                    admin.estado === 'ACTIVO'
                      ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]'
                      : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
                  }`}>{admin.estado}</span>
                </td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-center">
                  <button
                    onClick={() => handleSeleccionar(admin)}
                    className="bg-azul text-white border-none rounded-[3px] px-[10px] py-[4px] text-[11px] cursor-pointer font-bold hover:brightness-110"
                  >
                    Subrogar
                  </button>
                </td>
              </tr>
            ))}
            {administradoresFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="px-[8px] py-[8px] text-gris-claro text-center">Sin resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SUBROGACIONES ACTIVAS */}
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
          Subrogaciones activas e históricas
        </div>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Subrogado</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Rol original</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Rol asignado</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Inicio</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Fin</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Estado</th>
              <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-center border border-gris-borde font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {subrogaciones.map(sub => (
              <tr key={sub.id_subrogacion}>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{sub.nombre_subrogado}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{sub.rol_original}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{sub.rol_asignado}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{formatDate(sub.fecha_inicio)}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{formatDate(sub.fecha_fin)}</td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0]">
                  <span className={`inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${
                    sub.estado === 'ACTIVO'
                      ? 'bg-[#fff8e0] text-[#a07800] border border-[#f0d970]'
                      : 'bg-[#e6f7f4] text-verde border border-[#b2e8de]'
                  }`}>{sub.estado}</span>
                </td>
                <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-center">
                  {sub.estado === 'ACTIVO' && (
                    <button
                      onClick={() => handleFinalizar(sub.id_subrogacion)}
                      className="bg-[#b52b2b] text-white border-none rounded-[3px] px-[10px] py-[4px] text-[11px] cursor-pointer font-bold hover:brightness-110"
                    >
                      Finalizar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {subrogaciones.length === 0 && (
              <tr>
                <td colSpan="7" className="px-[8px] py-[8px] text-gris-claro text-center">Sin subrogaciones registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      </div>
      <DashboardFooter />

      {/* MODAL CREAR SUBROGACIÓN */}
      {showModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[8px] p-[20px] w-[450px] max-w-[90%] shadow-lg">
            <h2 className="text-[15px] font-bold text-azul mb-[12px]">
              Subrogar a: {selectedAdmin.nombre_completo}
            </h2>
            <p className="text-[11px] text-gris-claro mb-[12px]">
              Rol actual: <strong>{selectedAdmin.rol}</strong>
            </p>

            <div className="mb-[10px]">
              <label className="text-[11px] text-gris-claro block mb-[3px]">Rol a asignar *</label>
              <select
                value={formData.rol_asignado}
                onChange={(e) => setFormData({...formData, rol_asignado: e.target.value})}
                className="w-full border border-gris-borde rounded-[4px] px-[10px] py-[6px] text-[12px]"
              >
                <option value="">Seleccionar rol...</option>
                {ROLES.filter(r => r !== selectedAdmin.rol).map(rol => (
                  <option key={rol} value={rol}>{rol.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-[10px] mb-[10px]">
              <div className="flex-1">
                <label className="text-[11px] text-gris-claro block mb-[3px]">Fecha inicio *</label>
                <input
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                  className="w-full border border-gris-borde rounded-[4px] px-[10px] py-[6px] text-[12px]"
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-gris-claro block mb-[3px]">Fecha fin *</label>
                <input
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                  className="w-full border border-gris-borde rounded-[4px] px-[10px] py-[6px] text-[12px]"
                />
              </div>
            </div>

            <div className="mb-[14px]">
              <label className="text-[11px] text-gris-claro block mb-[3px]">Motivo</label>
              <textarea
                value={formData.motivo}
                onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                className="w-full border border-gris-borde rounded-[4px] px-[10px] py-[6px] text-[12px]"
                rows="3"
                placeholder="Ej: Licencia médica de la Jefatura..."
              />
            </div>

            <div className="flex justify-end gap-[8px]">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gris-claro text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearSubrogacion}
                className="bg-azul text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
              >
                Crear Subrogación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubrogacionesPage;