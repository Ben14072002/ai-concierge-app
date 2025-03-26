import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AffiliateBooking } from '../types/booking';

class BookingService {
  private readonly collectionName = 'bookings';

  async getUserBookings(userId: string): Promise<AffiliateBooking[]> {
    try {
      const bookingsRef = collection(db, this.collectionName);
      const q = query(bookingsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AffiliateBooking[];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async createBooking(booking: Omit<AffiliateBooking, 'id'>): Promise<AffiliateBooking> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), booking);
      return {
        id: docRef.id,
        ...booking
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  }

  async updateBooking(bookingId: string, updates: Partial<AffiliateBooking>): Promise<void> {
    try {
      const bookingRef = doc(db, this.collectionName, bookingId);
      await updateDoc(bookingRef, updates);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }
  }

  async cancelBooking(bookingId: string): Promise<void> {
    try {
      const bookingRef = doc(db, this.collectionName, bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Failed to cancel booking');
    }
  }

  async deleteBooking(bookingId: string): Promise<void> {
    try {
      const bookingRef = doc(db, this.collectionName, bookingId);
      await deleteDoc(bookingRef);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Failed to delete booking');
    }
  }
}

export const bookingService = new BookingService(); 