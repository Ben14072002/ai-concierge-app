import { useState, useEffect, useCallback } from 'react';
import { uxService } from '../services/uxService';
import { useAuth } from '../contexts/AuthContext';

export const useUX = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [accessibility, setAccessibility] = useState(null);
  const [interactions, setInteractions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Benutzereinstellungen laden
  const loadUserPreferences = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userPreferences = await uxService.getUserPreferences(user.uid);
      setPreferences(userPreferences);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzereinstellungen:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Benutzereinstellungen speichern
  const saveUserPreferences = useCallback(async (newPreferences) => {
    if (!user) return false;
    setIsLoading(true);
    try {
      const success = await uxService.saveUserPreferences(user.uid, newPreferences);
      if (success) {
        setPreferences(newPreferences);
      }
      return success;
    } catch (error) {
      console.error('Fehler beim Speichern der Benutzereinstellungen:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Barrierefreiheit-Einstellungen laden
  const loadAccessibilitySettings = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const settings = await uxService.getAccessibilitySettings(user.uid);
      setAccessibility(settings);
    } catch (error) {
      console.error('Fehler beim Laden der Barrierefreiheit-Einstellungen:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Barrierefreiheit-Einstellungen speichern
  const saveAccessibilitySettings = useCallback(async (newSettings) => {
    if (!user) return false;
    setIsLoading(true);
    try {
      const success = await uxService.saveAccessibilitySettings(user.uid, newSettings);
      if (success) {
        setAccessibility(newSettings);
      }
      return success;
    } catch (error) {
      console.error('Fehler beim Speichern der Barrierefreiheit-Einstellungen:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Benutzerinteraktion protokollieren
  const logInteraction = useCallback(async (interaction) => {
    if (!user) return false;
    try {
      return await uxService.logUserInteraction(user.uid, interaction);
    } catch (error) {
      console.error('Fehler beim Protokollieren der Benutzerinteraktion:', error);
      return false;
    }
  }, [user]);

  // Benutzerinteraktionen analysieren
  const analyzeInteractions = useCallback(async () => {
    if (!user) return null;
    setIsLoading(true);
    try {
      const analysis = await uxService.analyzeUserInteractions(user.uid);
      setInteractions(analysis);
      return analysis;
    } catch (error) {
      console.error('Fehler bei der Analyse der Benutzerinteraktionen:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initiale Ladung der Einstellungen
  useEffect(() => {
    loadUserPreferences();
    loadAccessibilitySettings();
  }, [loadUserPreferences, loadAccessibilitySettings]);

  return {
    preferences,
    accessibility,
    interactions,
    isLoading,
    saveUserPreferences,
    saveAccessibilitySettings,
    logInteraction,
    analyzeInteractions
  };
}; 