import React, { useState, useEffect } from 'react';
import logoIllapel from './assets/logoillapel.png';

function App() {
  const [status, setStatus] = useState('Desconectado');
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(false);

  const chequearConexion = async () => {
    try {
      const res = await fetch('http://localhost:3000/health');
      const data = await res.json();
      // Si el backend se conectó a PostgreSQL, dirá OK. Si no, dirá ERROR.
      setStatus(data.status === 'OK' ? 'Conectado' : 'Error BD');
    } catch (err) {
      setStatus('Servidor Apagado');
    }
  };

  const cargarFamilias = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/familias');
      const data = await res.json();
      
      // SALVAVIDAS ANTI-CRASH: Verificamos que la respuesta sea realmente una lista
      if (Array.isArray(data)) {
        setFamilias(data);
      } else {
        setFamilias([]); 
        alert("Error: El backend no pudo consultar la base de datos.");
      }
    } catch (err) {
      console.error("Error al cargar:", err);
    }
    setLoading(false);
  };

  const crearFamiliaPrueba = async () => {
    const nuevaFamilia = {
      rut_representante: `${Math.floor(Math.random() * 20000000)}-${Math.floor(Math.random() * 9)}`,
      nombre_familia: "Familia " + (familias.length + 1),
      clave_acceso: "1234"
    };

    try {
      const res = await fetch('http://localhost:3000/api/familias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaFamilia)
      });
      const data = await res.json();
      
      if (data.status === 'Éxito') {
        cargarFamilias(); 
      } else {
        alert("Error del servidor: " + data.mensaje);
      }
    } catch (err) {
      alert("No se pudo contactar al servidor.");
    }
  };

  useEffect(() => {
    chequearConexion();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-sm">
      
      {/* 1. Header Arreglado (Logo más pequeño) */}
      <header className="bg-white flex justify-between items-center px-6 py-2 border-b border-gray-200">
        <div className="flex items-center">
          <img 
            src={logoIllapel} 
            alt="Logo Municipalidad" 
            style={{ maxHeight: '70px', width: 'auto' }} // Altura máxima forzada
            className="object-contain" 
          />
        </div>
        <div className="text-right text-xs text-gray-600 uppercase">
          <p className="font-bold">JORGE MALAVE ROMERO</p>
          <p>Encargado Unidad de Informática / SECPLAN</p>
          <div className="mt-1 flex justify-end items-center gap-2">
            <span>Estado DB:</span>
            <span className={`px-2 py-0.5 rounded text-white font-bold ${status === 'Conectado' ? 'bg-green-600' : 'bg-red-600'}`}>
              {status}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Barra Azul Arreglada (Más alta, botones transparentes) */}
      <nav className="bg-[#2c5282] text-white flex px-6 py-3 shadow-md gap-2 items-center">
        <button className="px-4 py-1 rounded bg-transparent hover:bg-[#1a365d] transition">Inicio</button>
        <button className="px-4 py-1 rounded bg-transparent hover:bg-[#1a365d] transition">Ceropapel</button>
        <button className="px-4 py-1 rounded bg-transparent hover:bg-[#1a365d] transition">Abastecimiento</button>
        <button className="px-4 py-1 rounded bg-[#1a365d] font-semibold border border-[#1a365d] shadow-inner">Illapel Te Ayuda</button>
        <button className="px-4 py-1 rounded bg-transparent hover:bg-[#1a365d] transition">Opciones</button>
      </nav>

      {/* 3. Área de Trabajo */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 border-b border-gray-300 pb-2 flex justify-between items-end">
          <div>
            <h1 className="text-xl text-[#333] font-normal">Panel de Control: Billetera Digital Municipal</h1>
            <p className="text-xs text-gray-500 mt-1">En esta sección se gestionan los saldos y transacciones de las familias beneficiarias.</p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={chequearConexion} className="border border-gray-300 bg-white text-gray-700 px-3 py-1 text-xs hover:bg-gray-50 rounded">
              Verificar Conexión
            </button>
            <button onClick={crearFamiliaPrueba} className="border border-[#2c5282] bg-white text-[#2c5282] px-3 py-1 text-xs font-semibold hover:bg-[#ebf8ff] rounded">
              + Nueva Familia
            </button>
            <button onClick={cargarFamilias} className="bg-[#2c5282] text-white px-3 py-1 text-xs hover:bg-[#1a365d] rounded shadow">
              Actualizar Tabla
            </button>
          </div>
        </div>

        {/* Tabla de Datos */}
        <div className="bg-white border border-gray-300 shadow-sm rounded overflow-hidden">
          <div className="grid grid-cols-5 bg-[#4a5568] text-white text-xs font-semibold py-2 px-4 uppercase">
            <div className="col-span-1">ID / Expediente</div>
            <div className="col-span-2">Nombre de la Familia</div>
            <div className="col-span-1">RUT Representante</div>
            <div className="col-span-1 text-right">Saldo Actual</div>
          </div>
          
          <div className="divide-y divide-gray-200 min-h-[200px]">
             {loading ? (
              <p className="text-center py-8 text-gray-500 text-sm">Cargando registros...</p>
            ) : familias.length === 0 ? (
              <p className="text-center py-8 text-gray-500 text-sm italic">Mostrando 0 registros. Utilice el botón "+ Nueva Familia".</p>
            ) : (
              familias.map((f, index) => (
                <div key={f.id_familia} className={`grid grid-cols-5 text-xs py-3 px-4 items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}>
                  <div className="col-span-1 text-gray-600">{f.id_familia} / 2026</div>
                  <div className="col-span-2 font-medium text-gray-800">{f.nombre_familia}</div>
                  <div className="col-span-1 text-gray-600">{f.rut_representante}</div>
                  <div className="col-span-1 text-right font-bold text-[#2c5282]">${f.saldo}</div>
                </div>
              ))
            )}
          </div>
          
          <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 flex justify-between items-center border-t border-gray-300">
            <span>Mostrando registros del 1 al {familias.length} de un total de {familias.length} registros</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;