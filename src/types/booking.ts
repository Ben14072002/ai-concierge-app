export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface AffiliateBooking {
  id: string;
  userId: string;
  affiliateId: string;
  propertyId: string;
  propertyName: string;
  propertyType: 'hotel' | 'airbnb';
  checkIn: string;
  checkOut: string;
  guests: number;
  price: number;
  currency: string;
  status: BookingStatus;
  specialRequests?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
} 