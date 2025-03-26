import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { RateLimiter } from 'limiter';
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Rate Limiter Konfiguration
const limiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 'hour'
});

// CSRF Token Management
const csrfTokens = new Map<string, string>();

export const generateCSRFToken = (userId: string): string => {
  const token = Math.random().toString(36).substring(2);
  csrfTokens.set(userId, token);
  return token;
};

export const validateCSRFToken = (userId: string, token: string): boolean => {
  const storedToken = csrfTokens.get(userId);
  return storedToken === token;
};

// XSS Schutz
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

// Rate Limiting Middleware
export const checkRateLimit = async (userId: string): Promise<boolean> => {
  try {
    const hasToken = await limiter.tryRemoveTokens(1);
    return hasToken;
  } catch (error) {
    console.error('Rate limit error:', error);
    return false;
  }
};

// Input Validierung
export const validateBookingInput = z.object({
  propertyId: z.string().min(1),
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1).max(10),
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(['credit_card', 'paypal'])
});

export const validateFeedbackInput = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(500),
  cleanliness: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  location: z.number().min(1).max(5),
  amenities: z.number().min(1).max(5)
});

// Security Headers
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
}; 