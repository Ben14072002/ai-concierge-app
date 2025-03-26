/// <reference types="jest" />
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useProperties,
  useBookings,
  useCreateBooking,
  useUpdateBooking
} from '../../api/hooks';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn()
}));

// Mock data
const mockProperties = [
  {
    id: 'prop1',
    title: 'Luxus-Apartment',
    price: 150
  },
  {
    id: 'prop2',
    title: 'Stadthaus',
    price: 200
  }
];

const mockBookings = [
  {
    id: 'booking1',
    propertyId: 'prop1',
    userId: 'user1',
    checkIn: '2024-04-01',
    checkOut: '2024-04-03'
  }
];

describe('API Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    // Reset all mocks
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('useProperties', () => {
    it('sollte Properties erfolgreich abrufen', async () => {
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockProperties.map(prop => ({
          id: prop.id,
          data: () => prop
        }))
      });

      const { result, waitFor } = renderHook(() => useProperties(), { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(result.current.data).toEqual(mockProperties);
      expect(result.current.error).toBeNull();
    });

    it('sollte Fehler beim Abrufen der Properties behandeln', async () => {
      const error = new Error('Fehler beim Laden der Properties');
      (getDocs as jest.Mock).mockRejectedValueOnce(error);

      const { result, waitFor } = renderHook(() => useProperties(), { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useBookings', () => {
    it('sollte Buchungen erfolgreich abrufen', async () => {
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockBookings.map(booking => ({
          id: booking.id,
          data: () => booking
        }))
      });

      const { result, waitFor } = renderHook(() => useBookings(), { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(result.current.data).toEqual(mockBookings);
      expect(result.current.error).toBeNull();
    });

    it('sollte Fehler beim Abrufen der Buchungen behandeln', async () => {
      const error = new Error('Fehler beim Laden der Buchungen');
      (getDocs as jest.Mock).mockRejectedValueOnce(error);

      const { result, waitFor } = renderHook(() => useBookings(), { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useCreateBooking', () => {
    const newBooking = {
      propertyId: 'prop1',
      userId: 'user1',
      checkIn: '2024-04-01',
      checkOut: '2024-04-03',
      guests: 2,
      totalPrice: 300
    };

    it('sollte eine neue Buchung erfolgreich erstellen', async () => {
      (addDoc as jest.Mock).mockResolvedValueOnce({
        id: 'newBooking1'
      });

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(newBooking);
      });

      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(newBooking)
      );
      expect(result.current.isSuccess).toBe(true);
    });

    it('sollte Fehler bei der Buchungserstellung behandeln', async () => {
      const error = new Error('Fehler bei der Buchungserstellung');
      (addDoc as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      try {
        await act(async () => {
          await result.current.mutateAsync(newBooking);
        });
      } catch (e) {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(error);
      }
    });
  });

  describe('useUpdateBooking', () => {
    const bookingUpdate = {
      id: 'booking1',
      data: {
        checkOut: '2024-04-04',
        guests: 3
      }
    };

    it('sollte eine Buchung erfolgreich aktualisieren', async () => {
      (doc as jest.Mock).mockReturnValueOnce('bookingRef');
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useUpdateBooking(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(bookingUpdate);
      });

      expect(updateDoc).toHaveBeenCalledWith(
        'bookingRef',
        expect.objectContaining(bookingUpdate.data)
      );
      expect(result.current.isSuccess).toBe(true);
    });

    it('sollte Fehler bei der Buchungsaktualisierung behandeln', async () => {
      const error = new Error('Fehler bei der Buchungsaktualisierung');
      (doc as jest.Mock).mockReturnValueOnce('bookingRef');
      (updateDoc as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateBooking(), { wrapper });

      try {
        await act(async () => {
          await result.current.mutateAsync(bookingUpdate);
        });
      } catch (e) {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(error);
      }
    });
  });
}); 