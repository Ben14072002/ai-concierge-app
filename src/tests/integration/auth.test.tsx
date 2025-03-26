import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Login from '../../components/auth/Login';
import Register from '../../components/auth/Register';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Dashboard from '../../components/dashboard/Dashboard';
import { Auth, User, UserCredential } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Erweiterte User-Type für Tests
interface MockUser extends Partial<User> {
  updateProfile?: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
}

// Erweiterte Auth-Type für Tests
interface MockAuth {
  currentUser: MockUser | null;
  signInWithEmailAndPassword: jest.Mock;
  createUserWithEmailAndPassword: jest.Mock;
  signOut: jest.Mock;
  onAuthStateChanged: jest.Mock;
  tenantId: string | null;
  app: any;
  name: string;
  config: object;
}

// Mock Auth Instanz
const mockAuth: MockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  tenantId: null,
  app: {},
  name: 'mock-auth',
  config: {}
};

// Test App Komponente für Routing Tests
const TestApp = () => {
  return (
    <AuthProvider auth={mockAuth as unknown as Auth}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
};

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.currentUser = null;
  });

  describe('Login Flow', () => {
    it('sollte bei erfolgreicher Anmeldung zum Dashboard navigieren', async () => {
      const mockUser: MockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
      };

      mockAuth.signInWithEmailAndPassword.mockResolvedValueOnce({
        user: mockUser,
      } as UserCredential);

      const { getByLabelText, getByRole } = render(
        <MemoryRouter initialEntries={['/login']}>
          <TestApp />
        </MemoryRouter>
      );

      await userEvent.type(getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(getByLabelText(/password/i), 'password123');
      await userEvent.click(getByRole('button', { name: /anmelden/i }));

      expect(window.location.pathname).toBe('/dashboard');
    });

    it('sollte Fehlermeldung bei ungültigen Anmeldedaten anzeigen', async () => {
      const mockError = new Error('Invalid credentials');
      mockAuth.signInWithEmailAndPassword.mockRejectedValueOnce(mockError);

      const { getByLabelText, getByRole, findByText } = render(
        <MemoryRouter initialEntries={['/login']}>
          <TestApp />
        </MemoryRouter>
      );

      await userEvent.type(getByLabelText(/email/i), 'wrong@example.com');
      await userEvent.type(getByLabelText(/password/i), 'wrongpassword');
      await userEvent.click(getByRole('button', { name: /anmelden/i }));

      const errorMessage = await findByText(/ungültige anmeldedaten/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Register Flow', () => {
    it('sollte bei erfolgreicher Registrierung zum Dashboard navigieren', async () => {
      const mockUser: MockUser = {
        uid: 'new-test-uid',
        email: 'newuser@example.com',
        updateProfile: jest.fn().mockResolvedValueOnce(undefined),
      };

      mockAuth.createUserWithEmailAndPassword.mockResolvedValueOnce({
        user: mockUser,
      } as UserCredential);

      const { getByLabelText, getByRole } = render(
        <MemoryRouter initialEntries={['/register']}>
          <TestApp />
        </MemoryRouter>
      );

      await userEvent.type(getByLabelText(/display name/i), 'Test User');
      await userEvent.type(getByLabelText(/email/i), 'newuser@example.com');
      await userEvent.type(getByLabelText(/password/i), 'password123');
      await userEvent.click(getByRole('button', { name: /registrieren/i }));

      expect(window.location.pathname).toBe('/dashboard');
    });

    it('sollte Fehlermeldung bei existierender E-Mail-Adresse anzeigen', async () => {
      const mockError = new Error('Email already in use');
      mockAuth.createUserWithEmailAndPassword.mockRejectedValueOnce(mockError);

      const { getByLabelText, getByRole, findByText } = render(
        <MemoryRouter initialEntries={['/register']}>
          <TestApp />
        </MemoryRouter>
      );

      await userEvent.type(getByLabelText(/display name/i), 'Test User');
      await userEvent.type(getByLabelText(/email/i), 'existing@example.com');
      await userEvent.type(getByLabelText(/password/i), 'password123');
      await userEvent.click(getByRole('button', { name: /registrieren/i }));

      const errorMessage = await findByText(/e-mail-adresse wird bereits verwendet/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    it('sollte nicht angemeldete Benutzer zum Login umleiten', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <TestApp />
        </MemoryRouter>
      );

      expect(window.location.pathname).toBe('/login');
    });

    it('sollte angemeldete Benutzer zum Dashboard durchlassen', () => {
      const mockUser: MockUser = { uid: 'test-uid' };
      mockAuth.currentUser = mockUser;

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <TestApp />
        </MemoryRouter>
      );

      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  describe('Auth State Changes', () => {
    it('sollte bei Logout zum Login umleiten', async () => {
      const mockUser: MockUser = { uid: 'test-uid' };
      mockAuth.currentUser = mockUser;
      mockAuth.signOut.mockResolvedValueOnce(undefined);

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <TestApp />
        </MemoryRouter>
      );

      mockAuth.currentUser = null;
      await mockAuth.signOut();

      expect(window.location.pathname).toBe('/login');
    });
  });

  describe('Loading States', () => {
    it('sollte Ladeindikator während der Anmeldung anzeigen', async () => {
      mockAuth.signInWithEmailAndPassword.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { getByLabelText, getByRole } = render(
        <MemoryRouter initialEntries={['/login']}>
          <TestApp />
        </MemoryRouter>
      );

      await userEvent.type(getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(getByLabelText(/password/i), 'password123');
      
      const submitButton = getByRole('button', { name: /anmelden/i });
      await userEvent.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/submitting/i);
    });
  });

  describe('Error Handling', () => {
    it('sollte Netzwerkfehler korrekt behandeln', async () => {
      const networkError = new Error('Network Error');
      mockAuth.signInWithEmailAndPassword.mockRejectedValueOnce(networkError);

      const { getByLabelText, getByRole, findByText } = render(
        <MemoryRouter initialEntries={['/login']}>
          <TestApp />
        </MemoryRouter>
      );

      await userEvent.type(getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(getByLabelText(/password/i), 'password123');
      await userEvent.click(getByRole('button', { name: /anmelden/i }));

      const errorMessage = await findByText(/Network Error/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('sollte Firebase-spezifische Fehler korrekt behandeln', async () => {
      const firebaseError = {
        code: 'auth/too-many-requests',
        message: 'Access to this account has been temporarily disabled.'
      };
      mockAuth.signInWithEmailAndPassword.mockRejectedValueOnce(firebaseError);

      const { getByLabelText, getByRole, findByText } = render(
        <MemoryRouter initialEntries={['/login']}>
          <TestApp />
        </MemoryRouter>
      );

      await userEvent.type(getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(getByLabelText(/password/i), 'password123');
      await userEvent.click(getByRole('button', { name: /anmelden/i }));

      const errorMessage = await findByText(/temporarily disabled/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('sollte zur Registrierungsseite navigieren wenn der Link geklickt wird', async () => {
      const { getByRole } = render(
        <MemoryRouter initialEntries={['/login']}>
          <TestApp />
        </MemoryRouter>
      );

      await userEvent.click(getByRole('button', { name: /register/i }));
      expect(window.location.pathname).toBe('/register');
    });

    it('sollte angemeldete Benutzer vom Login zum Dashboard umleiten', () => {
      const mockUser: MockUser = { uid: 'test-uid' };
      mockAuth.currentUser = mockUser;

      render(
        <MemoryRouter initialEntries={['/login']}>
          <TestApp />
        </MemoryRouter>
      );

      expect(window.location.pathname).toBe('/dashboard');
    });
  });
}); 