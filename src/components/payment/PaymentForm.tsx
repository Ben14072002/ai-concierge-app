import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Booking } from '../../types/booking';
import { createPaymentIntent, confirmPayment } from '../../services/paymentService';

interface PaymentFormProps {
  booking: Omit<Booking, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ booking, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  React.useEffect(() => {
    const initializePayment = async () => {
      try {
        const secret = await createPaymentIntent(booking);
        setClientSecret(secret);
      } catch (error) {
        onError(error instanceof Error ? error : new Error('Fehler bei der Zahlungsinitialisierung'));
      }
    };

    initializePayment();
  }, [booking, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
        },
      });

      if (submitError) {
        throw submitError;
      }

      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Fehler bei der Zahlungsabwicklung'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Zahlungsinformationen</h2>
        <PaymentElement />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Buchungsübersicht</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Gesamtpreis</span>
            <span className="font-medium">{booking.totalPrice}€</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Anreise</span>
            <span className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Abreise</span>
            <span className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gäste</span>
            <span className="font-medium">{booking.guests}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          !stripe || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors`}
      >
        {isProcessing ? 'Wird verarbeitet...' : 'Jetzt buchen'}
      </button>
    </form>
  );
};

export default PaymentForm; 