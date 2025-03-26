import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

class FeedbackService {
  constructor() {
    this.feedbackCollection = collection(db, 'feedback');
  }

  // Fehler protokollieren
  async logError(error, context) {
    try {
      await addDoc(this.feedbackCollection, {
        type: 'error',
        message: error.message,
        stack: error.stack,
        context: context,
        timestamp: new Date(),
        status: 'new'
      });
    } catch (e) {
      console.error('Error logging feedback:', e);
    }
  }

  // Benutzer-Feedback speichern
  async saveFeedback(userId, rating, comment, category) {
    try {
      await addDoc(this.feedbackCollection, {
        type: 'user_feedback',
        userId: userId,
        rating: rating,
        comment: comment,
        category: category,
        timestamp: new Date(),
        status: 'new'
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  }

  // Feedback für einen Benutzer abrufen
  async getUserFeedback(userId) {
    try {
      const q = query(
        this.feedbackCollection,
        where('userId', '==', userId),
        where('type', '==', 'user_feedback')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user feedback:', error);
      throw error;
    }
  }

  // Feedback-Status aktualisieren
  async updateFeedbackStatus(feedbackId, status) {
    try {
      const feedbackRef = doc(db, 'feedback', feedbackId);
      await updateDoc(feedbackRef, {
        status: status
      });
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error;
    }
  }
}

export const feedbackService = new FeedbackService(); 