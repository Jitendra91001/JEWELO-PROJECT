import { UserRole, PermissionAction, RoleDefinition } from '@/types/acl.types';

export const PERMISSION_MODULES: {
  module: string;
  label: string;
  permissions: { action: PermissionAction; label: string }[];
}[] = [
  {
    module: 'PRODUCT',
    label: 'Product Management',
    permissions: [
      { action: 'product.view', label: 'View Products' },
      { action: 'product.create', label: 'Create Product' },
      { action: 'product.update', label: 'Edit Product' },
      { action: 'product.delete', label: 'Delete Product' },
    ],
  },
  {
    module: 'CATEGORY',
    label: 'Category & Collections',
    permissions: [
      { action: 'category.view', label: 'View Categories' },
      { action: 'category.create', label: 'Create Category' },
      { action: 'category.update', label: 'Edit Category' },
      { action: 'category.delete', label: 'Delete Category' },
    ],
  },
  {
    module: 'ORDERS',
    label: 'Order Management',
    permissions: [
      { action: 'order.view', label: 'View Orders' },
      { action: 'order.update', label: 'Update Order Status' },
      { action: 'order.cancel', label: 'Cancel & Refund' },
    ],
  },
  {
    module: 'CUSTOMERS',
    label: 'Customer Relations',
    permissions: [
      { action: 'customer.view', label: 'View Customers' },
      { action: 'customer.update', label: 'Update Customer Info' },
      { action: 'customer.block', label: 'Block / Unblock' },
    ],
  },
  {
    module: 'INVENTORY',
    label: 'Inventory & Stock',
    permissions: [
      { action: 'inventory.view', label: 'View Stock Levels' },
      { action: 'inventory.update', label: 'Adjust Stock Quantities' },
    ],
  },
  {
    module: 'COUPONS',
    label: 'Discounts & Coupons',
    permissions: [
      { action: 'coupon.view', label: 'View Coupons' },
      { action: 'coupon.create', label: 'Create Coupon' },
      { action: 'coupon.update', label: 'Edit Coupon' },
      { action: 'coupon.delete', label: 'Delete Coupon' },
    ],
  },
  {
    module: 'REPORTS',
    label: 'Reports & Analytics',
    permissions: [
      { action: 'reports.view', label: 'View Analytics & Export' },
    ],
  },
  {
    module: 'USERS',
    label: 'Admin Staff & Users',
    permissions: [
      { action: 'user.view', label: 'View Admin Users' },
      { action: 'user.create', label: 'Invite / Add Staff' },
      { action: 'user.update', label: 'Edit Staff Details' },
      { action: 'user.delete', label: 'Remove Staff' },
    ],
  },
  {
    module: 'ROLES',
    label: 'Roles & Permissions',
    permissions: [
      { action: 'role.view', label: 'View Roles' },
      { action: 'role.create', label: 'Create Custom Role' },
      { action: 'role.update', label: 'Edit Role Permissions' },
      { action: 'role.delete', label: 'Delete Role' },
      { action: 'permission.view', label: 'View Permissions' },
      { action: 'permission.update', label: 'Modify Permissions' },
    ],
  },
  {
    module: 'CMS',
    label: 'CMS & Banners',
    permissions: [
      { action: 'cms.view', label: 'View Banners' },
      { action: 'cms.update', label: 'Manage & Publish Banners' },
    ],
  },
  {
    module: 'REVIEWS',
    label: 'Review Moderation',
    permissions: [
      { action: 'reviews.view', label: 'View Customer Reviews' },
      { action: 'reviews.update', label: 'Approve / Reject Reviews' },
    ],
  },
];

export const ALL_PERMISSIONS: PermissionAction[] = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.action)
);

export const DEFAULT_ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  SUPER_ADMIN: {
    name: 'SUPER_ADMIN',
    label: 'Super Administrator',
    description: 'Unrestricted master access across all business modules and systems.',
    permissions: [...ALL_PERMISSIONS],
  },
  ADMIN: {
    name: 'ADMIN',
    label: 'Administrator',
    description: 'Full operational control over products, orders, inventory, customers, marketing & reporting.',
    permissions: ALL_PERMISSIONS.filter(
      (p) => !['role.delete', 'permission.update'].includes(p)
    ),
  },
  MANAGER: {
    name: 'MANAGER',
    label: 'Store Manager',
    description: 'Manages catalog, inventory, order processing, customer queries and promotions.',
    permissions: [
      'product.view', 'product.create', 'product.update',
      'category.view', 'category.create', 'category.update',
      'order.view', 'order.update',
      'customer.view', 'customer.update',
      'inventory.view', 'inventory.update',
      'coupon.view', 'coupon.create', 'coupon.update',
      'reports.view',
      'cms.view', 'cms.update',
      'reviews.view', 'reviews.update',
    ],
  },
  STAFF: {
    name: 'STAFF',
    label: 'Store Staff',
    description: 'Frontline staff with read-only access to catalog, customer records, and orders.',
    permissions: [
      'product.view',
      'category.view',
      'order.view',
      'customer.view',
      'inventory.view',
      'reviews.view',
    ],
  },
  CUSTOMER: {
    name: 'CUSTOMER',
    label: 'Customer / Patron',
    description: 'Public storefront customer with access to browsing, shopping cart, orders and profile.',
    permissions: [],
  },
};

export const hasPermission = (
  role: UserRole | undefined,
  permission: PermissionAction
): boolean => {
  if (!role) return false;
  const roleDef = DEFAULT_ROLE_DEFINITIONS[role];
  if (!roleDef) return false;
  return roleDef.permissions.includes(permission);
};

export const hasAnyPermission = (
  role: UserRole | undefined,
  permissions: PermissionAction[]
): boolean => {
  if (!role) return false;
  return permissions.some((p) => hasPermission(role, p));
};

export const hasRole = (
  userRole: UserRole | undefined,
  ...allowedRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
