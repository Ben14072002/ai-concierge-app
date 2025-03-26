import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import PropertyCard from '../../components/property/PropertyCard';

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Luxus-Apartment',
  description: 'Ein wunderschönes Apartment im Herzen der Stadt',
  price: 150,
  location: 'Berlin, Deutschland',
  images: ['image1.jpg'],
  amenities: ['WiFi', 'Küche', 'Klimaanlage'],
  rating: 4.5,
  reviews: 12,
  type: 'Apartment',
  bedrooms: 2,
  bathrooms: 1,
  maxGuests: 4
};

describe('PropertyCard Component', () => {
  const renderPropertyCard = (props = {}) => {
    return render(
      <MemoryRouter>
        <PropertyCard property={mockProperty} {...props} />
      </MemoryRouter>
    );
  };

  it('sollte den Immobilientitel anzeigen', () => {
    renderPropertyCard();
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
  });

  it('sollte den Preis korrekt anzeigen', () => {
    renderPropertyCard();
    expect(screen.getByText(/150/)).toBeInTheDocument();
    expect(screen.getByText(/nacht/i)).toBeInTheDocument();
  });

  it('sollte den Standort anzeigen', () => {
    renderPropertyCard();
    expect(screen.getByText(mockProperty.location)).toBeInTheDocument();
  });

  it('sollte die Bewertung anzeigen', () => {
    renderPropertyCard();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
    expect(screen.getByText(/12 bewertungen/i)).toBeInTheDocument();
  });

  it('sollte die wichtigsten Eigenschaften anzeigen', () => {
    renderPropertyCard();
    expect(screen.getByText(/2 schlafzimmer/i)).toBeInTheDocument();
    expect(screen.getByText(/1 badezimmer/i)).toBeInTheDocument();
    expect(screen.getByText(/4 gäste/i)).toBeInTheDocument();
  });

  it('sollte ein Hauptbild anzeigen', () => {
    renderPropertyCard();
    const image = screen.getByAltText(mockProperty.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProperty.images[0]);
  });

  it('sollte zur Detailseite navigieren, wenn geklickt wird', () => {
    renderPropertyCard();
    const card = screen.getByTestId('property-card');
    fireEvent.click(card);
    expect(window.location.pathname).toBe(`/properties/${mockProperty.id}`);
  });

  describe('PropertyCard Interaktionen', () => {
    it('sollte den Favoriten-Button togglen', () => {
      const onFavoriteToggle = jest.fn();
      renderPropertyCard({ onFavoriteToggle });
      
      const favoriteButton = screen.getByRole('button', { name: /favorit/i });
      fireEvent.click(favoriteButton);
      
      expect(onFavoriteToggle).toHaveBeenCalledWith(mockProperty.id);
    });

    it('sollte den Share-Button anzeigen und die Share-Funktion aufrufen', () => {
      const onShare = jest.fn();
      renderPropertyCard({ onShare });
      
      const shareButton = screen.getByRole('button', { name: /teilen/i });
      fireEvent.click(shareButton);
      
      expect(onShare).toHaveBeenCalledWith(mockProperty);
    });
  });

  describe('PropertyCard Responsive Design', () => {
    it('sollte die kompakte Ansicht auf kleinen Bildschirmen anzeigen', () => {
      global.innerWidth = 400;
      global.dispatchEvent(new Event('resize'));
      
      renderPropertyCard();
      const card = screen.getByTestId('property-card');
      
      expect(card).toHaveClass('compact-view');
    });

    it('sollte die volle Ansicht auf großen Bildschirmen anzeigen', () => {
      global.innerWidth = 1024;
      global.dispatchEvent(new Event('resize'));
      
      renderPropertyCard();
      const card = screen.getByTestId('property-card');
      
      expect(card).toHaveClass('full-view');
    });
  });

  describe('PropertyCard Zustände', () => {
    it('sollte den "Nicht verfügbar" Status korrekt anzeigen', () => {
      renderPropertyCard({ isAvailable: false });
      expect(screen.getByText(/nicht verfügbar/i)).toBeInTheDocument();
    });

    it('sollte den "Sonderangebot" Badge anzeigen', () => {
      renderPropertyCard({ hasSpecialOffer: true });
      expect(screen.getByText(/sonderangebot/i)).toBeInTheDocument();
    });

    it('sollte den "Neu" Badge für neue Einträge anzeigen', () => {
      const newProperty = {
        ...mockProperty,
        createdAt: new Date().toISOString()
      };
      renderPropertyCard({ property: newProperty });
      expect(screen.getByText(/neu/i)).toBeInTheDocument();
    });
  });
}); 