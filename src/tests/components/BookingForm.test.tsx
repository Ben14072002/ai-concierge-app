import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookingForm from '../../components/booking/BookingForm';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Luxus-Apartment',
  price: 150,
  maxGuests: 4,
  minStay: 2,
  maxStay: 14,
  availableDates: [
    { start: '2024-04-01', end: '2024-04-30' }
  ]
};

// Mock user data
const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  displayName: 'Test User'
};

// Mock auth context
const mockAuth = {
  currentUser: mockUser,
  loading: false
};

// Mock booking creation function
const mockCreateBooking = jest.fn();

describe('BookingForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderBookingForm = (props = {}) => {
    return render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth as any}>
          <BookingForm
            property={mockProperty}
            onSubmit={mockCreateBooking}
            {...props}
          />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('sollte das Formular mit den Standardwerten rendern', () => {
    renderBookingForm();
    
    expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gäste/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buchen/i })).toBeInTheDocument();
  });

  it('sollte die Preisberechnung korrekt durchführen', async () => {
    renderBookingForm();
    
    // Datum auswählen
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);
    
    await userEvent.type(checkInInput, '2024-04-01');
    await userEvent.type(checkOutInput, '2024-04-03');
    
    // 2 Nächte * 150€ = 300€
    expect(screen.getByText(/300/)).toBeInTheDocument();
    expect(screen.getByText(/gesamtpreis/i)).toBeInTheDocument();
  });

  it('sollte die Gästeanzahl validieren', async () => {
    renderBookingForm();
    
    const guestsInput = screen.getByLabelText(/gäste/i);
    await userEvent.type(guestsInput, '6');
    
    expect(screen.getByText(/maximale anzahl von 4 gästen/i)).toBeInTheDocument();
  });

  it('sollte die Mindestaufenthaltsdauer validieren', async () => {
    renderBookingForm();
    
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);
    
    await userEvent.type(checkInInput, '2024-04-01');
    await userEvent.type(checkOutInput, '2024-04-02');
    
    expect(screen.getByText(/mindestaufenthalt von 2 nächten/i)).toBeInTheDocument();
  });

  it('sollte eine erfolgreiche Buchung durchführen', async () => {
    renderBookingForm();
    
    // Formulardaten ausfüllen
    await userEvent.type(screen.getByLabelText(/check-in/i), '2024-04-01');
    await userEvent.type(screen.getByLabelText(/check-out/i), '2024-04-03');
    await userEvent.type(screen.getByLabelText(/gäste/i), '2');
    
    // Formular absenden
    await userEvent.click(screen.getByRole('button', { name: /buchen/i }));
    
    await waitFor(() => {
      expect(mockCreateBooking).toHaveBeenCalledWith({
        propertyId: mockProperty.id,
        userId: mockUser.id,
        checkIn: '2024-04-01',
        checkOut: '2024-04-03',
        guests: 2,
        totalPrice: 300
      });
    });
  });

  describe('BookingForm Validierung', () => {
    it('sollte Überschneidungen mit vorhandenen Buchungen prüfen', async () => {
      const existingBookings = [
        { checkIn: '2024-04-05', checkOut: '2024-04-10' }
      ];
      
      renderBookingForm({ existingBookings });
      
      await userEvent.type(screen.getByLabelText(/check-in/i), '2024-04-08');
      await userEvent.type(screen.getByLabelText(/check-out/i), '2024-04-12');
      
      expect(screen.getByText(/zeitraum bereits gebucht/i)).toBeInTheDocument();
    });

    it('sollte das Buchungsdatum in der Zukunft validieren', async () => {
      renderBookingForm();
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      await userEvent.type(
        screen.getByLabelText(/check-in/i),
        pastDate.toISOString().split('T')[0]
      );
      
      expect(screen.getByText(/datum muss in der zukunft liegen/i)).toBeInTheDocument();
    });
  });

  describe('BookingForm UI/UX', () => {
    it('sollte den Ladezustand während der Buchung anzeigen', async () => {
      mockCreateBooking.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderBookingForm();
      
      await userEvent.type(screen.getByLabelText(/check-in/i), '2024-04-01');
      await userEvent.type(screen.getByLabelText(/check-out/i), '2024-04-03');
      await userEvent.type(screen.getByLabelText(/gäste/i), '2');
      
      const submitButton = screen.getByRole('button', { name: /buchen/i });
      await userEvent.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/wird gebucht/i);
    });

    it('sollte Fehler bei der Buchung anzeigen', async () => {
      const error = new Error('Buchung fehlgeschlagen');
      mockCreateBooking.mockRejectedValue(error);
      
      renderBookingForm();
      
      await userEvent.type(screen.getByLabelText(/check-in/i), '2024-04-01');
      await userEvent.type(screen.getByLabelText(/check-out/i), '2024-04-03');
      await userEvent.type(screen.getByLabelText(/gäste/i), '2');
      
      await userEvent.click(screen.getByRole('button', { name: /buchen/i }));
      
      expect(screen.getByText(/buchung fehlgeschlagen/i)).toBeInTheDocument();
    });
  });
}); 