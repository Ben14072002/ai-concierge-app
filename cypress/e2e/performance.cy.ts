describe('Performance Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.waitForPageLoad();
  });

  it('measures initial page load performance', () => {
    cy.collectPerformanceMetrics();
    cy.readFile('cypress/fixtures/performance-metrics.json').then((metrics) => {
      // Überprüfe Navigation-Performance
      expect(metrics.navigation.dnsLookup).to.be.lessThan(1000);
      expect(metrics.navigation.tcpConnection).to.be.lessThan(1000);
      expect(metrics.navigation.serverResponse).to.be.lessThan(2000);
      expect(metrics.navigation.domLoad).to.be.lessThan(3000);
      expect(metrics.navigation.fullLoad).to.be.lessThan(4000);

      // Überprüfe Ressourcen-Performance
      metrics.resources.forEach((resource) => {
        expect(resource.duration).to.be.lessThan(2000);
        if (resource.type === 'img') {
          expect(resource.size).to.be.lessThan(500000); // Max 500KB pro Bild
        }
      });
    });
  });

  it('measures navigation performance between pages', () => {
    // Startseite
    cy.collectPerformanceMetrics();
    cy.readFile('cypress/fixtures/performance-metrics.json').then((initialMetrics) => {
      // Navigiere zum Dashboard
      cy.login('test@example.com', 'password123');
      cy.waitForPageLoad();
      cy.collectPerformanceMetrics();
      cy.readFile('cypress/fixtures/performance-metrics.json').then((dashboardMetrics) => {
        // Überprüfe, ob die Navigation schneller ist als der initiale Load
        expect(dashboardMetrics.navigation.domLoad).to.be.lessThan(initialMetrics.navigation.domLoad);
      });
    });
  });

  it('measures component render performance', () => {
    cy.visit('/dashboard');
    cy.waitForPageLoad();

    // Überprüfe PropertyCard-Rendering
    cy.get('[data-testid="property-card"]').first().then(($el) => {
      const renderTime = performance.now();
      cy.wrap($el).should('be.visible');
      const endTime = performance.now();
      expect(endTime - renderTime).to.be.lessThan(100); // Max 100ms Render-Zeit
    });

    // Überprüfe BookingList-Rendering
    cy.get('[data-testid="booking-list"]').first().then(($el) => {
      const renderTime = performance.now();
      cy.wrap($el).should('be.visible');
      const endTime = performance.now();
      expect(endTime - renderTime).to.be.lessThan(200); // Max 200ms Render-Zeit
    });
  });

  it('measures API response times', () => {
    cy.intercept('GET', '/api/bookings').as('getBookings');
    cy.intercept('GET', '/api/properties').as('getProperties');

    cy.visit('/dashboard');
    cy.waitForPageLoad();

    // Überprüfe API-Antwortzeiten
    cy.wait('@getBookings').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.response?.duration).to.be.lessThan(1000); // Max 1s Antwortzeit
    });

    cy.wait('@getProperties').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.response?.duration).to.be.lessThan(1000); // Max 1s Antwortzeit
    });
  });

  it('measures form submission performance', () => {
    cy.visit('/property/1');
    cy.waitForPageLoad();

    // Fülle das Buchungsformular aus
    cy.get('[data-testid="check-in-input"]').type('2024-03-20');
    cy.get('[data-testid="check-out-input"]').type('2024-03-25');
    cy.get('[data-testid="guests-input"]').type('2');

    // Überprüfe Formular-Validierungszeit
    const validationStart = performance.now();
    cy.get('[data-testid="book-button"]').click();
    cy.get('[data-testid="booking-confirmation"]').should('be.visible');
    const validationEnd = performance.now();
    expect(validationEnd - validationStart).to.be.lessThan(500); // Max 500ms Validierungszeit
  });
}); 