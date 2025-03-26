import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { AffiliateBooking, BookingStatus } from '../../types/booking';
import { useAuth } from '../../contexts/AuthContext';

// Schema für das Formular
const bookingSchema = z.object({
  checkIn: z.date().min(new Date(), 'Check-in Datum muss in der Zukunft liegen'),
  checkOut: z.date().min(new Date(), 'Check-out Datum muss in der Zukunft liegen'),
  guests: z.number().min(1, 'Mindestens 1 Gast erforderlich').max(10, 'Maximal 10 Gäste'),
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(['credit_card', 'paypal']),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  affiliateId: string;
  propertyId: string;
  propertyName: string;
  propertyType: 'hotel' | 'airbnb';
  price: number;
  currency: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  affiliateId,
  propertyId,
  propertyName,
  propertyType,
  price,
  currency,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: new Date(),
      checkOut: new Date(),
      guests: 1,
      specialRequests: '',
      paymentMethod: 'credit_card',
    },
  });

  const checkInDate = watch('checkIn');

  const onSubmitForm = async (data: BookingFormData) => {
    if (!user?.uid) {
      setError('Benutzer muss angemeldet sein');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const booking: AffiliateBooking = {
        id: '', // wird vom Service generiert
        userId: user.uid,
        affiliateId,
        propertyId,
        propertyName,
        propertyType,
        checkIn: format(data.checkIn, 'yyyy-MM-dd'),
        checkOut: format(data.checkOut, 'yyyy-MM-dd'),
        guests: data.guests,
        price,
        currency,
        status: 'pending' as BookingStatus,
        specialRequests: data.specialRequests,
        paymentMethod: data.paymentMethod,
        createdAt: new Date().toISOString(),
      };

      await bookingService.createBooking(booking);
      navigate('/bookings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{t('booking.form.title')}</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('booking.form.checkIn')}
            </label>
            <input
              type="date"
              {...register('checkIn', { valueAsDate: true })}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.checkIn && (
              <p className="mt-1 text-sm text-red-600">{errors.checkIn.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('booking.form.checkOut')}
            </label>
            <input
              type="date"
              {...register('checkOut', { valueAsDate: true })}
              min={format(checkInDate, 'yyyy-MM-dd')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.checkOut && (
              <p className="mt-1 text-sm text-red-600">{errors.checkOut.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('booking.form.guests')}
            </label>
            <input
              type="number"
              {...register('guests', { valueAsNumber: true })}
              min="1"
              max="10"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.guests && (
              <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('booking.form.specialRequests')}
            </label>
            <textarea
              {...register('specialRequests')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('booking.form.paymentMethod')}
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="credit_card"
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">{t('booking.form.creditCard')}</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="paypal"
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">{t('booking.form.paypal')}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (isSubmitting || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting || loading ? t('booking.form.submitting') : t('booking.form.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 