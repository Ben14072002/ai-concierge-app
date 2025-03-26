import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}

// Custom Commands
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});

// Fehlerbehandlung
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignoriere bestimmte Fehler
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

// Performance Monitoring
Cypress.on('test:after:run', (attributes) => {
  // Sende Test-Metriken an Analytics
  if (Cypress.env('analyticsEnabled')) {
    cy.request({
      method: 'POST',
      url: '/api/analytics/test-metrics',
      body: {
        testName: attributes.title,
        duration: attributes.duration,
        status: attributes.state,
        timestamp: new Date().toISOString()
      }
    });
  }
}); 