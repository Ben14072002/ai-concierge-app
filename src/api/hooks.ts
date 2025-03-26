import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Property } from '../types/property';
import { Booking } from '../types/booking';
import { useAuth } from '../contexts/AuthContext';

// Properties
export const useProperties = () => {
  return useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    }
  });
};

// Bookings
export const useBookings = () => {
  const { currentUser } = useAuth();
  
  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!currentUser) throw new Error('Nicht eingeloggt');
      
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
    },
    enabled: !!currentUser
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  return useMutation({
    mutationFn: async (bookingData: Omit<Booking, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!currentUser) throw new Error('Nicht eingeloggt');
      
      const bookingsRef = collection(db, 'bookings');
      const docRef = await addDoc(bookingsRef, {
        ...bookingData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending'
      });
      
      return {
        id: docRef.id,
        ...bookingData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending'
      } as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; data: Partial<Booking> }) => {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}; 