import { useCallback, useEffect, useState } from 'react';
import { getHealthStatus } from '../services/healthService.js';

export function useBackendStatus() {
  const [status, setStatus] = useState('Desconectado');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHealthStatus();
      setStatus(data?.status === 'OK' ? 'Conectado' : 'Error BD');
    } catch (err) {
      setStatus('Servidor Apagado');
      setError(err?.message ?? 'No se pudo conectar con el backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return { status, refreshStatus, loading, error };
}
