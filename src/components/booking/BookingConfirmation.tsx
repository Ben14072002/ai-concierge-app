import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Keine Buchungsinformationen gefunden
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-6">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Vielen Dank für Ihre Buchung!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Ihre Buchung wurde erfolgreich abgeschlossen. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Buchungsdetails
          </h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Buchungsnummer</span>
              <span className="font-medium">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Anreise</span>
              <span className="font-medium">
                {new Date(booking.checkIn).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Abreise</span>
              <span className="font-medium">
                {new Date(booking.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gäste</span>
              <span className="font-medium">{booking.guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gesamtpreis</span>
              <span className="font-medium">{booking.totalPrice}€</span>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <Link
            to="/bookings"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Meine Buchungen
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 