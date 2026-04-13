export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  wilaya: string;
  phone: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  rating: number;
  ratingCount: number;
  createdAt: string;
}

export interface CarListing {
  id: string;
  title: string;
  description: string;
  price: number;
  bidPrice?: number; // ساموني
  condition: 'excellent' | 'good' | 'average' | 'below_average';
  year: number;
  mileage?: number;
  engine: 'Diesel' | 'Essence';
  gearbox: 'Manuelle' | 'Automatique';
  engineState: 'heats' | 'consumes' | 'consumes_little' | 'perfect'; // يسخن، ينقص، ينقص شوي، ما ينقص
  bodyState: string; // معاودة، فوال، بروتال، إلخ
  replacedParts?: string;
  brand: string;
  model: string;
  wilaya: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  showPhone: boolean; // خيار إظهار الهاتف
  isVerified: boolean;
  status: 'active' | 'sold';
  createdAt: string;
}

export interface ChatThread {
  id: string;
  participants: string[];
  carId: string;
  lastMessage: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  carId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}
