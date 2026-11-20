export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight: string;
  mainImageUrl: string;
  categoryId: string;
  category?: Category;
  isAvailable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  images?: ProductImage[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CartItem {
  id: string; // product id
  name: string;
  slug: string;
  price: number;
  weight: string;
  mainImageUrl: string;
  quantity: number;
}

export type OrderStatus = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  product?: Product | null;
  productNameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  subtotal: number;
  weightSnapshot?: string | null;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  notes?: string | null;
  createdAt: string | Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  landmark?: string | null;
  instructions?: string | null;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BusinessSettings {
  id: string;
  businessName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  mapUrl: string;
  logoUrl: string;
  heroImageUrl: string;
  announcement: string;
  homepageHeading: string;
  homepageDescription: string;
  socialLinks: string; // JSON string
  aboutStory: string;
  updatedAt: string | Date;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | Date;
}
