import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface Feedback {
  id: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment: string;
  categories: string[];
  createdAt: Date;
}

class FeedbackService {
  private db = getFirestore();
  private collection = collection(this.db, 'feedback');

  async submitFeedback(feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<void> {
    try {
      await addDoc(this.collection, {
        ...feedback,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Fehler beim Speichern des Feedbacks:', error);
      throw new Error('Feedback konnte nicht gespeichert werden');
    }
  }

  async getFeedbackByBookingId(bookingId: string): Promise<Feedback | null> {
    try {
      const q = query(this.collection, where('bookingId', '==', bookingId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Feedback;
    } catch (error) {
      console.error('Fehler beim Abrufen des Feedbacks:', error);
      throw new Error('Feedback konnte nicht abgerufen werden');
    }
  }

  async getFeedbackByUserId(userId: string): Promise<Feedback[]> {
    try {
      const q = query(this.collection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        } as Feedback;
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzer-Feedbacks:', error);
      throw new Error('Feedbacks konnten nicht abgerufen werden');
    }
  }
}

export const feedbackService = new FeedbackService(); 