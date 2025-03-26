import { useState, useEffect } from 'react';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendEmailVerification,
  updateProfile,
  User
} from 'firebase/auth';
import { AuthState, RegisterFormData, SocialProvider, RegistrationOptions } from '../types';

const DEFAULT_OPTIONS: RegistrationOptions = {
  requireEmailVerification: true,
  enableSocialLogin: true,
  passwordRequirements: {
    minLength: 8,
    requireNumbers: true,
    requireSpecialChars: true,
    requireUppercase: true
  }
};

export const useAuth = (auth: Auth, options: RegistrationOptions = DEFAULT_OPTIONS) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    verificationEmailSent: false
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        console.log('Auth Status geändert:', user ? 'Angemeldet' : 'Nicht angemeldet');
        setState(prev => ({ ...prev, user, loading: false }));
      },
      (error) => {
        console.error('Auth Status Fehler:', error);
        setState(prev => ({ ...prev, error: error.message, loading: false }));
      }
    );

    return () => unsubscribe();
  }, [auth]);

  const validatePassword = (password: string): string | null => {
    const { passwordRequirements } = options;
    
    if (password.length < passwordRequirements.minLength) {
      return `Das Passwort muss mindestens ${passwordRequirements.minLength} Zeichen lang sein`;
    }
    
    if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
      return 'Das Passwort muss mindestens eine Zahl enthalten';
    }
    
    if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Das Passwort muss mindestens ein Sonderzeichen enthalten';
    }
    
    if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
      return 'Das Passwort muss mindestens einen Großbuchstaben enthalten';
    }

    return null;
  };

  const register = async (data: RegisterFormData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Passwort-Validierung
      const passwordError = validatePassword(data.password);
      if (passwordError) {
        throw new Error(passwordError);
      }

      // Registrierung
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Profil aktualisieren
      await updateProfile(user, {
        displayName: data.displayName
      });

      // Benutzerdaten in Firestore speichern
      // TODO: Implementieren Sie die Firestore-Funktion
      
      // E-Mail-Verifizierung
      if (options.requireEmailVerification) {
        await sendEmailVerification(user);
        setState(prev => ({ ...prev, verificationEmailSent: true }));
      }

      setState(prev => ({ 
        ...prev, 
        user,
        loading: false,
        error: null
      }));

      return user;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false
      }));
      throw error;
    }
  };

  const loginWithSocialProvider = async (provider: SocialProvider) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        case 'facebook':
          authProvider = new FacebookAuthProvider();
          break;
        default:
          throw new Error('Nicht unterstützter Provider');
      }

      const result = await signInWithPopup(auth, authProvider);
      setState(prev => ({ 
        ...prev, 
        user: result.user,
        loading: false,
        error: null
      }));

      return result.user;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false
      }));
      throw error;
    }
  };

  return {
    ...state,
    register,
    loginWithSocialProvider
  };
}; 