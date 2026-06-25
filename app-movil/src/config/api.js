// src/config/api.js

// 1. Aquí pones la IP de tu PC actual. 
// Cuando cambies de red o de PC, ¡solo modificas esta línea!
const LOCAL_IP = '172.20.10.14'; 
const PORT = '3000'; // El puerto donde corre tu backend de Express

// 2. Exportamos la URL base completa
export const API_URL = `http://${LOCAL_IP}:${PORT}/api`;



