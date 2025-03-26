import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Booking {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppState {
  user: User | null;
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        bookings: [],
        loading: false,
        error: null,
        setUser: (user) => set({ user }),
        setBookings: (bookings) => set({ bookings }),
        addBooking: (booking) =>
          set((state) => ({
            bookings: [...state.bookings, booking],
          })),
        updateBooking: (id, booking) =>
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === id ? { ...b, ...booking } : b
            ),
          })),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: 'app-storage',
      }
    )
  )
); 