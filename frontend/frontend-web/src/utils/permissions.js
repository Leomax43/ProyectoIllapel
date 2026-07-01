export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  JEFATURA: 'JEFATURA',
  ASISTENTE_SOCIAL: 'ASISTENTE_SOCIAL',
  ENCARGADO_COMERCIOS: 'ENCARGADO_COMERCIOS',
  ADMIN: 'ADMIN',
  OPERADOR: 'OPERADOR'
};

export const FULL_ACCESS_ROLES = [ROLES.SUPER_ADMIN, ROLES.JEFATURA, ROLES.ADMIN];

export const normalizeRole = (role) => (role || '').toString().trim().toUpperCase();

export const getCurrentRole = () => normalizeRole(localStorage.getItem('adminRol'));

export const hasAccess = (allowedRoles = []) => {
  const role = getCurrentRole();
  if (!role) return false;
  return FULL_ACCESS_ROLES.includes(role) || allowedRoles.includes(role);
};

export const getAllowedPagesForRole = (role = getCurrentRole()) => {
  const normalizedRole = normalizeRole(role);

  if (FULL_ACCESS_ROLES.includes(normalizedRole)) {
    return ['dashboard', 'beneficiarios', 'comercios', 'fondos', 'transacciones', 'aprobaciones', 'funcionarios'];
  }

  if (normalizedRole === ROLES.ASISTENTE_SOCIAL) {
    return ['dashboard', 'beneficiarios', 'fondos'];
  }

  if (normalizedRole === ROLES.ENCARGADO_COMERCIOS) {
    return ['comercios', 'transacciones'];
  }

  if (normalizedRole === ROLES.OPERADOR) {
    return ['dashboard', 'beneficiarios', 'fondos'];
  }

  return [];
};
