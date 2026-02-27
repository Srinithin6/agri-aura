
export interface Product {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Staples' | 'Beverages' | 'Organic' | 'Regional Org';
  price: number;
  unit: string;
  image: string;
  description: string;
  stock: number;
  rating: number;
  isFresh?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export type BulkType = 'Hotel' | 'Shop' | 'Function Catering' | 'College Catering';

export interface User {
  name: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  taluk: string;
  place: string;
  buyerType: 'Home' | 'Bulk';
  bulkType?: BulkType;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'Processing' | 'Shipped' | 'Delivered';
  address: string;
  estimatedDelivery: string;
  deliveryDate?: string;
  deliverySlot?: string;
}

export enum AppTab {
  Shop = 'shop',
  Expert = 'expert',
  Orders = 'orders'
}
