import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { affiliateService } from './affiliateService';

class BookingService {
  constructor() {
    this.bookings = [];
  }

  async initialize(hostId) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('hostId', '==', hostId));
      const querySnapshot = await getDocs(q);
      
      this.bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error initializing bookings:', error);
    }
  }

  async createBooking(bookingData) {
    try {
      const affiliate = await affiliateService.getAffiliateById(bookingData.affiliateId);
      if (!affiliate) {
        throw new Error('Affiliate not found');
      }

      const bookingRef = collection(db, 'bookings');
      const docRef = await addDoc(bookingRef, {
        ...bookingData,
        createdAt: Timestamp.now(),
        status: 'pending',
        commission: affiliate.commission,
        totalPrice: this.calculateTotalPrice(bookingData, affiliate)
      });

      const newBooking = {
        id: docRef.id,
        ...bookingData,
        createdAt: Timestamp.now(),
        status: 'pending',
        commission: affiliate.commission,
        totalPrice: this.calculateTotalPrice(bookingData, affiliate)
      };

      this.bookings.push(newBooking);
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: Timestamp.now()
      });

      this.bookings = this.bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status, updatedAt: Timestamp.now() }
          : booking
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
      });

      this.bookings = this.bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled', updatedAt: Timestamp.now() }
          : booking
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  calculateTotalPrice(bookingData, affiliate) {
    const basePrice = parseFloat(affiliate.price.replace(/[^0-9.-]+/g, ''));
    const quantity = bookingData.quantity || 1;
    const total = basePrice * quantity;
    const commission = (total * affiliate.commission) / 100;
    return total + commission;
  }

  getBookingsByStatus(status) {
    return this.bookings.filter(booking => booking.status === status);
  }

  getBookingById(bookingId) {
    return this.bookings.find(booking => booking.id === bookingId);
  }

  getAllBookings() {
    return this.bookings;
  }
}

export const bookingService = new BookingService(); 