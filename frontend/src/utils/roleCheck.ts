/**
 * Role-based access control utilities
 */

import { UserRole } from "@/types/acl.types";

/**
 * Check if user has administrative clearance (Super Admin, Admin, Manager, or Staff)
 */
export const isAdmin = (role?: string): boolean => {
  if (!role) return false;
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'].includes(role.toUpperCase());
};

/**
 * Check if user has customer role
 */
export const isUser = (role?: string): boolean => {
  if (!role) return true;
  return ['USER', 'CUSTOMER'].includes(role.toUpperCase());
};

/**
 * Check if user has any of the specified roles
 */
export const hasRole = (role: string | undefined, ...allowedRoles: string[]): boolean => {
  if (!role) return false;
  return allowedRoles.map((r) => r.toUpperCase()).includes(role.toUpperCase());
};

/**
 * Get role label
 */
export const getRoleLabel = (role?: string): string => {
  const roleLabels: Record<string, string> = {
    'SUPER_ADMIN': 'Super Administrator',
    'ADMIN': 'Administrator',
    'MANAGER': 'Store Manager',
    'STAFF': 'Store Staff',
    'CUSTOMER': 'Customer',
    'USER': 'Customer',
  };
  return role ? roleLabels[role.toUpperCase()] || role : 'Guest';
};

/**
 * Get role description
 */
export const getRoleDescription = (role?: string): string => {
  const descriptions: Record<string, string> = {
    'SUPER_ADMIN': 'Unrestricted master access across all business modules and vault management.',
    'ADMIN': 'Full access to admin panel, orders, products, users, coupons, reports and settings.',
    'MANAGER': 'Operational management of catalog, stock levels, orders and customer queries.',
    'STAFF': 'Frontline read-only access to catalog, customer records, and orders.',
    'CUSTOMER': 'Standard patron access to storefront, orders, wishlist and profile features.',
    'USER': 'Standard customer access to storefront, orders, wishlist and profile features.',
  };
  return role ? descriptions[role.toUpperCase()] || 'Standard Access' : 'Unknown role';
};
