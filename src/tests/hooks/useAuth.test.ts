import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '@/hooks/useAuth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

describe('useAuth', () => {
  const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
  };

  const mockAuth = {
    currentUser: mockUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  it('initializes with current user', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('initializes without user', () => {
    (getAuth as jest.Mock).mockReturnValue({ currentUser: null });
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles login successfully', async () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login(mockCredentials.email, mockCredentials.password);
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      mockCredentials.email,
      mockCredentials.password
    );
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles login error', async () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const mockError = new Error('Invalid credentials');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login(mockCredentials.email, mockCredentials.password).catch(() => {});
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      mockCredentials.email,
      mockCredentials.password
    );
    expect(result.current.error).toBeTruthy();
  });

  it('handles registration successfully', async () => {
    const mockCredentials = {
      email: 'new@example.com',
      password: 'password123',
      displayName: 'New User',
    };

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { ...mockUser, ...mockCredentials },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register(
        mockCredentials.email,
        mockCredentials.password,
        mockCredentials.displayName
      );
    });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      mockCredentials.email,
      mockCredentials.password
    );
    expect(result.current.user).toEqual({ ...mockUser, ...mockCredentials });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles registration error', async () => {
    const mockCredentials = {
      email: 'existing@example.com',
      password: 'password123',
      displayName: 'Existing User',
    };

    const mockError = new Error('Email already in use');
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current
        .register(mockCredentials.email, mockCredentials.password, mockCredentials.displayName)
        .catch(() => {});
    });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      mockCredentials.email,
      mockCredentials.password
    );
    expect(result.current.error).toBeTruthy();
  });

  it('handles logout successfully', async () => {
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(signOut).toHaveBeenCalledWith(mockAuth);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles logout error', async () => {
    const mockError = new Error('Failed to sign out');
    (signOut as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout().catch(() => {});
    });

    expect(signOut).toHaveBeenCalledWith(mockAuth);
    expect(result.current.error).toBeTruthy();
  });

  it('updates user state on auth state change', () => {
    const mockAuthStateChange = jest.fn();
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      mockAuthStateChange(auth, callback);
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    expect(onAuthStateChanged).toHaveBeenCalledWith(mockAuth, expect.any(Function));
    expect(mockAuthStateChange).toHaveBeenCalledWith(mockAuth, expect.any(Function));
  });

  it('cleans up auth state listener on unmount', () => {
    const mockUnsubscribe = jest.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe);

    const { unmount } = renderHook(() => useAuth());

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('handles email verification', async () => {
    const mockUserWithEmailVerification = {
      ...mockUser,
      emailVerified: false,
      sendEmailVerification: jest.fn(),
    };

    (getAuth as jest.Mock).mockReturnValue({
      currentUser: mockUserWithEmailVerification,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.sendVerificationEmail();
    });

    expect(mockUserWithEmailVerification.sendEmailVerification).toHaveBeenCalled();
  });

  it('handles password reset', async () => {
    const mockSendPasswordResetEmail = jest.fn();
    (getAuth as jest.Mock).mockReturnValue({
      ...mockAuth,
      sendPasswordResetEmail: mockSendPasswordResetEmail,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('handles profile update', async () => {
    const mockUpdateProfile = jest.fn();
    (getAuth as jest.Mock).mockReturnValue({
      ...mockAuth,
      currentUser: {
        ...mockUser,
        updateProfile: mockUpdateProfile,
      },
    });

    const { result } = renderHook(() => useAuth());

    const updates = {
      displayName: 'Updated Name',
      photoURL: 'https://example.com/new-photo.jpg',
    };

    await act(async () => {
      await result.current.updateProfile(updates);
    });

    expect(mockUpdateProfile).toHaveBeenCalledWith(updates);
  });
}); 