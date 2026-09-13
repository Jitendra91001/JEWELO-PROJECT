/**
 * System Permissions Definition for Jewellery E-Commerce
 */

export const PERMISSIONS = {
  // Product
  PRODUCT_VIEW: "product.view",
  PRODUCT_CREATE: "product.create",
  PRODUCT_UPDATE: "product.update",
  PRODUCT_DELETE: "product.delete",

  // Category
  CATEGORY_VIEW: "category.view",
  CATEGORY_CREATE: "category.create",
  CATEGORY_UPDATE: "category.update",
  CATEGORY_DELETE: "category.delete",

  // Collection
  COLLECTION_VIEW: "collection.view",
  COLLECTION_CREATE: "collection.create",
  COLLECTION_UPDATE: "collection.update",
  COLLECTION_DELETE: "collection.delete",

  // Inventory
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_CREATE: "inventory.create",
  INVENTORY_UPDATE: "inventory.update",
  INVENTORY_DELETE: "inventory.delete",

  // Order
  ORDER_VIEW: "order.view",
  ORDER_CREATE: "order.create",
  ORDER_UPDATE: "order.update",
  ORDER_CANCEL: "order.cancel",
  ORDER_REFUND: "order.refund",

  // Customer
  CUSTOMER_VIEW: "customer.view",
  CUSTOMER_CREATE: "customer.create",
  CUSTOMER_UPDATE: "customer.update",
  CUSTOMER_BLOCK: "customer.block",
  CUSTOMER_DELETE: "customer.delete",

  // User
  USER_VIEW: "user.view",
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
  USER_DELETE: "user.delete",

  // Role
  ROLE_VIEW: "role.view",
  ROLE_CREATE: "role.create",
  ROLE_UPDATE: "role.update",
  ROLE_DELETE: "role.delete",

  // Permission
  PERMISSION_VIEW: "permission.view",
  PERMISSION_UPDATE: "permission.update",

  // Coupon
  COUPON_VIEW: "coupon.view",
  COUPON_CREATE: "coupon.create",
  COUPON_UPDATE: "coupon.update",
  COUPON_DELETE: "coupon.delete",

  // Banner
  BANNER_VIEW: "banner.view",
  BANNER_CREATE: "banner.create",
  BANNER_UPDATE: "banner.update",
  BANNER_DELETE: "banner.delete",

  // Review
  REVIEW_VIEW: "review.view",
  REVIEW_APPROVE: "review.approve",
  REVIEW_REJECT: "review.reject",
  REVIEW_DELETE: "review.delete",

  // Report
  REPORT_VIEW: "report.view",

  // Notification
  NOTIFICATION_VIEW: "notification.view",
  NOTIFICATION_MANAGE: "notification.manage",

  // Return
  RETURN_VIEW: "return.view",
  RETURN_APPROVE: "return.approve",
  RETURN_REJECT: "return.reject",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS_LIST: { code: PermissionCode; module: string; name: string; description: string }[] = [
  // Product
  { code: PERMISSIONS.PRODUCT_VIEW, module: "product", name: "View Products", description: "View catalogue and product details" },
  { code: PERMISSIONS.PRODUCT_CREATE, module: "product", name: "Create Products", description: "Add new products to catalogue" },
  { code: PERMISSIONS.PRODUCT_UPDATE, module: "product", name: "Update Products", description: "Edit products and specifications" },
  { code: PERMISSIONS.PRODUCT_DELETE, module: "product", name: "Delete Products", description: "Archive or delete products" },

  // Category
  { code: PERMISSIONS.CATEGORY_VIEW, module: "category", name: "View Categories", description: "View category hierarchy" },
  { code: PERMISSIONS.CATEGORY_CREATE, module: "category", name: "Create Categories", description: "Add new categories and subcategories" },
  { code: PERMISSIONS.CATEGORY_UPDATE, module: "category", name: "Update Categories", description: "Modify category hierarchy and metadata" },
  { code: PERMISSIONS.CATEGORY_DELETE, module: "category", name: "Delete Categories", description: "Delete or archive categories" },

  // Collection
  { code: PERMISSIONS.COLLECTION_VIEW, module: "collection", name: "View Collections", description: "Browse thematic lines and collections" },
  { code: PERMISSIONS.COLLECTION_CREATE, module: "collection", name: "Create Collections", description: "Create curated jewellery collections" },
  { code: PERMISSIONS.COLLECTION_UPDATE, module: "collection", name: "Update Collections", description: "Edit collections and associated items" },
  { code: PERMISSIONS.COLLECTION_DELETE, module: "collection", name: "Delete Collections", description: "Archive or delete collections" },

  // Inventory
  { code: PERMISSIONS.INVENTORY_VIEW, module: "inventory", name: "View Inventory", description: "View stock levels and warehouse allocations" },
  { code: PERMISSIONS.INVENTORY_CREATE, module: "inventory", name: "Create Inventory", description: "Initialize inventory items" },
  { code: PERMISSIONS.INVENTORY_UPDATE, module: "inventory", name: "Update Inventory", description: "Adjust stock counts and reservations" },
  { code: PERMISSIONS.INVENTORY_DELETE, module: "inventory", name: "Delete Inventory", description: "Remove inventory items" },

  // Order
  { code: PERMISSIONS.ORDER_VIEW, module: "order", name: "View Orders", description: "View customer orders and histories" },
  { code: PERMISSIONS.ORDER_CREATE, module: "order", name: "Create Orders", description: "Place new orders" },
  { code: PERMISSIONS.ORDER_UPDATE, module: "order", name: "Update Orders", description: "Change order status and tracking info" },
  { code: PERMISSIONS.ORDER_CANCEL, module: "order", name: "Cancel Orders", description: "Cancel active orders" },
  { code: PERMISSIONS.ORDER_REFUND, module: "order", name: "Refund Orders", description: "Authorize and issue refunds" },

  // Customer
  { code: PERMISSIONS.CUSTOMER_VIEW, module: "customer", name: "View Customers", description: "View customer profiles and activity" },
  { code: PERMISSIONS.CUSTOMER_CREATE, module: "customer", name: "Create Customers", description: "Create customer accounts" },
  { code: PERMISSIONS.CUSTOMER_UPDATE, module: "customer", name: "Update Customers", description: "Update customer records" },
  { code: PERMISSIONS.CUSTOMER_BLOCK, module: "customer", name: "Block Customers", description: "Suspend or block customer accounts" },
  { code: PERMISSIONS.CUSTOMER_DELETE, module: "customer", name: "Delete Customers", description: "Delete customer profiles" },

  // User (Admin/Staff)
  { code: PERMISSIONS.USER_VIEW, module: "user", name: "View Users", description: "View admin and staff accounts" },
  { code: PERMISSIONS.USER_CREATE, module: "user", name: "Create Users", description: "Create internal user accounts" },
  { code: PERMISSIONS.USER_UPDATE, module: "user", name: "Update Users", description: "Edit user credentials and profiles" },
  { code: PERMISSIONS.USER_DELETE, module: "user", name: "Delete Users", description: "Delete user accounts" },

  // Role
  { code: PERMISSIONS.ROLE_VIEW, module: "role", name: "View Roles", description: "View RBAC roles matrix" },
  { code: PERMISSIONS.ROLE_CREATE, module: "role", name: "Create Roles", description: "Create custom roles" },
  { code: PERMISSIONS.ROLE_UPDATE, module: "role", name: "Update Roles", description: "Modify permissions attached to roles" },
  { code: PERMISSIONS.ROLE_DELETE, module: "role", name: "Delete Roles", description: "Delete roles" },

  // Permission
  { code: PERMISSIONS.PERMISSION_VIEW, module: "permission", name: "View Permissions", description: "List all system permissions" },
  { code: PERMISSIONS.PERMISSION_UPDATE, module: "permission", name: "Update Permissions", description: "Update permission metadata" },

  // Coupon
  { code: PERMISSIONS.COUPON_VIEW, module: "coupon", name: "View Coupons", description: "View active and expired coupons" },
  { code: PERMISSIONS.COUPON_CREATE, module: "coupon", name: "Create Coupons", description: "Create promotional codes" },
  { code: PERMISSIONS.COUPON_UPDATE, module: "coupon", name: "Update Coupons", description: "Modify discount rules and validity" },
  { code: PERMISSIONS.COUPON_DELETE, module: "coupon", name: "Delete Coupons", description: "Delete coupons" },

  // Banner
  { code: PERMISSIONS.BANNER_VIEW, module: "banner", name: "View Banners", description: "View promotional homepage banners" },
  { code: PERMISSIONS.BANNER_CREATE, module: "banner", name: "Create Banners", description: "Upload and schedule banners" },
  { code: PERMISSIONS.BANNER_UPDATE, module: "banner", name: "Update Banners", description: "Edit banner assets and links" },
  { code: PERMISSIONS.BANNER_DELETE, module: "banner", name: "Delete Banners", description: "Delete banners" },

  // Review
  { code: PERMISSIONS.REVIEW_VIEW, module: "review", name: "View Reviews", description: "View customer product reviews" },
  { code: PERMISSIONS.REVIEW_APPROVE, module: "review", name: "Approve Reviews", description: "Publish customer reviews" },
  { code: PERMISSIONS.REVIEW_REJECT, module: "review", name: "Reject Reviews", description: "Reject or hide inappropriate reviews" },
  { code: PERMISSIONS.REVIEW_DELETE, module: "review", name: "Delete Reviews", description: "Permanently delete reviews" },

  // Report
  { code: PERMISSIONS.REPORT_VIEW, module: "report", name: "View Reports", description: "Access sales, revenue, and product analytics" },

  // Notification
  { code: PERMISSIONS.NOTIFICATION_VIEW, module: "notification", name: "View Notifications", description: "Access notifications" },
  { code: PERMISSIONS.NOTIFICATION_MANAGE, module: "notification", name: "Manage Notifications", description: "Dispatch system broadcasts" },

  // Return
  { code: PERMISSIONS.RETURN_VIEW, module: "return", name: "View Returns", description: "Inspect customer return requests" },
  { code: PERMISSIONS.RETURN_APPROVE, module: "return", name: "Approve Returns", description: "Approve returns and authorize pickups" },
  { code: PERMISSIONS.RETURN_REJECT, module: "return", name: "Reject Returns", description: "Decline ineligible return claims" },
];
