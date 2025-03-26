describe('Booking Process', () => {
  beforeEach(() => {
    // Login vor jedem Test
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
  });

  it('completes a booking process successfully', () => {
    // Navigiere zur Property-Detailseite
    cy.get('[data-testid="property-card"]').first().click();

    // Wähle Check-in und Check-out Daten
    cy.get('[data-testid="check-in-input"]').type('2024-03-20');
    cy.get('[data-testid="check-out-input"]').type('2024-03-25');

    // Wähle Anzahl der Gäste
    cy.get('[data-testid="guests-input"]').type('2');

    // Füge spezielle Anfragen hinzu
    cy.get('[data-testid="special-requests-input"]').type('Frühstück im Zimmer');

    // Wähle Zahlungsmethode
    cy.get('[data-testid="payment-method-select"]').select('credit_card');

    // Klicke auf Buchungsbutton
    cy.get('[data-testid="book-button"]').click();

    // Überprüfe Bestätigungsseite
    cy.url().should('include', '/booking/confirmation');
    cy.get('[data-testid="booking-confirmation"]').should('be.visible');
    cy.get('[data-testid="booking-details"]').should('contain', '2024-03-20');
    cy.get('[data-testid="booking-details"]').should('contain', '2024-03-25');
    cy.get('[data-testid="booking-details"]').should('contain', '2');

    // Überprüfe, dass die Buchung in der Liste erscheint
    cy.visit('/dashboard/bookings');
    cy.get('[data-testid="booking-list"]').should('contain', '2024-03-20');
  });

  it('validates form inputs correctly', () => {
    cy.visit('/property/1');

    // Versuche ohne Daten zu buchen
    cy.get('[data-testid="book-button"]').click();

    // Überprüfe Fehlermeldungen
    cy.get('[data-testid="check-in-error"]').should('be.visible');
    cy.get('[data-testid="check-out-error"]').should('be.visible');
    cy.get('[data-testid="guests-error"]').should('be.visible');

    // Versuche ungültige Daten
    cy.get('[data-testid="check-in-input"]').type('2024-03-25');
    cy.get('[data-testid="check-out-input"]').type('2024-03-20');
    cy.get('[data-testid="guests-input"]').type('11');

    cy.get('[data-testid="book-button"]').click();

    // Überprüfe Validierungsfehler
    cy.get('[data-testid="date-range-error"]').should('be.visible');
    cy.get('[data-testid="guests-max-error"]').should('be.visible');
  });

  it('handles payment process correctly', () => {
    cy.visit('/property/1');

    // Fülle Buchungsformular aus
    cy.get('[data-testid="check-in-input"]').type('2024-03-20');
    cy.get('[data-testid="check-out-input"]').type('2024-03-25');
    cy.get('[data-testid="guests-input"]').type('2');
    cy.get('[data-testid="payment-method-select"]').select('credit_card');

    // Klicke auf Buchungsbutton
    cy.get('[data-testid="book-button"]').click();

    // Überprüfe Zahlungsprozess
    cy.get('[data-testid="payment-form"]').should('be.visible');
    cy.get('[data-testid="card-number-input"]').type('4242424242424242');
    cy.get('[data-testid="card-expiry-input"]').type('12/25');
    cy.get('[data-testid="card-cvc-input"]').type('123');

    // Bestätige Zahlung
    cy.get('[data-testid="confirm-payment-button"]').click();

    // Überprüfe Erfolgsmeldung
    cy.get('[data-testid="payment-success"]').should('be.visible');
  });

  it('cancels a booking', () => {
    cy.visit('/dashboard/bookings');

    // Finde die erste Buchung und klicke auf Details
    cy.get('[data-testid="booking-card"]').first().click();

    // Klicke auf Stornieren
    cy.get('[data-testid="cancel-booking-button"]').click();

    // Bestätige Stornierung
    cy.get('[data-testid="confirm-cancel-button"]').click();

    // Überprüfe Stornierungsbestätigung
    cy.get('[data-testid="cancellation-confirmation"]').should('be.visible');
    cy.get('[data-testid="booking-status"]').should('contain', 'cancelled');
  });
}); 