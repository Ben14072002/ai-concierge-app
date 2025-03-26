import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { securityService } from './securityService';

class PrivacyService {
  constructor() {
    this.privacyConsentsCollection = collection(db, 'privacy_consents');
    this.dataDeletionRequestsCollection = collection(db, 'data_deletion_requests');
    this.dataAccessRequestsCollection = collection(db, 'data_access_requests');
    this.privacySettingsCollection = collection(db, 'privacy_settings');
  }

  // Datenschutz-Region bestimmen
  async determinePrivacyRegion(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return 'EU'; // Standardmäßig EU-Standards

      const userData = userDoc.data();
      const country = userData.country || 'EU';
      
      // Region basierend auf Land bestimmen
      const regions = {
        EU: ['DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'DK', 'SE', 'FI', 'PT', 'IE', 'GR', 'AT', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'CY', 'EE', 'LV', 'LT', 'LU', 'MT'],
        UK: ['GB'],
        US: ['US'],
        CA: ['CA'],
        AU: ['AU'],
        NZ: ['NZ'],
        JP: ['JP'],
        KR: ['KR'],
        BR: ['BR'],
        default: ['EU']
      };

      for (const [region, countries] of Object.entries(regions)) {
        if (countries.includes(country)) {
          return region;
        }
      }

      return 'default';
    } catch (error) {
      console.error('Error determining privacy region:', error);
      return 'EU'; // Im Fehlerfall EU-Standards
    }
  }

  // Datenschutz-Einstellungen speichern
  async savePrivacySettings(userId, settings) {
    try {
      const region = await this.determinePrivacyRegion(userId);
      const settingsRef = doc(this.privacySettingsCollection);
      
      await setDoc(settingsRef, {
        userId,
        region,
        settings,
        lastUpdated: new Date(),
        version: '1.0'
      });
      return true;
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      return false;
    }
  }

  // Einwilligung speichern (erweitert)
  async saveConsent(userId, consentData) {
    try {
      const region = await this.determinePrivacyRegion(userId);
      const consentRef = doc(this.privacyConsentsCollection);
      
      await setDoc(consentRef, {
        userId,
        region,
        ...consentData,
        timestamp: new Date(),
        ipAddress: await securityService.getClientIP(),
        version: '1.0',
        legalBasis: this.getLegalBasis(region, consentData.type)
      });
      return true;
    } catch (error) {
      console.error('Error saving privacy consent:', error);
      return false;
    }
  }

  // Rechtliche Grundlage basierend auf Region bestimmen
  getLegalBasis(region, consentType) {
    const legalBases = {
      EU: {
        marketing: 'Art. 6(1)(a) DSGVO',
        analytics: 'Art. 6(1)(f) DSGVO',
        necessary: 'Art. 6(1)(b) DSGVO'
      },
      UK: {
        marketing: 'UK GDPR Art. 6(1)(a)',
        analytics: 'UK GDPR Art. 6(1)(f)',
        necessary: 'UK GDPR Art. 6(1)(b)'
      },
      US: {
        marketing: 'CCPA Section 1798.100',
        analytics: 'CCPA Section 1798.100',
        necessary: 'CCPA Section 1798.100'
      },
      CA: {
        marketing: 'PIPEDA Principle 4.3',
        analytics: 'PIPEDA Principle 4.3',
        necessary: 'PIPEDA Principle 4.3'
      },
      default: {
        marketing: 'Art. 6(1)(a) DSGVO',
        analytics: 'Art. 6(1)(f) DSGVO',
        necessary: 'Art. 6(1)(b) DSGVO'
      }
    };

    return legalBases[region]?.[consentType] || legalBases.default[consentType];
  }

  // Datenschutzerklärung generieren (erweitert)
  generatePrivacyPolicy(region) {
    const policies = {
      EU: {
        version: '1.0',
        lastUpdated: new Date(),
        sections: [
          {
            title: 'Datenerhebung (DSGVO)',
            content: 'Wir erheben folgende Daten gemäß DSGVO: [Details]'
          },
          {
            title: 'Rechtliche Grundlage',
            content: 'Die Verarbeitung erfolgt auf Grundlage von: [Details]'
          },
          {
            title: 'Ihre Rechte nach DSGVO',
            content: 'Sie haben folgende Rechte: [Details]'
          }
        ]
      },
      UK: {
        version: '1.0',
        lastUpdated: new Date(),
        sections: [
          {
            title: 'Data Collection (UK GDPR)',
            content: 'We collect the following data under UK GDPR: [Details]'
          },
          {
            title: 'Legal Basis',
            content: 'Processing is based on: [Details]'
          },
          {
            title: 'Your Rights under UK GDPR',
            content: 'You have the following rights: [Details]'
          }
        ]
      },
      US: {
        version: '1.0',
        lastUpdated: new Date(),
        sections: [
          {
            title: 'Data Collection (CCPA)',
            content: 'We collect the following data under CCPA: [Details]'
          },
          {
            title: 'Your Rights under CCPA',
            content: 'You have the following rights: [Details]'
          }
        ]
      },
      default: {
        version: '1.0',
        lastUpdated: new Date(),
        sections: [
          {
            title: 'Data Collection',
            content: 'We collect the following data: [Details]'
          },
          {
            title: 'Your Rights',
            content: 'You have the following rights: [Details]'
          }
        ]
      }
    };

    return policies[region] || policies.default;
  }

  // Daten exportieren (erweitert)
  async exportUserData(userId) {
    try {
      const region = await this.determinePrivacyRegion(userId);
      const userData = {
        profile: await this.getUserProfile(userId),
        consents: await this.getConsents(userId),
        activities: await this.getUserActivities(userId),
        preferences: await this.getUserPreferences(userId),
        privacyRegion: region,
        exportDate: new Date(),
        applicableLaws: this.getApplicableLaws(region)
      };

      return securityService.encryptSensitiveData(userData);
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }

  // Anwendbare Gesetze basierend auf Region
  getApplicableLaws(region) {
    const laws = {
      EU: ['DSGVO', 'ePrivacy-Verordnung'],
      UK: ['UK GDPR', 'Data Protection Act 2018'],
      US: ['CCPA', 'CPRA', 'State Privacy Laws'],
      CA: ['PIPEDA', 'Provincial Privacy Laws'],
      AU: ['Privacy Act 1988', 'Australian Privacy Principles'],
      NZ: ['Privacy Act 2020', 'Information Privacy Principles'],
      JP: ['APPI', 'Personal Information Protection Act'],
      KR: ['PIPA', 'Personal Information Protection Act'],
      BR: ['LGPD', 'Lei Geral de Proteção de Dados']
    };

    return laws[region] || laws.EU;
  }

  // Einwilligungen abrufen
  async getConsents(userId) {
    try {
      const q = query(this.privacyConsentsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting privacy consents:', error);
      return [];
    }
  }

  // Datenzugriffsanfrage erstellen
  async createDataAccessRequest(userId, requestDetails) {
    try {
      const requestRef = doc(this.dataAccessRequestsCollection);
      await setDoc(requestRef, {
        userId,
        ...requestDetails,
        status: 'pending',
        createdAt: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 Tage Frist
      });
      return true;
    } catch (error) {
      console.error('Error creating data access request:', error);
      return false;
    }
  }

  // Datenlöschungsanfrage erstellen
  async createDataDeletionRequest(userId, requestDetails) {
    try {
      const requestRef = doc(this.dataDeletionRequestsCollection);
      await setDoc(requestRef, {
        userId,
        ...requestDetails,
        status: 'pending',
        createdAt: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 Tage Frist
      });
      return true;
    } catch (error) {
      console.error('Error creating data deletion request:', error);
      return false;
    }
  }

  // Daten löschen (DSGVO Art. 17)
  async deleteUserData(userId) {
    try {
      // Alle Benutzerdaten löschen
      await this.deleteUserProfile(userId);
      await this.deleteUserConsents(userId);
      await this.deleteUserActivities(userId);
      await this.deleteUserPreferences(userId);
      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  }

  // Einwilligung widerrufen
  async revokeConsent(userId, consentId) {
    try {
      const consentRef = doc(this.privacyConsentsCollection, consentId);
      await updateDoc(consentRef, {
        revoked: true,
        revokedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error revoking consent:', error);
      return false;
    }
  }

  // Cookie-Einstellungen speichern
  async saveCookiePreferences(userId, preferences) {
    try {
      const consentRef = doc(this.privacyConsentsCollection);
      await setDoc(consentRef, {
        userId,
        type: 'cookies',
        preferences,
        timestamp: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
      return false;
    }
  }
}

export const privacyService = new PrivacyService(); 