import React from 'react';
import { useBookings, useUpdateBooking } from '../../api/hooks';
import { Booking } from '../../types/booking';
import { Property } from '../../types/property';
import { useProperties } from '../../api/hooks';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const BookingList: React.FC = () => {
  const { data: bookings, isLoading: isLoadingBookings } = useBookings();
  const { data: properties, isLoading: isLoadingProperties } = useProperties();
  const updateBooking = useUpdateBooking();

  const isLoading = isLoadingBookings || isLoadingProperties;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getPropertyById = (id: string): Property | undefined => {
    return properties?.find(p => p.id === id);
  };

  const handleCancelBooking = async (booking: Booking) => {
    try {
      await updateBooking.mutateAsync({
        id: booking.id,
        data: { status: 'cancelled' }
      });
    } catch (error) {
      console.error('Fehler beim Stornieren der Buchung:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meine Buchungen</h1>

      {bookings?.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          Sie haben noch keine Buchungen.
        </div>
      ) : (
        <div className="space-y-6">
          {bookings?.map((booking) => {
            const property = getPropertyById(booking.propertyId);
            if (!property) return null;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {property.title}
                      </h2>
                      <p className="text-gray-500">{property.location}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status === 'confirmed'
                        ? 'Bestätigt'
                        : booking.status === 'cancelled'
                        ? 'Storniert'
                        : 'Ausstehend'}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <div>
                        <p className="text-sm">Anreise</p>
                        <p className="font-medium">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <div>
                        <p className="text-sm">Abreise</p>
                        <p className="font-medium">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserGroupIcon className="h-5 w-5 mr-2" />
                      <div>
                        <p className="text-sm">Gäste</p>
                        <p className="font-medium">{booking.guests}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm mr-2">Gesamtpreis:</span>
                      <span className="font-medium">{booking.totalPrice}€</span>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Buchung stornieren
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingList; 