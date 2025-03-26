import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Auth,
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';

// Definiere den Typ für den Kontext
interface AuthContextType {
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// Erstelle den Kontext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook für die Verwendung des Kontexts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider-Komponente
interface AuthProviderProps {
  children: React.ReactNode;
  auth: Auth;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, auth }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initialisierung startet');
    
    if (!auth) {
      console.error('AuthProvider: Auth ist nicht verfügbar');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log('AuthProvider: Auth Status geändert:', user ? 'Benutzer angemeldet' : 'Nicht angemeldet');
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('AuthProvider: Fehler bei Auth Status Änderung:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider: Cleanup');
      unsubscribe();
    };
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Starte Anmeldung');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthProvider: Anmeldung erfolgreich');
    } catch (err: any) {
      console.error('AuthProvider: Anmeldungsfehler:', err);
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Starte Registrierung');
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('AuthProvider: Registrierung erfolgreich');
    } catch (err: any) {
      console.error('AuthProvider: Registrierungsfehler:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthProvider: Starte Abmeldung');
      await firebaseSignOut(auth);
      console.log('AuthProvider: Abmeldung erfolgreich');
    } catch (err: any) {
      console.error('AuthProvider: Abmeldungsfehler:', err);
      throw err;
    }
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 