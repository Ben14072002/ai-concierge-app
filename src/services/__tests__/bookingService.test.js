import { bookingService } from '../bookingService';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { affiliateService } from '../affiliateService';

// Mock Firebase
jest.mock('../../firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  Timestamp: {
    now: () => new Date(),
  },
}));

// Mock affiliateService
jest.mock('../affiliateService', () => ({
  affiliateService: {
    getAffiliateById: jest.fn().mockResolvedValue({
      id: 'test-affiliate-id',
      name: 'Test Affiliate',
      active: true
    })
  }
}));

describe('Booking Service', () => {
  const mockBooking = {
    affiliateId: 'test-affiliate-id',
    userId: 'test-user-id',
    checkIn: '2024-04-01',
    checkOut: '2024-04-05',
    guests: 2,
    status: 'pending'
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    addDoc.mockResolvedValue({ id: 'test-booking-id' });
    updateDoc.mockResolvedValue({});
  });

  describe('createBooking', () => {
    it('creates a new booking', async () => {
      const result = await bookingService.createBooking(mockBooking);
      
      expect(result).toEqual({
        id: 'test-booking-id',
        ...mockBooking
      });
      
      expect(addDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining(mockBooking)
      );
    });

    it('handles error when creating booking', async () => {
      addDoc.mockRejectedValueOnce(new Error('Failed to create booking'));
      
      await expect(bookingService.createBooking(mockBooking))
        .rejects.toThrow('Failed to create booking');
    });
  });

  describe('getAllBookings', () => {
    test('retrieves all bookings', async () => {
      const mockBookings = [
        {
          id: '1',
          affiliateId: 'test-affiliate-1',
          date: '2024-03-25',
          status: 'confirmed',
        },
        {
          id: '2',
          affiliateId: 'test-affiliate-2',
          date: '2024-03-26',
          status: 'pending',
        },
      ];

      bookingService.bookings = mockBookings;

      const result = bookingService.getAllBookings();

      expect(result).toEqual(mockBookings);
    });

    test('handles empty bookings', async () => {
      bookingService.bookings = [];

      const result = bookingService.getAllBookings();

      expect(result).toEqual([]);
    });
  });

  describe('updateBookingStatus', () => {
    it('updates booking status', async () => {
      const bookingId = 'test-booking-id';
      const newStatus = 'confirmed';
      
      await bookingService.updateBookingStatus(bookingId, newStatus);
      
      expect(updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { status: newStatus }
      );
    });

    test('handles error when updating booking status', async () => {
      const bookingId = 'test-booking-id';
      const newStatus = 'confirmed';

      updateDoc.mockRejectedValueOnce(new Error('Failed to update booking status'));

      await expect(bookingService.updateBookingStatus(bookingId, newStatus)).rejects.toThrow(
        'Failed to update booking status'
      );
    });
  });
}); 