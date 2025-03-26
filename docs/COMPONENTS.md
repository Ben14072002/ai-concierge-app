# Komponenten-Dokumentation

## Inhaltsverzeichnis
1. [ChatBot](#chatbot)
2. [AffiliateManager](#affiliatemanager)
3. [BookingManager](#bookingmanager)
4. [RecommendationCard](#recommendationcard)
5. [FeedbackForm](#feedbackform)
6. [Onboarding](#onboarding)

## ChatBot

### Beschreibung
Ein KI-gestützter Chatbot für die Interaktion mit Gästen.

### Props
```typescript
interface ChatBotProps {
  location: string;
  language?: string;
  onBooking?: (bookingData: BookingData) => void;
}
```

### Verwendung
```jsx
<ChatBot 
  location="Berlin"
  language="de"
  onBooking={handleBooking}
/>
```

### Features
- Echtzeit-Chat
- Mehrsprachige Unterstützung
- Personalisierte Empfehlungen
- Buchungsintegration

## AffiliateManager

### Beschreibung
Verwaltungskomponente für Affiliate-Partner.

### Props
```typescript
interface AffiliateManagerProps {
  onPartnerSelect?: (partner: Partner) => void;
  onPartnerUpdate?: (partner: Partner) => void;
}
```

### Verwendung
```jsx
<AffiliateManager 
  onPartnerSelect={handlePartnerSelect}
  onPartnerUpdate={handlePartnerUpdate}
/>
```

### Features
- Partner-Liste
- Partner-Details
- Provision-Tracking
- Performance-Analyse

## BookingManager

### Beschreibung
Verwaltungskomponente für Buchungen.

### Props
```typescript
interface BookingManagerProps {
  onStatusUpdate?: (bookingId: string, status: string) => void;
  onBookingCancel?: (bookingId: string) => void;
}
```

### Verwendung
```jsx
<BookingManager 
  onStatusUpdate={handleStatusUpdate}
  onBookingCancel={handleBookingCancel}
/>
```

### Features
- Buchungsübersicht
- Status-Verwaltung
- Stornierung
- Benachrichtigungen

## RecommendationCard

### Beschreibung
Karte zur Anzeige von Empfehlungen.

### Props
```typescript
interface RecommendationCardProps {
  recommendation: {
    name: string;
    type: string;
    rating: number;
    price: number;
    duration?: string;
  };
  type: 'restaurant' | 'activity' | 'attraction';
  onSelect?: (recommendation: Recommendation) => void;
}
```

### Verwendung
```jsx
<RecommendationCard 
  recommendation={recommendationData}
  type="restaurant"
  onSelect={handleRecommendationSelect}
/>
```

### Features
- Visuelle Darstellung
- Interaktive Auswahl
- Typ-spezifische Icons
- Responsive Design

## FeedbackForm

### Beschreibung
Formular für Benutzer-Feedback.

### Props
```typescript
interface FeedbackFormProps {
  onSubmit: (feedback: FeedbackData) => void;
  categories?: string[];
}
```

### Verwendung
```jsx
<FeedbackForm 
  onSubmit={handleFeedbackSubmit}
  categories={['general', 'chatbot', 'affiliates']}
/>
```

### Features
- Kategorisierte Bewertung
- Kommentarfeld
- Validierung
- Erfolgsmeldungen

## Onboarding

### Beschreibung
Onboarding-Prozess für neue Benutzer.

### Props
```typescript
interface OnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}
```

### Verwendung
```jsx
<Onboarding 
  onComplete={handleOnboardingComplete}
  onSkip={handleOnboardingSkip}
/>
```

### Features
- Schritt-für-Schritt-Anleitung
- Fortschrittsanzeige
- Überspringen-Option
- Responsive Design

## Gemeinsame Features

### Styling
Alle Komponenten verwenden:
- Tailwind CSS für Styling
- Responsive Design
- Barrierefreiheit
- Konsistente Farbpalette

### Internationalisierung
Alle Komponenten unterstützen:
- Mehrsprachigkeit
- RTL-Layouts
- Lokalisierte Datumsformate
- Währungsformatierung

### Performance
Alle Komponenten implementieren:
- Lazy Loading
- Memoization
- Optimierte Renderings
- Effizientes State Management

### Fehlerbehandlung
Alle Komponenten bieten:
- Fehlerzustände
- Ladezustände
- Fallback-UI
- Benutzerfreundliche Fehlermeldungen 