import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Beta-spezifische Initialisierung
if (process.env.REACT_APP_ENV === 'beta') {
  console.log('Beta-Umgebung aktiviert');
  
  // Performance-Monitoring aktivieren
  if (process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true') {
    console.log('Performance-Monitoring aktiviert');
  }
  
  // Fehler-Tracking aktivieren
  if (process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true') {
    console.log('Fehler-Tracking aktiviert');
  }
  
  // Analytics aktivieren
  if (process.env.REACT_APP_ENABLE_ANALYTICS === 'true') {
    console.log('Analytics aktiviert');
  }
}

// Service Worker Registrierung
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker erfolgreich registriert:', registration);
      })
      .catch(error => {
        console.log('Service Worker Registrierung fehlgeschlagen:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance-Metriken
reportWebVitals(); 