import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { feedbackService } from './feedbackService';

class SecurityService {
  constructor() {
    this.usersCollection = collection(db, 'users');
    this.securityLogsCollection = collection(db, 'security_logs');
  }

  // Benutzerrechte überprüfen
  async checkUserPermissions(userId, resourceType, resourceId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await this.logSecurityEvent(userId, 'unauthorized_access', {
          resourceType,
          resourceId,
          reason: 'user_not_found'
        });
        return false;
      }

      const userData = userDoc.data();
      
      // Host kann nur auf seine eigenen Ressourcen zugreifen
      if (resourceType === 'affiliate' || resourceType === 'booking') {
        const resourceRef = doc(db, resourceType + 's', resourceId);
        const resourceDoc = await getDoc(resourceRef);
        
        if (!resourceDoc.exists()) {
          await this.logSecurityEvent(userId, 'unauthorized_access', {
            resourceType,
            resourceId,
            reason: 'resource_not_found'
          });
          return false;
        }

        const resourceData = resourceDoc.data();
        if (resourceData.hostId !== userId) {
          await this.logSecurityEvent(userId, 'unauthorized_access', {
            resourceType,
            resourceId,
            reason: 'host_mismatch'
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      await this.logSecurityEvent(userId, 'security_error', {
        error: error.message,
        resourceType,
        resourceId
      });
      return false;
    }
  }

  // Sicherheitsereignisse protokollieren
  async logSecurityEvent(userId, eventType, details) {
    try {
      await addDoc(this.securityLogsCollection, {
        userId,
        eventType,
        details,
        timestamp: new Date(),
        ipAddress: await this.getClientIP()
      });
    } catch (error) {
      console.error('Error logging security event:', error);
      feedbackService.logError(error, 'Security logging');
    }
  }

  // IP-Adresse des Clients abrufen (über einen externen Service)
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting client IP:', error);
      return 'unknown';
    }
  }

  // Sensitive Daten verschlüsseln
  encryptSensitiveData(data) {
    // Hier würde die eigentliche Verschlüsselung implementiert
    // Für das MVP verwenden wir eine einfache Maskierung
    return {
      ...data,
      creditCard: data.creditCard ? '****-****-****-' + data.creditCard.slice(-4) : undefined,
      password: data.password ? '********' : undefined
    };
  }

  // Sensitive Daten entschlüsseln
  decryptSensitiveData(data) {
    // Hier würde die eigentliche Entschlüsselung implementiert
    // Für das MVP geben wir die Daten unverändert zurück
    return data;
  }

  // Sicherheitsrichtlinien überprüfen
  validateSecurityPolicy(data) {
    const errors = [];

    // Passwort-Komplexität prüfen
    if (data.password) {
      if (data.password.length < 8) {
        errors.push('password_too_short');
      }
      if (!/[A-Z]/.test(data.password)) {
        errors.push('password_no_uppercase');
      }
      if (!/[a-z]/.test(data.password)) {
        errors.push('password_no_lowercase');
      }
      if (!/[0-9]/.test(data.password)) {
        errors.push('password_no_number');
      }
    }

    // E-Mail-Format prüfen
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('invalid_email');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const securityService = new SecurityService(); 