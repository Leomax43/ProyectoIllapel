import { useState, useEffect, useCallback } from 'react';
import beneficiariesService from '../services/beneficiariesService';

export const useBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [stats, setStats] = useState({
    total_registrados: 0,
    activos: 0,
    pendientes: 0,
    bajas: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LIMIT = 8;

  // Cargar beneficiarios
  const fetchBeneficiaries = useCallback(async (page = 1, search = '', estado = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await beneficiariesService.getBeneficiaries(page, LIMIT, search, estado);
      setBeneficiaries(data.familias);
      setTotalPages(data.paginacion.total_paginas);
      setCurrentPage(page);
    } catch (err) {
      setError('Error al cargar beneficiarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    try {
      const data = await beneficiariesService.getBeneficiariesStats();
      setStats(data.datos);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchBeneficiaries(1, '', '');
    fetchStats();
  }, [fetchBeneficiaries, fetchStats]);

  // Manejar cambio de búsqueda
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchBeneficiaries(1, term, estadoFilter);
  }, [estadoFilter, fetchBeneficiaries]);

  // Manejar cambio de filtro
  const handleEstadoFilter = useCallback((estado) => {
    setEstadoFilter(estado);
    setCurrentPage(1);
    fetchBeneficiaries(1, searchTerm, estado);
  }, [searchTerm, fetchBeneficiaries]);

  // Navegar a página siguiente
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchBeneficiaries(newPage, searchTerm, estadoFilter);
    }
  }, [currentPage, totalPages, searchTerm, estadoFilter, fetchBeneficiaries]);

  // Navegar a página anterior
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchBeneficiaries(newPage, searchTerm, estadoFilter);
    }
  }, [currentPage, searchTerm, estadoFilter, fetchBeneficiaries]);

  return {
    beneficiaries,
    stats,
    currentPage,
    totalPages,
    searchTerm,
    estadoFilter,
    loading,
    error,
    handleSearch,
    handleEstadoFilter,
    nextPage,
    prevPage
  };
};
