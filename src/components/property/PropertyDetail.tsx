import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../../api/hooks';
import { Property } from '../../types/property';
import { Booking } from '../../types/booking';
import { useCreateBooking } from '../../api/hooks';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../../services/paymentService';
import PaymentForm from '../payment/PaymentForm';
import {
  MapPinIcon,
  StarIcon,
  UserGroupIcon,
  HomeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: properties, isLoading, error } = useProperties();
  const createBooking = useCreateBooking();
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingData, setBookingData] = useState<Omit<Booking, 'id' | 'userId' | 'createdAt' | 'updatedAt'> | null>(null);

  const property = properties?.find(p => p.id === id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center text-red-600 p-4">
        Immobilie nicht gefunden oder ein Fehler ist aufgetreten.
      </div>
    );
  }

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return nights * property.price;
  };

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!checkIn || !checkOut) {
      alert('Bitte wählen Sie Anreise- und Abreisedatum');
      return;
    }

    const totalPrice = calculateTotalPrice();
    const booking: Omit<Booking, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      propertyId: property.id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'pending'
    };

    setBookingData(booking);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async () => {
    if (!bookingData) return;

    try {
      await createBooking.mutateAsync({
        ...bookingData,
        status: 'confirmed'
      });
      navigate('/booking-confirmation');
    } catch (error) {
      console.error('Fehler bei der Buchung:', error);
      alert('Ein Fehler ist bei der Buchung aufgetreten');
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Zahlungsfehler:', error);
    alert('Ein Fehler ist bei der Zahlung aufgetreten');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Bildergalerie */}
      <div className="mb-8">
        <div className="relative h-96 rounded-lg overflow-hidden">
          <img
            src={property.images[selectedImage]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-24 rounded-lg overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={image}
                alt={`${property.title} - Bild ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hauptinformationen */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
          
          <div className="flex items-center text-gray-500 mb-4">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>{property.location}</span>
          </div>

          {property.rating && (
            <div className="flex items-center mb-4">
              <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-medium">{property.rating.toFixed(1)}</span>
              <span className="text-gray-500 ml-1">
                ({property.reviews} Bewertungen)
              </span>
            </div>
          )}

          <div className="prose max-w-none mb-8">
            <p>{property.description}</p>
          </div>

          {/* Ausstattung */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Ausstattung</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <span className="mr-2">•</span>
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buchungsformular */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <div className="mb-6">
              <p className="text-3xl font-bold text-blue-600">
                {property.price}€ <span className="text-lg text-gray-500">/Nacht</span>
              </p>
            </div>

            {showPaymentForm && bookingData ? (
              <Elements stripe={getStripe()}>
                <PaymentForm
                  booking={bookingData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Anreise
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Abreise
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gäste
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[...Array(property.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Gast' : 'Gäste'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Gesamtpreis</span>
                    <span className="font-medium">{calculateTotalPrice()}€</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Jetzt buchen
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail; 