export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'villa';
  price: number;
  location: string;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  isAvailable: boolean;
  hasSpecialOffer?: boolean;
} 