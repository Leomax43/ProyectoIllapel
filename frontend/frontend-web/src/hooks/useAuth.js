import { useCallback, useEffect, useState } from 'react';
import { loginApi } from '../services/authService.js';

const TOKEN_KEY = 'illapel_token';
const USER_KEY = 'illapel_user';

export function useAuth() {
  // Verificación inicial un poco más estricta (evita strings vacíos o raros)
  const [isAuthenticated, setAuthenticated] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token && token !== 'undefined' && token !== 'null';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Escuchar cambios en localStorage (sincronización multi-pestaña)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      setAuthenticated(!!token && token !== 'undefined' && token !== 'null');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async ({ rut, clave }) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await loginApi({ rut, clave });

      if (resp?.status !== 'Éxito' || !resp?.usuario) {
        throw new Error(resp?.mensaje || 'Respuesta inválida del servidor');
      }

      // Guardamos la sesión de forma estructurada
      localStorage.setItem(TOKEN_KEY, JSON.stringify(resp.usuario));
      localStorage.setItem(USER_KEY, JSON.stringify(resp.usuario));
      localStorage.setItem('adminName', resp.usuario.nombre_completo || 'Usuario');
      localStorage.setItem('adminRol', resp.usuario.rol || 'Admin');
      
      setAuthenticated(true);
    } catch (err) {
      setError(err?.message || 'No se pudo autenticar');
      setAuthenticated(false);
      
      // Limpieza preventiva por seguridad ante credenciales inválidas o expiradas
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRol');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRol');
    
    setError(null); // Limpiamos errores previos al cerrar sesión
    setAuthenticated(false);
    
    // Forzamos el evento para actualizar inmediatamente el estado de la pestaña actual
    window.dispatchEvent(new Event('storage'));
  }, []);

  return { isAuthenticated, login, logout, loading, error };
}