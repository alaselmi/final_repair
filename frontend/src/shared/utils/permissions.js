/**
 * Role-based access control utilities
 * Centralized permission checks for the application
 */

export const ROLES = {
  ADMIN: 'admin',
  TECHNICIAN: 'technician',
  USER: 'user',
};

/**
 * Check if a user role has access to a resource/action
 * @param {string} userRole - The user's role from JWT payload
 * @param {string|string[]} requiredRole - Required role(s)
 * @returns {boolean} - Whether user has access
 */
export function canAccess(userRole, requiredRole) {
  if (!userRole || !requiredRole) {
    return false;
  }

  // Support single role or array of allowed roles
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return allowedRoles.includes(userRole);
}

/**
 * Check if user is admin
 * @param {string} userRole
 * @returns {boolean}
 */
export function isAdmin(userRole) {
  return canAccess(userRole, ROLES.ADMIN);
}

/**
 * Check if user is technician or admin
 * @param {string} userRole
 * @returns {boolean}
 */
export function isTechnician(userRole) {
  return canAccess(userRole, [ROLES.TECHNICIAN, ROLES.ADMIN]);
}

/**
 * Check if user can manage users (admin only)
 * @param {string} userRole
 * @returns {boolean}
 */
export function canManageUsers(userRole) {
  return isAdmin(userRole);
}

/**
 * Check if user can manage repairs
 * @param {string} userRole
 * @returns {boolean}
 */
export function canManageRepairs(userRole) {
  return isTechnician(userRole);
}
