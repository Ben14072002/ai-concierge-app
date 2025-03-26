/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    logout(): Chainable<void>;
    clearLocalStorage(): Chainable<void>;
    waitForPageLoad(): Chainable<void>;
  }
}

// Benutzerdefinierte Befehle
Cypress.Commands.add('clearLocalStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().should('have.property', 'document').its('readyState').should('eq', 'complete');
});

// Performance-Metriken sammeln
Cypress.Commands.add('collectPerformanceMetrics', () => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');

    const metrics = {
      navigation: {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        domLoad: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        fullLoad: navigation.loadEventEnd - navigation.navigationStart
      },
      resources: resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType
      }))
    };

    cy.writeFile('cypress/fixtures/performance-metrics.json', metrics);
  });
}); 