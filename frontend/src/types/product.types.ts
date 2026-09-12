export type MetalType = 'Yellow Gold' | 'White Gold' | 'Rose Gold' | 'Platinum' | 'Silver';
export type GoldPurity = '14K' | '18K' | '22K' | '24K' | '925 Silver' | '950 Platinum';
export type GemstoneType = 'Diamond' | 'Emerald' | 'Ruby' | 'Sapphire' | 'Pearl' | 'Polki' | 'Navratna' | 'None';
export type DiamondClarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2';
export type DiamondColor = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  subcategory?: string;
  collection?: string;
  gender?: 'Women' | 'Men' | 'Unisex';
  metal: MetalType;
  purity: GoldPurity;
  weight: number; // in grams
  gemstone: GemstoneType;
  stoneWeight?: number; // in carats
  diamondClarity?: DiamondClarity;
  diamondColor?: DiamondColor;
  certification: string; // e.g., 'BIS Hallmarked 916 & IGI Certified'
  stock: number;
  lowStockThreshold?: number;
  isAvailable: boolean;
  images: string[];
  videoUrl?: string;
  view360Urls?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  sizes?: string[];
  tags?: string[];
  createdAt: string;
  status?: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  parentId?: string | null;
  status: 'active' | 'inactive';
  sortOrder: number;
  productCount?: number;
  children?: Category[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  banner: string;
  description: string;
  productsCount?: number;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'inactive';
  isFeatured?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  images?: string[];
  verifiedPurchase: boolean;
}

export interface ProductFilterParams {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  metal?: MetalType[];
  purity?: GoldPurity[];
  gemstone?: GemstoneType[];
  gender?: string[];
  collection?: string;
  availability?: boolean;
  minRating?: number;
  minDiscount?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}
