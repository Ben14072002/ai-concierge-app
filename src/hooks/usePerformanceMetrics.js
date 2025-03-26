import { useEffect, useCallback } from 'react';
import { performanceService } from '../services/performanceService';
import { useAuth } from '../contexts/AuthContext';

export const usePerformanceMetrics = () => {
  const { user } = useAuth();

  // Performance-Metriken sammeln
  const collectMetrics = useCallback(() => {
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
  }, []);

  // Performance-Warnungen überprüfen
  const checkWarnings = useCallback((metrics) => {
    const warnings = [];

    // Ladezeit-Warnung
    if (metrics.pageLoad > 3000) {
      warnings.push({
        type: 'load_time',
        message: 'Seitenladezeit über 3 Sekunden',
        value: metrics.pageLoad
      });
    }

    // Speichernutzung-Warnung
    if (metrics.memory && metrics.memory.used > metrics.memory.total * 0.8) {
      warnings.push({
        type: 'memory_usage',
        message: 'Hohe Speichernutzung',
        value: metrics.memory.used
      });
    }

    // Ressourcen-Warnung
    const largeResources = metrics.resources.filter(r => r.duration > 1000);
    if (largeResources.length > 0) {
      warnings.push({
        type: 'slow_resources',
        message: `${largeResources.length} langsame Ressourcen gefunden`,
        resources: largeResources
      });
    }

    return warnings;
  }, []);

  // Performance-Metriken speichern
  const saveMetrics = useCallback(async (metrics) => {
    if (!user) return;
    
    try {
      await performanceService.savePerformanceMetrics({
        ...metrics,
        userId: user.uid
      });
    } catch (error) {
      console.error('Fehler beim Speichern der Performance-Metriken:', error);
    }
  }, [user]);

  // Automatische Metriken-Sammlung
  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = collectMetrics();
      const warnings = checkWarnings(metrics);
      
      if (warnings.length > 0) {
        console.warn('Performance-Warnungen:', warnings);
      }
      
      saveMetrics(metrics);
    }, 60000); // Alle 60 Sekunden

    return () => clearInterval(interval);
  }, [collectMetrics, checkWarnings, saveMetrics]);

  // Initiale Metriken-Sammlung
  useEffect(() => {
    const metrics = collectMetrics();
    saveMetrics(metrics);
  }, [collectMetrics, saveMetrics]);

  return {
    collectMetrics,
    checkWarnings,
    saveMetrics
  };
}; 