/**
 * Role-based access control utilities
 */

export type UserRole = 'USER' | 'ADMIN';

/**
 * Check if user has admin role
 */
export const isAdmin = (role?: UserRole): boolean => {
  return role === 'ADMIN';
};

/**
 * Check if user has user role
 */
export const isUser = (role?: UserRole): boolean => {
  return role === 'USER';
};

/**
 * Check if user has any of the specified roles
 */
export const hasRole = (role: UserRole | undefined, ...allowedRoles: UserRole[]): boolean => {
  if (!role) return false;
  return allowedRoles.includes(role);
};

/**
 * Get role label
 */
export const getRoleLabel = (role?: UserRole): string => {
  const roleLabels: Record<UserRole, string> = {
    'USER': 'Customer',
    'ADMIN': 'Administrator',
  };
  return role ? roleLabels[role] : 'Unknown';
};

/**
 * Get role description
 */
export const getRoleDescription = (role?: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    'USER': 'Standard customer access to storefront, orders, wishlist and account features.',
    'ADMIN': 'Full access to admin panel, orders, products, users, coupons, reports and settings.',
  };
  return role ? descriptions[role] : 'Unknown role';
};
