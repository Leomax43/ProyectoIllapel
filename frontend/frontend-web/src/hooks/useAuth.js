import { useCallback, useEffect, useState } from 'react';
import { loginApi } from '../services/authService.js';

const TOKEN_KEY = 'illapel_token';
const USER_KEY = 'illapel_user';

export function useAuth() {
  const [isAuthenticated, setAuthenticated] = useState(() => !!localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Escuchar cambios en localStorage (para sincronizar entre pestañas y componentes)
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(!!localStorage.getItem(TOKEN_KEY));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async ({ rut, clave }) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await loginApi({ rut, clave });

      // Backend devuelve { status: 'Éxito', mensaje: '...', usuario: {...} }
      if (resp?.status !== 'Éxito' || !resp?.usuario) {
        throw new Error(resp?.mensaje || 'Respuesta inválida del servidor');
      }

      // Guardamos el usuario como "token" de sesión
      localStorage.setItem(TOKEN_KEY, JSON.stringify(resp.usuario));
      localStorage.setItem(USER_KEY, JSON.stringify(resp.usuario));
      // También guardamos nombre y rol para fácil acceso en el dashboard
      localStorage.setItem('adminName', resp.usuario.nombre_completo || 'Usuario');
      localStorage.setItem('adminRol', resp.usuario.rol || 'Admin');
      setAuthenticated(true);
    } catch (err) {
      setError(err?.message || 'No se pudo autenticar');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRol');
    setAuthenticated(false);
    // Disparar evento de storage para sincronizar estado
    window.dispatchEvent(new Event('storage'));
  }, []);

  return { isAuthenticated, login, logout, loading, error };
}
