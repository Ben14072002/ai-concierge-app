# API-Dokumentation

## Inhaltsverzeichnis
1. [AIService](#aiservice)
2. [AffiliateService](#affiliateservice)
3. [BookingService](#bookingservice)
4. [UXService](#uxservice)
5. [PrivacyService](#privacyservice)
6. [PerformanceService](#performanceservice)

## AIService

### Methoden

#### `initialize(location)`
Initialisiert den AI-Service mit einem Standort.

**Parameter:**
- `location` (string): Standort für die Empfehlungen

**Rückgabewert:**
- `Promise<void>`

#### `processMessage(message)`
Verarbeitet eine Benutzernachricht und generiert eine Antwort.

**Parameter:**
- `message` (string): Benutzernachricht

**Rückgabewert:**
- `Promise<{text: string, type: string, recommendations?: Array}>`

#### `recognizeIntent(message)`
Erkennt die Absicht einer Benutzernachricht.

**Parameter:**
- `message` (string): Benutzernachricht

**Rückgabewert:**
- `string`: Erkannte Absicht

## AffiliateService

### Methoden

#### `addAffiliate(affiliateData)`
Fügt einen neuen Affiliate-Partner hinzu.

**Parameter:**
- `affiliateData` (object): Partner-Daten
  ```typescript
  {
    name: string;
    type: string;
    commission: number;
    contact: string;
    description: string;
  }
  ```

**Rückgabewert:**
- `Promise<string>`: Partner-ID

#### `getAffiliates()`
Ruft alle Affiliate-Partner ab.

**Rückgabewert:**
- `Promise<Array<object>>`

#### `updateAffiliate(id, data)`
Aktualisiert die Daten eines Affiliate-Partners.

**Parameter:**
- `id` (string): Partner-ID
- `data` (object): Neue Partner-Daten

**Rückgabewert:**
- `Promise<boolean>`

#### `deleteAffiliate(id)`
Löscht einen Affiliate-Partner.

**Parameter:**
- `id` (string): Partner-ID

**Rückgabewert:**
- `Promise<boolean>`

## BookingService

### Methoden

#### `createBooking(bookingData)`
Erstellt eine neue Buchung.

**Parameter:**
- `bookingData` (object): Buchungsdaten
  ```typescript
  {
    serviceId: string;
    date: Date;
    time: string;
    guests: number;
    specialRequests?: string;
  }
  ```

**Rückgabewert:**
- `Promise<string>`: Buchungs-ID

#### `getBookings()`
Ruft alle Buchungen ab.

**Rückgabewert:**
- `Promise<Array<object>>`

#### `updateBookingStatus(id, status)`
Aktualisiert den Status einer Buchung.

**Parameter:**
- `id` (string): Buchungs-ID
- `status` (string): Neuer Status

**Rückgabewert:**
- `Promise<boolean>`

#### `cancelBooking(id)`
Storniert eine Buchung.

**Parameter:**
- `id` (string): Buchungs-ID

**Rückgabewert:**
- `Promise<boolean>`

## UXService

### Methoden

#### `saveUserPreferences(userId, preferences)`
Speichert Benutzereinstellungen.

**Parameter:**
- `userId` (string): Benutzer-ID
- `preferences` (object): Benutzereinstellungen

**Rückgabewert:**
- `Promise<boolean>`

#### `getUserPreferences(userId)`
Ruft Benutzereinstellungen ab.

**Parameter:**
- `userId` (string): Benutzer-ID

**Rückgabewert:**
- `Promise<object>`

#### `logUserInteraction(userId, interaction)`
Protokolliert eine Benutzerinteraktion.

**Parameter:**
- `userId` (string): Benutzer-ID
- `interaction` (object): Interaktionsdaten

**Rückgabewert:**
- `Promise<boolean>`

#### `analyzeUserInteractions(userId)`
Analysiert Benutzerinteraktionen.

**Parameter:**
- `userId` (string): Benutzer-ID

**Rückgabewert:**
- `Promise<object>`

## PrivacyService

### Methoden

#### `saveConsent(userId, consentData)`
Speichert Benutzer-Einwilligungen.

**Parameter:**
- `userId` (string): Benutzer-ID
- `consentData` (object): Einwilligungsdaten

**Rückgabewert:**
- `Promise<boolean>`

#### `getConsents(userId)`
Ruft Benutzer-Einwilligungen ab.

**Parameter:**
- `userId` (string): Benutzer-ID

**Rückgabewert:**
- `Promise<Array<object>>`

#### `exportUserData(userId)`
Exportiert Benutzerdaten.

**Parameter:**
- `userId` (string): Benutzer-ID

**Rückgabewert:**
- `Promise<object>`

#### `deleteUserData(userId)`
Löscht Benutzerdaten.

**Parameter:**
- `userId` (string): Benutzer-ID

**Rückgabewert:**
- `Promise<boolean>`

## PerformanceService

### Methoden

#### `savePerformanceMetrics(metrics)`
Speichert Performance-Metriken.

**Parameter:**
- `metrics` (object): Performance-Daten

**Rückgabewert:**
- `Promise<boolean>`

#### `getCachedData(key)`
Ruft gecachte Daten ab.

**Parameter:**
- `key` (string): Cache-Schlüssel

**Rückgabewert:**
- `Promise<object>`

#### `setCachedData(key, data, ttl)`
Speichert Daten im Cache.

**Parameter:**
- `key` (string): Cache-Schlüssel
- `data` (object): Zu cachende Daten
- `ttl` (number): Time-to-live in Sekunden

**Rückgabewert:**
- `Promise<boolean>`

#### `optimizeImage(url, options)`
Optimiert ein Bild.

**Parameter:**
- `url` (string): Bild-URL
- `options` (object): Optimierungsoptionen

**Rückgabewert:**
- `Promise<string>`: Optimierte Bild-URL 