import { mount } from 'cypress/react18';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/i18n';
import { AuthProvider } from '../../src/contexts/AuthContext';

// Custom mount für React-Komponenten mit Providern
Cypress.Commands.add('mountWithProviders', (component) => {
  return mount(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          {component}
        </AuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
});

// Mock-Funktionen für Firebase
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
};

const mockFirestore = {
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn()
};

// Mock-Funktionen für i18n
const mockI18n = {
  t: (key: string) => key,
  i18n: {
    changeLanguage: jest.fn(),
    language: 'de'
  }
};

// Mock-Funktionen für Router
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null
};

// Exportiere Mock-Funktionen
export {
  mockAuth,
  mockFirestore,
  mockI18n,
  mockNavigate,
  mockLocation
};

// Performance Monitoring für Komponententests
Cypress.on('test:after:run', (attributes) => {
  if (Cypress.env('componentAnalyticsEnabled')) {
    cy.request({
      method: 'POST',
      url: '/api/analytics/component-metrics',
      body: {
        componentName: attributes.title,
        renderTime: attributes.duration,
        status: attributes.state,
        timestamp: new Date().toISOString()
      }
    });
  }
}); 