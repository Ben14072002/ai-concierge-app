import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

class UXService {
  constructor() {
    this.userPreferencesCollection = collection(db, 'user_preferences');
    this.userInteractionsCollection = collection(db, 'user_interactions');
    this.accessibilityCollection = collection(db, 'accessibility_settings');
  }

  // Benutzereinstellungen speichern
  async saveUserPreferences(userId, preferences) {
    try {
      const preferencesRef = doc(this.userPreferencesCollection, userId);
      await setDoc(preferencesRef, {
        ...preferences,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern der Benutzereinstellungen:', error);
      return false;
    }
  }

  // Benutzereinstellungen abrufen
  async getUserPreferences(userId) {
    try {
      const preferencesRef = doc(this.userPreferencesCollection, userId);
      const preferencesDoc = await getDoc(preferencesRef);
      return preferencesDoc.exists() ? preferencesDoc.data() : null;
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzereinstellungen:', error);
      return null;
    }
  }

  // Benutzerinteraktionen protokollieren
  async logUserInteraction(userId, interaction) {
    try {
      const interactionRef = doc(this.userInteractionsCollection);
      await setDoc(interactionRef, {
        userId,
        ...interaction,
        timestamp: new Date()
      });
      return true;
    } catch (error) {
      console.error('Fehler beim Protokollieren der Benutzerinteraktion:', error);
      return false;
    }
  }

  // Barrierefreiheit-Einstellungen speichern
  async saveAccessibilitySettings(userId, settings) {
    try {
      const accessibilityRef = doc(this.accessibilityCollection, userId);
      await setDoc(accessibilityRef, {
        ...settings,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern der Barrierefreiheit-Einstellungen:', error);
      return false;
    }
  }

  // Barrierefreiheit-Einstellungen abrufen
  async getAccessibilitySettings(userId) {
    try {
      const accessibilityRef = doc(this.accessibilityCollection, userId);
      const accessibilityDoc = await getDoc(accessibilityRef);
      return accessibilityDoc.exists() ? accessibilityDoc.data() : null;
    } catch (error) {
      console.error('Fehler beim Abrufen der Barrierefreiheit-Einstellungen:', error);
      return null;
    }
  }

  // Benutzerinteraktionen analysieren
  async analyzeUserInteractions(userId) {
    try {
      const interactionsQuery = query(
        this.userInteractionsCollection,
        where('userId', '==', userId)
      );
      const interactionsSnapshot = await getDocs(interactionsQuery);
      const interactions = interactionsSnapshot.docs.map(doc => doc.data());

      return {
        totalInteractions: interactions.length,
        interactionTypes: this.getInteractionTypes(interactions),
        commonActions: this.getCommonActions(interactions),
        timeDistribution: this.getTimeDistribution(interactions)
      };
    } catch (error) {
      console.error('Fehler bei der Analyse der Benutzerinteraktionen:', error);
      return null;
    }
  }

  // Interaktionstypen analysieren
  getInteractionTypes(interactions) {
    const types = {};
    interactions.forEach(interaction => {
      types[interaction.type] = (types[interaction.type] || 0) + 1;
    });
    return types;
  }

  // Häufige Aktionen identifizieren
  getCommonActions(interactions) {
    const actions = {};
    interactions.forEach(interaction => {
      if (interaction.action) {
        actions[interaction.action] = (actions[interaction.action] || 0) + 1;
      }
    });
    return Object.entries(actions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }

  // Zeitverteilung analysieren
  getTimeDistribution(interactions) {
    const distribution = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };

    interactions.forEach(interaction => {
      const hour = interaction.timestamp.toDate().getHours();
      if (hour >= 5 && hour < 12) distribution.morning++;
      else if (hour >= 12 && hour < 17) distribution.afternoon++;
      else if (hour >= 17 && hour < 22) distribution.evening++;
      else distribution.night++;
    });

    return distribution;
  }
}

export const uxService = new UXService(); 