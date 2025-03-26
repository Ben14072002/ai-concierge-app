import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

class PerformanceService {
  constructor() {
    this.performanceMetricsCollection = collection(db, 'performance_metrics');
    this.cacheCollection = collection(db, 'cache');
  }

  // Performance-Metriken speichern
  async savePerformanceMetrics(metrics) {
    try {
      const metricsRef = doc(this.performanceMetricsCollection);
      await setDoc(metricsRef, {
        ...metrics,
        timestamp: new Date(),
        userId: metrics.userId || 'system'
      });
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern der Performance-Metriken:', error);
      return false;
    }
  }

  // Cache-Strategie implementieren
  async getCachedData(key, ttl = 3600) {
    try {
      const cacheRef = doc(this.cacheCollection, key);
      const cacheDoc = await getDoc(cacheRef);
      
      if (!cacheDoc.exists()) return null;

      const cacheData = cacheDoc.data();
      const now = new Date();
      const cacheAge = (now - cacheData.timestamp.toDate()) / 1000;

      if (cacheAge > ttl) {
        await this.invalidateCache(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('Fehler beim Abrufen der Cache-Daten:', error);
      return null;
    }
  }

  // Daten im Cache speichern
  async setCachedData(key, data, ttl = 3600) {
    try {
      const cacheRef = doc(this.cacheCollection, key);
      await setDoc(cacheRef, {
        data,
        timestamp: new Date(),
        ttl
      });
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern der Cache-Daten:', error);
      return false;
    }
  }

  // Cache invalidieren
  async invalidateCache(key) {
    try {
      const cacheRef = doc(this.cacheCollection, key);
      await updateDoc(cacheRef, {
        invalidated: true,
        invalidatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Fehler beim Invalidieren des Caches:', error);
      return false;
    }
  }

  // Lazy Loading für Bilder
  async optimizeImage(imageUrl, options = {}) {
    const {
      width = 800,
      quality = 80,
      format = 'webp'
    } = options;

    // Hier würde die eigentliche Bildoptimierung implementiert
    // Für das MVP geben wir die URL unverändert zurück
    return imageUrl;
  }

  // Code-Splitting für Routen
  async preloadRoute(route) {
    try {
      // Hier würde die Route-Vorladung implementiert
      return true;
    } catch (error) {
      console.error('Fehler beim Vorladen der Route:', error);
      return false;
    }
  }

  // Performance-Metriken sammeln
  collectMetrics() {
    const metrics = {
      timestamp: new Date(),
      pageLoad: performance.now(),
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null,
      navigation: performance.getEntriesByType('navigation')[0] || null,
      resources: performance.getEntriesByType('resource') || [],
      paint: performance.getEntriesByType('paint') || []
    };

    return metrics;
  }

  // Performance-Warnungen überprüfen
  checkPerformanceWarnings(metrics) {
    const warnings = [];

    if (metrics.pageLoad > 3000) {
      warnings.push({
        type: 'load_time',
        message: 'Seitenladezeit über 3 Sekunden',
        value: metrics.pageLoad
      });
    }

    if (metrics.memory && metrics.memory.used > metrics.memory.total * 0.8) {
      warnings.push({
        type: 'memory_usage',
        message: 'Hohe Speichernutzung',
        value: metrics.memory.used
      });
    }

    const largeResources = metrics.resources.filter(r => r.duration > 1000);
    if (largeResources.length > 0) {
      warnings.push({
        type: 'slow_resources',
        message: `${largeResources.length} langsame Ressourcen gefunden`,
        resources: largeResources
      });
    }

    return warnings;
  }

  // Performance-Optimierungen anwenden
  async applyOptimizations() {
    try {
      // Service Worker für Offline-Funktionalität
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/service-worker.js');
      }

      // Preconnect zu wichtigen Domains
      const preconnectLinks = [
        'https://firebase.googleapis.com',
        'https://maps.googleapis.com'
      ];

      preconnectLinks.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      });

      return true;
    } catch (error) {
      console.error('Fehler bei der Anwendung der Optimierungen:', error);
      return false;
    }
  }
}

export const performanceService = new PerformanceService(); 