import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('Desconectado');
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Probar conexión con el Backend (Health Check)
  const chequearConexion = async () => {
    try {
      const res = await fetch('http://localhost:3000/health');
      const data = await res.json();
      setStatus(data.status === 'OK' ? 'Conectado ✅' : 'Error ❌');
    } catch (err) {
      setStatus('Servidor Apagado 🔴');
    }
  };

  // 2. Obtener lista de familias desde la DB
  const cargarFamilias = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/familias');
      const data = await res.json();
      setFamilias(data);
    } catch (err) {
      console.error("Error al cargar:", err);
    }
    setLoading(false);
  };

  // 3. Crear una familia de prueba rápidamente
  const crearFamiliaPrueba = async () => {
    const nuevaFamilia = {
      rut_representante: `${Math.floor(Math.random() * 20000000)}-${Math.floor(Math.random() * 9)}`,
      nombre_familia: "Familia " + (familias.length + 1),
      clave_acceso: "1234"
    };

    try {
      await fetch('http://localhost:3000/api/familias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaFamilia)
      });
      cargarFamilias(); // Recargar la lista automáticamente
    } catch (err) {
      alert("Error al crear familia");
    }
  };

  useEffect(() => {
    chequearConexion();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <header className="bg-white shadow-md rounded-lg p-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">Illapel Te Ayuda</h1>
            <p className="text-gray-500 text-lg">Panel de Control - Hito Intermedio</p>
          </div>
          <div className="text-right">
            <span className="block text-sm text-gray-400">Estado del Backend</span>
            <span className={`font-bold text-lg ${status.includes('Conectado') ? 'text-green-500' : 'text-red-500'}`}>
              {status}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda: Acciones */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-bottom pb-2">Acciones del Sistema</h2>
            <div className="space-y-4">
              <button 
                onClick={chequearConexion}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition text-lg"
              >
                🔄 Verificar Servidor
              </button>
              <button 
                onClick={crearFamiliaPrueba}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition text-lg"
              >
                ➕ Registrar Familia de Prueba
              </button>
              <button 
                onClick={cargarFamilias}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded transition text-lg"
              >
                📋 Cargar Datos desde DB
              </button>
            </div>
          </div>

          {/* Columna Derecha: Datos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-bottom pb-2">Datos en PostgreSQL</h2>
            {loading ? (
              <p className="text-center py-10">Cargando...</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {familias.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-10">No hay familias registradas aún.</p>
                ) : (
                  familias.map((f) => (
                    <li key={f.id_familia} className="py-4 flex justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{f.nombre_familia}</p>
                        <p className="text-sm text-gray-500">RUT: {f.rut_representante}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-indigo-600 font-bold">${f.saldo}</p>
                        <p className="text-xs text-gray-400">ID: {f.id_familia}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;