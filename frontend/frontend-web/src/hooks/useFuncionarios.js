// src/hooks/useFuncionarios.js
import { useState } from 'react';
import adminService from '../services/adminService';

export const useFuncionarios = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [funcionario, setFuncionario] = useState({
    rut: '',
    nombre_completo: '',
    rol: 'ASISTENTE_SOCIAL',
    clave: ''
  });

  const handleChange = (field, value) => {
    setFuncionario(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFuncionario({ rut: '', nombre_completo: '', rol: 'ASISTENTE_SOCIAL', clave: '' });
  };

  const registrarFuncionario = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!funcionario.rut || !funcionario.nombre_completo || !funcionario.clave) {
        throw new Error('Por favor, complete todos los campos obligatorios.');
      }

      await adminService.registrarFuncionario(funcionario);

      setMessage({ text: '✅ Funcionario registrado exitosamente en el sistema.', type: 'success' });
      
      setTimeout(() => {
        resetForm();
        setMessage(null);
      }, 3000);

    } catch (error) {
      setMessage({ text: `❌ ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return {
    funcionario,
    loading,
    message,
    handleChange,
    registrarFuncionario
  };
};