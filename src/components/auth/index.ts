export { default as Login } from './Login';
export { default as Register } from './Register';
export { default as PrivateRoute } from './PrivateRoute';

// Beispiel für BookingForm
interface BookingFormProps {
  affiliateId: string;
  propertyId: string;
  propertyName: string;
  propertyType: 'airbnb' | 'hotel';
  checkIn: Date;
  checkOut: Date;
  guests: number;
  price: number;
} 

// Beispiel für Rate Limiting
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100 // Limit pro IP
}; 

// Beispiel für Jest-Konfiguration
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
}; 