import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { affiliateService } from './affiliateService';

class AIService {
  constructor() {
    this.recommendations = {
      restaurants: [],
      activities: [],
      attractions: [],
    };
    this.hostId = null;
  }

  async initialize(location, hostId) {
    this.hostId = hostId;
    await affiliateService.initialize(hostId);
    
    // TODO: Implement location-based recommendations fetching
    // This would typically fetch from Google Places API
    this.recommendations = {
      restaurants: [
        { id: 1, name: 'Restaurant A', type: 'italian', rating: 4.5, price: '€€' },
        { id: 2, name: 'Restaurant B', type: 'japanese', rating: 4.8, price: '€€€' },
      ],
      activities: [
        { id: 1, name: 'Stadtrundfahrt', type: 'tour', duration: '2h', price: '€25' },
        { id: 2, name: 'Weinprobe', type: 'food', duration: '1.5h', price: '€35' },
      ],
      attractions: [
        { id: 1, name: 'Museum A', type: 'cultural', rating: 4.2, price: '€15' },
        { id: 2, name: 'Park B', type: 'nature', rating: 4.7, price: 'Kostenlos' },
      ],
    };
  }

  async processMessage(message, context = {}) {
    const intent = this.recognizeIntent(message);
    
    switch (intent) {
      case 'greeting':
        return this.generateGreeting();
      case 'restaurant':
        return this.getRestaurantRecommendations();
      case 'activity':
        return this.getActivityRecommendations();
      case 'attraction':
        return this.getAttractionRecommendations();
      case 'help':
        return this.getHelpMessage();
      default:
        return this.getDefaultResponse();
    }
  }

  recognizeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.match(/hallo|hi|guten tag|hey/)) {
      return 'greeting';
    }
    if (lowerMessage.match(/restaurant|essen|kulinarisch|küche/)) {
      return 'restaurant';
    }
    if (lowerMessage.match(/aktivität|aktiv|unternehmen|machen/)) {
      return 'activity';
    }
    if (lowerMessage.match(/sehenswürdigkeit|attraktion|besichtigen|sehen/)) {
      return 'attraction';
    }
    if (lowerMessage.match(/hilfe|unterstützung|wie|was/)) {
      return 'help';
    }
    
    return 'default';
  }

  generateGreeting() {
    return {
      text: 'Hallo! Ich bin Ihr AI Concierge. Wie kann ich Ihnen heute helfen? Ich kann Ihnen Empfehlungen für Restaurants, Aktivitäten und Sehenswürdigkeiten geben.',
      type: 'greeting',
    };
  }

  getRestaurantRecommendations() {
    const affiliateRestaurants = affiliateService.getAffiliatesByCategory('restaurant');
    const regularRestaurants = this.recommendations.restaurants;

    // Combine and sort recommendations by priority
    const allRestaurants = [
      ...affiliateRestaurants.map(affiliate => ({
        ...affiliate,
        isAffiliate: true,
        priority: affiliate.priority || 1
      })),
      ...regularRestaurants.map(restaurant => ({
        ...restaurant,
        isAffiliate: false,
        priority: 0
      }))
    ].sort((a, b) => b.priority - a.priority);

    const recommendations = allRestaurants
      .map(restaurant => {
        const prefix = restaurant.isAffiliate ? '⭐ ' : '- ';
        return `${prefix}${restaurant.name} (${restaurant.type}, ${restaurant.rating}⭐, ${restaurant.price})`;
      })
      .join('\n');

    return {
      text: `Hier sind einige Restaurant-Empfehlungen:\n${recommendations}\n\nMöchten Sie mehr Details zu einem bestimmten Restaurant?`,
      type: 'restaurant',
    };
  }

  getActivityRecommendations() {
    const affiliateActivities = affiliateService.getAffiliatesByCategory('activity');
    const regularActivities = this.recommendations.activities;

    const allActivities = [
      ...affiliateActivities.map(affiliate => ({
        ...affiliate,
        isAffiliate: true,
        priority: affiliate.priority || 1
      })),
      ...regularActivities.map(activity => ({
        ...activity,
        isAffiliate: false,
        priority: 0
      }))
    ].sort((a, b) => b.priority - a.priority);

    const recommendations = allActivities
      .map(activity => {
        const prefix = activity.isAffiliate ? '⭐ ' : '- ';
        return `${prefix}${activity.name} (${activity.type}, ${activity.duration}, ${activity.price})`;
      })
      .join('\n');

    return {
      text: `Hier sind einige Aktivitäts-Empfehlungen:\n${recommendations}\n\nMöchten Sie mehr Details zu einer bestimmten Aktivität?`,
      type: 'activity',
    };
  }

  getAttractionRecommendations() {
    const affiliateAttractions = affiliateService.getAffiliatesByCategory('attraction');
    const regularAttractions = this.recommendations.attractions;

    const allAttractions = [
      ...affiliateAttractions.map(affiliate => ({
        ...affiliate,
        isAffiliate: true,
        priority: affiliate.priority || 1
      })),
      ...regularAttractions.map(attraction => ({
        ...attraction,
        isAffiliate: false,
        priority: 0
      }))
    ].sort((a, b) => b.priority - a.priority);

    const recommendations = allAttractions
      .map(attraction => {
        const prefix = attraction.isAffiliate ? '⭐ ' : '- ';
        return `${prefix}${attraction.name} (${attraction.type}, ${attraction.rating}⭐, ${attraction.price})`;
      })
      .join('\n');

    return {
      text: `Hier sind einige Sehenswürdigkeiten:\n${recommendations}\n\nMöchten Sie mehr Details zu einer bestimmten Sehenswürdigkeit?`,
      type: 'attraction',
    };
  }

  getHelpMessage() {
    return {
      text: 'Ich kann Ihnen bei folgenden Dingen helfen:\n- Restaurant-Empfehlungen\n- Aktivitäts-Vorschläge\n- Sehenswürdigkeiten\n- Allgemeine Informationen\n\nWas interessiert Sie am meisten?',
      type: 'help',
    };
  }

  getDefaultResponse() {
    return {
      text: 'Entschuldigung, ich habe Ihre Anfrage nicht ganz verstanden. Können Sie sie bitte anders formulieren? Oder fragen Sie mich, wobei ich Ihnen helfen kann.',
      type: 'default',
    };
  }
}

export const aiService = new AIService(); 