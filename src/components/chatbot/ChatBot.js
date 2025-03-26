import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { aiService } from '../../services/aiService';
import { bookingService } from '../../services/bookingService';
import { affiliateService } from '../../services/affiliateService';
import RecommendationCard from './RecommendationCard';

const ChatBot = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    quantity: 1,
    name: '',
    email: ''
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, type: 'user' }]);
    setIsTyping(true);

    try {
      const response = await aiService.processMessage(userMessage);
      setMessages(prev => [...prev, response]);

      // If the response contains recommendations, show them
      if (response.type === 'restaurant' || response.type === 'activity' || response.type === 'attraction') {
        const affiliates = affiliateService.getAffiliatesByCategory(response.type);
        setSelectedRecommendation(affiliates[0] || null);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { text: 'Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage.', type: 'error' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedRecommendation) return;

    try {
      const booking = await bookingService.createBooking({
        affiliateId: selectedRecommendation.id,
        ...bookingData
      });

      setMessages(prev => [...prev, {
        text: `Vielen Dank für Ihre Buchung! Ihre Buchungsnummer ist: ${booking.id}. Wir senden Ihnen eine Bestätigung per E-Mail.`,
        type: 'success'
      }]);

      setSelectedRecommendation(null);
      setBookingData({
        date: '',
        quantity: 1,
        name: '',
        email: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setMessages(prev => [...prev, {
        text: 'Entschuldigung, es gab einen Fehler bei der Buchung. Bitte versuchen Sie es später erneut.',
        type: 'error'
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
              Schreibend...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommendation and Booking Form */}
      {selectedRecommendation && (
        <div className="border-t border-gray-200 p-4">
          <RecommendationCard
            recommendation={selectedRecommendation}
            type={selectedRecommendation.category}
            onSelect={() => {}}
          />
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={bookingData.name}
                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-Mail</label>
              <input
                type="email"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Datum</label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Menge</label>
              <input
                type="number"
                min="1"
                value={bookingData.quantity}
                onChange={(e) => setBookingData({ ...bookingData, quantity: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <button
              onClick={handleBooking}
              className="w-full bg-primary-600 text-white rounded-md px-4 py-2 hover:bg-primary-700"
            >
              Jetzt buchen
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.inputPlaceholder')}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping}
            className="bg-primary-600 text-white rounded-md px-4 py-2 hover:bg-primary-700 disabled:opacity-50"
          >
            {t('chat.send')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot; 