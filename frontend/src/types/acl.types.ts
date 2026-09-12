export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER';

export type PermissionAction = 
  // Product permissions
  | 'product.view'
  | 'product.create'
  | 'product.update'
  | 'product.delete'
  // Category permissions
  | 'category.view'
  | 'category.create'
  | 'category.update'
  | 'category.delete'
  // Order permissions
  | 'order.view'
  | 'order.update'
  | 'order.cancel'
  // Customer permissions
  | 'customer.view'
  | 'customer.update'
  | 'customer.block'
  // Inventory permissions
  | 'inventory.view'
  | 'inventory.update'
  // Coupon permissions
  | 'coupon.view'
  | 'coupon.create'
  | 'coupon.update'
  | 'coupon.delete'
  // Reports permissions
  | 'reports.view'
  // User permissions
  | 'user.view'
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  // Role permissions
  | 'role.view'
  | 'role.create'
  | 'role.update'
  | 'role.delete'
  // Permission permissions
  | 'permission.view'
  | 'permission.update'
  // CMS & Banners permissions
  | 'cms.view'
  | 'cms.update'
  // Reviews permissions
  | 'reviews.view'
  | 'reviews.update';

export interface RoleDefinition {
  name: UserRole;
  label: string;
  description: string;
  permissions: PermissionAction[];
}
