import { useState, useEffect, useCallback } from 'react';
import { performanceService } from '../services/performanceService';
import { useAuth } from '../contexts/AuthContext';

export const usePerformance = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [metrics, setMetrics] = useState(null);

  // Performance-Metriken sammeln und speichern
  const collectAndSaveMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const collectedMetrics = performanceService.collectMetrics();
      setMetrics(collectedMetrics);
      
      const performanceWarnings = performanceService.checkPerformanceWarnings(collectedMetrics);
      setWarnings(performanceWarnings);

      if (user) {
        await performanceService.savePerformanceMetrics({
          ...collectedMetrics,
          userId: user.uid
        });
      }
    } catch (error) {
      console.error('Fehler beim Sammeln der Performance-Metriken:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Cache-Daten abrufen
  const getCachedData = useCallback(async (key, ttl) => {
    try {
      return await performanceService.getCachedData(key, ttl);
    } catch (error) {
      console.error('Fehler beim Abrufen der Cache-Daten:', error);
      return null;
    }
  }, []);

  // Daten im Cache speichern
  const setCachedData = useCallback(async (key, data, ttl) => {
    try {
      return await performanceService.setCachedData(key, data, ttl);
    } catch (error) {
      console.error('Fehler beim Speichern der Cache-Daten:', error);
      return false;
    }
  }, []);

  // Cache invalidieren
  const invalidateCache = useCallback(async (key) => {
    try {
      return await performanceService.invalidateCache(key);
    } catch (error) {
      console.error('Fehler beim Invalidieren des Caches:', error);
      return false;
    }
  }, []);

  // Bild optimieren
  const optimizeImage = useCallback(async (imageUrl, options) => {
    try {
      return await performanceService.optimizeImage(imageUrl, options);
    } catch (error) {
      console.error('Fehler bei der Bildoptimierung:', error);
      return imageUrl;
    }
  }, []);

  // Route vorladen
  const preloadRoute = useCallback(async (route) => {
    try {
      return await performanceService.preloadRoute(route);
    } catch (error) {
      console.error('Fehler beim Vorladen der Route:', error);
      return false;
    }
  }, []);

  // Performance-Optimierungen anwenden
  const applyOptimizations = useCallback(async () => {
    try {
      return await performanceService.applyOptimizations();
    } catch (error) {
      console.error('Fehler bei der Anwendung der Optimierungen:', error);
      return false;
    }
  }, []);

  // Automatische Metriken-Sammlung
  useEffect(() => {
    const interval = setInterval(collectAndSaveMetrics, 60000); // Alle 60 Sekunden
    return () => clearInterval(interval);
  }, [collectAndSaveMetrics]);

  // Initiale Metriken-Sammlung
  useEffect(() => {
    collectAndSaveMetrics();
  }, [collectAndSaveMetrics]);

  return {
    isLoading,
    warnings,
    metrics,
    getCachedData,
    setCachedData,
    invalidateCache,
    optimizeImage,
    preloadRoute,
    applyOptimizations,
    collectAndSaveMetrics
  };
}; 