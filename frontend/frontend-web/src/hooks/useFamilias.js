import { useCallback, useState } from 'react';
import { createFamilia, listFamilias } from '../services/familiasService.js';

const buildDemoFamilia = (index) => ({
  rut_representante: `${Math.floor(Math.random() * 20000000)}-${Math.floor(Math.random() * 9)}`,
  nombre_familia: `Familia ${index}`,
  clave_acceso: '1234',
});

export function useFamilias() {
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const cargarFamilias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listFamilias();
      setFamilias(data);
    } catch (err) {
      setFamilias([]);
      setError(err?.message ?? 'No se pudo cargar la tabla de familias.');
    } finally {
      setLoading(false);
    }
  }, []);

  const crearFamiliaDemo = useCallback(async () => {
    setSubmitting(true);
    setError(null);

    try {
      const nuevaFamilia = buildDemoFamilia(familias.length + 1);
      await createFamilia(nuevaFamilia);
      await cargarFamilias();
    } catch (err) {
      setError(err?.message ?? 'No se pudo registrar la nueva familia.');
    } finally {
      setSubmitting(false);
    }
  }, [cargarFamilias, familias.length]);

  return {
    familias,
    loading,
    submitting,
    error,
    cargarFamilias,
    crearFamiliaDemo,
  };
}
