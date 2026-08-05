// src/config/api.js

// === LOCAL (para pruebas con Expo Go en el mismo Wi-Fi) ===
// 1. Cambia LOCAL_IP a la IP actual de tu PC (ipconfig).
// 2. La app móvil debe estar en la misma red que el backend.
const LOCAL_IP = '192.168.1.96';
const PORT = '3000';
export const API_URL = `http://${LOCAL_IP}:${PORT}/api`;

// === PRODUCCIÓN (Vercel/Render) ===
// Para volver a producción, comenta la sección LOCAL y descomenta esta línea:
// export const API_URL = 'https://proyectoillapel.onrender.com/api';