import { loadStripe } from '@stripe/stripe-js';
import { Booking } from '../types/booking';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Stripe Public Key - Dies sollte in einer Umgebungsvariable gespeichert werden
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const createPaymentIntent = async (booking: Omit<Booking, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await fetch(`${API_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: booking.totalPrice * 100, // Stripe erwartet Cents
        currency: 'eur',
        booking: booking,
      }),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Zahlungsabsicht');
    }

    const data = await response.json();
    return data.clientSecret;
  } catch (error) {
    console.error('Fehler bei der Zahlungsabwicklung:', error);
    throw error;
  }
};

export const confirmPayment = async (clientSecret: string, paymentMethodId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSecret,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error('Fehler bei der Zahlungsbestätigung');
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler bei der Zahlungsbestätigung:', error);
    throw error;
  }
};

export const getStripe = () => stripePromise; 