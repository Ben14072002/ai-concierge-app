import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBookings, useProperties, useCreateBooking, useUpdateBooking } from '@/api/hooks';
import { useAuth } from '@/hooks/useAuth';

// Mock useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
}));

describe('API Hooks', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useBookings', () => {
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
    };

    const mockBookings = [
      {
        id: '1',
        propertyName: 'Test Property 1',
        checkIn: '2024-03-20',
        checkOut: '2024-03-25',
        status: 'confirmed',
      },
      {
        id: '2',
        propertyName: 'Test Property 2',
        checkIn: '2024-04-01',
        checkOut: '2024-04-05',
        status: 'pending',
      },
    ];

    it('fetches bookings successfully', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      const { getDocs } = require('firebase/firestore');
      getDocs.mockResolvedValueOnce({
        docs: mockBookings.map((booking) => ({
          id: booking.id,
          data: () => booking,
        })),
      });

      const { result } = renderHook(() => useBookings(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockBookings);
    });

    it('handles error when fetching bookings', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      const { getDocs } = require('firebase/firestore');
      getDocs.mockRejectedValueOnce(new Error('Failed to fetch bookings'));

      const { result } = renderHook(() => useBookings(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
    });

    it('returns null when user is not authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => useBookings(), { wrapper });

      expect(result.current.data).toBeNull();
    });
  });

  describe('useProperties', () => {
    const mockProperties = [
      {
        id: '1',
        name: 'Test Property 1',
        type: 'hotel',
        price: 100,
        rating: 4.5,
      },
      {
        id: '2',
        name: 'Test Property 2',
        type: 'apartment',
        price: 80,
        rating: 4.2,
      },
    ];

    it('fetches properties successfully', async () => {
      const { getDocs } = require('firebase/firestore');
      getDocs.mockResolvedValueOnce({
        docs: mockProperties.map((property) => ({
          id: property.id,
          data: () => property,
        })),
      });

      const { result } = renderHook(() => useProperties(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockProperties);
    });

    it('handles error when fetching properties', async () => {
      const { getDocs } = require('firebase/firestore');
      getDocs.mockRejectedValueOnce(new Error('Failed to fetch properties'));

      const { result } = renderHook(() => useProperties(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useCreateBooking', () => {
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
    };

    const mockBooking = {
      propertyId: '1',
      propertyName: 'Test Property',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      guests: 2,
      price: 100,
      specialRequests: 'Test request',
      paymentMethod: 'credit_card',
    };

    it('creates booking successfully', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      const { addDoc } = require('firebase/firestore');
      addDoc.mockResolvedValueOnce({
        id: 'new-booking-id',
        ...mockBooking,
      });

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(mockBooking);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...mockBooking,
          userId: mockUser.uid,
          createdAt: expect.any(Date),
          status: 'pending',
        })
      );
    });

    it('handles error when creating booking', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      const { addDoc } = require('firebase/firestore');
      addDoc.mockRejectedValueOnce(new Error('Failed to create booking'));

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(mockBooking).catch(() => {});
      });

      expect(result.current.isError).toBe(true);
    });
  });

  describe('useUpdateBooking', () => {
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
    };

    const mockBookingUpdate = {
      id: '1',
      status: 'confirmed',
      specialRequests: 'Updated request',
    };

    it('updates booking successfully', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      const { updateDoc } = require('firebase/firestore');
      updateDoc.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useUpdateBooking(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(mockBookingUpdate);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: mockBookingUpdate.status,
          specialRequests: mockBookingUpdate.specialRequests,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('handles error when updating booking', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      const { updateDoc } = require('firebase/firestore');
      updateDoc.mockRejectedValueOnce(new Error('Failed to update booking'));

      const { result } = renderHook(() => useUpdateBooking(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(mockBookingUpdate).catch(() => {});
      });

      expect(result.current.isError).toBe(true);
    });
  });
}); 