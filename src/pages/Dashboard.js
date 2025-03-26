import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import AffiliateManager from '../components/dashboard/AffiliateManager';
import BookingManager from '../components/dashboard/BookingManager';
import ChatBot from '../components/chatbot/ChatBot';
import Onboarding from '../components/onboarding/Onboarding';
import FeedbackForm from '../components/feedback/FeedbackForm';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && !userDoc.data().onboardingCompleted) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.title')}
        </h1>
        <button
          onClick={() => setShowFeedback(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          {t('feedback.title')}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('chat')}
            className={`${
              activeTab === 'chat'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t('dashboard.chat')}
          </button>
          <button
            onClick={() => setActiveTab('affiliates')}
            className={`${
              activeTab === 'affiliates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t('dashboard.affiliates')}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`${
              activeTab === 'bookings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t('dashboard.bookings')}
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === 'chat' ? (
          <ChatBot />
        ) : activeTab === 'affiliates' ? (
          <AffiliateManager hostId={user.uid} />
        ) : (
          <BookingManager hostId={user.uid} />
        )}
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackForm onClose={() => setShowFeedback(false)} />
      )}
    </div>
  );
};

export default Dashboard; 