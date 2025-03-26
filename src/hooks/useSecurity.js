import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { securityService } from '../services/securityService';
import { useTranslation } from 'react-i18next';

export const useSecurity = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkPermissions = useCallback(async (resourceType, resourceId) => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const hasPermission = await securityService.checkUserPermissions(
        user.uid,
        resourceType,
        resourceId
      );
      return hasPermission;
    } catch (err) {
      setError(t('security.errors.security_error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, t]);

  const validateData = useCallback((data) => {
    const result = securityService.validateSecurityPolicy(data);
    if (!result.isValid) {
      setError(result.errors.map(error => t(`security.errors.${error}`)).join(', '));
    }
    return result.isValid;
  }, [t]);

  const encryptData = useCallback((data) => {
    return securityService.encryptSensitiveData(data);
  }, []);

  const decryptData = useCallback((data) => {
    return securityService.decryptSensitiveData(data);
  }, []);

  return {
    isLoading,
    error,
    checkPermissions,
    validateData,
    encryptData,
    decryptData
  };
}; 