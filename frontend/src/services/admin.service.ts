import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_ADMIN_CUSTOMERS,
  MOCK_ADMIN_USERS,
  MOCK_INVENTORY,
  MOCK_STOCK_HISTORY,
  MOCK_COUPONS,
  MOCK_BANNERS,
  MOCK_REVIEWS,
  MOCK_NOTIFICATIONS,
  MOCK_CATEGORIES,
  MOCK_COLLECTIONS,
} from './mockData';
import { InventoryItem, StockHistoryItem, Coupon, CMSBanner, AdminCustomer, AdminUser, AppNotification } from '@/types/admin.types';
import { ProductReview, Product, Category, Collection } from '@/types/product.types';

export const adminService = {
  getDashboardStats: async (range: 'today' | 'week' | 'month' | 'year' = 'month') => {
    return {
      totalSales: 4850000,
      salesChange: 14.8,
      totalOrders: 284,
      ordersChange: 8.2,
      totalCustomers: 1420,
      customersChange: 12.5,
      totalProducts: MOCK_PRODUCTS.length,
      pendingOrders: 14,
      lowStockCount: 2,
      revenue: 4850000,
      returnsCount: 3,
      salesByCategory: [
        { name: 'Rings', value: 1650000, percentage: 34 },
        { name: 'Necklaces', value: 1450000, percentage: 30 },
        { name: 'Earrings', value: 850000, percentage: 18 },
        { name: 'Bracelets', value: 550000, percentage: 11 },
        { name: 'Bangles', value: 350000, percentage: 7 },
      ],
      ordersByStatus: [
        { status: 'Delivered', count: 215, color: '#10B981' },
        { status: 'In Transit', count: 42, color: '#3B82F6' },
        { status: 'Processing', count: 18, color: '#F59E0B' },
        { status: 'Cancelled', count: 9, color: '#EF4444' },
      ],
      revenueChart: [
        { date: '01 Mar', revenue: 145000, orders: 12 },
        { date: '05 Mar', revenue: 280000, orders: 19 },
        { date: '10 Mar', revenue: 420000, orders: 25 },
        { date: '15 Mar', revenue: 390000, orders: 22 },
        { date: '20 Mar', revenue: 580000, orders: 34 },
        { date: '25 Mar', revenue: 710000, orders: 41 },
        { date: '30 Mar', revenue: 890000, orders: 52 },
      ],
    };
  },

  getInventory: async (): Promise<InventoryItem[]> => {
    return MOCK_INVENTORY;
  },

  getStockHistory: async (): Promise<StockHistoryItem[]> => {
    return MOCK_STOCK_HISTORY;
  },

  adjustStock: async (productId: string, quantity: number, type: 'addition' | 'reduction' | 'adjustment', reason: string) => {
    const item = MOCK_INVENTORY.find((i) => i.productId === productId);
    if (item) {
      if (type === 'addition') item.currentStock += quantity;
      else if (type === 'reduction') item.currentStock = Math.max(0, item.currentStock - quantity);
      else item.currentStock = quantity;
      item.availableStock = Math.max(0, item.currentStock - item.reservedStock);
      item.status = item.availableStock === 0 ? 'out_of_stock' : item.availableStock <= item.threshold ? 'low_stock' : 'in_stock';
    }
    return item;
  },

  getCustomers: async (): Promise<AdminCustomer[]> => {
    return MOCK_ADMIN_CUSTOMERS;
  },

  getUsers: async (): Promise<AdminUser[]> => {
    return MOCK_ADMIN_USERS;
  },

  getCoupons: async (): Promise<Coupon[]> => {
    return MOCK_COUPONS;
  },

  getBanners: async (): Promise<CMSBanner[]> => {
    return MOCK_BANNERS;
  },

  getReviews: async (): Promise<ProductReview[]> => {
    return MOCK_REVIEWS;
  },

  getNotifications: async (target: 'admin' | 'customer' = 'admin'): Promise<AppNotification[]> => {
    return MOCK_NOTIFICATIONS.filter((n) => !n.targetRole || n.targetRole === target);
  },
};
