import { UserRole } from './acl.types';
import { ShippingAddress } from './order.types';

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  createdAt: string;
  lastLogin?: string;
  addresses?: ShippingAddress[];
  wishlistCount?: number;
  reviewCount?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface StockHistoryItem {
  id: string;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'addition' | 'reduction' | 'adjustment' | 'sale' | 'return';
  reason: string;
  userName: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  image: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  threshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  perCustomerLimit: number;
  startDate: string;
  endDate: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  status: 'active' | 'expired' | 'disabled';
}

export interface CMSBanner {
  id: string;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage: string;
  ctaText: string;
  ctaUrl: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
  status: 'draft' | 'published' | 'scheduled' | 'expired';
  placement: 'hero' | 'promo' | 'category' | 'collection';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'customer' | 'review' | 'return' | 'payment' | 'system';
  createdAt: string;
  isRead: boolean;
  link?: string;
  targetRole?: 'admin' | 'customer';
}
