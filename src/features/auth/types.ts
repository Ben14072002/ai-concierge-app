import { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  verificationEmailSent: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  userType: 'airbnb' | 'hotel';
  acceptTerms: boolean;
}

export interface RegistrationOptions {
  requireEmailVerification: boolean;
  enableSocialLogin: boolean;
  passwordRequirements: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    requireUppercase: boolean;
  };
}

export type SocialProvider = 'google' | 'facebook' | 'apple'; 