import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Onboarding = ({ onComplete }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: t('onboarding.welcome.title'),
      content: t('onboarding.welcome.content'),
      action: null
    },
    {
      title: t('onboarding.affiliates.title'),
      content: t('onboarding.affiliates.content'),
      action: 'affiliates'
    },
    {
      title: t('onboarding.chat.title'),
      content: t('onboarding.chat.content'),
      action: 'chat'
    },
    {
      title: t('onboarding.bookings.title'),
      content: t('onboarding.bookings.content'),
      action: 'bookings'
    }
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      setIsLoading(true);
      try {
        // Markiere Onboarding als abgeschlossen
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          onboardingCompleted: true
        });
        onComplete();
      } catch (error) {
        console.error('Error completing onboarding:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        onboardingCompleted: true
      });
      onComplete();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">
              {t('onboarding.step')} {currentStep + 1} / {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {t('onboarding.skip')}
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {steps[currentStep].title}
          </h2>
          <div className="text-gray-600 whitespace-pre-line">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Example Content */}
        {steps[currentStep].action && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            {steps[currentStep].action === 'affiliates' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600">1</span>
                  </div>
                  <span className="text-gray-700">{t('onboarding.affiliates.step1')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600">2</span>
                  </div>
                  <span className="text-gray-700">{t('onboarding.affiliates.step2')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600">3</span>
                  </div>
                  <span className="text-gray-700">{t('onboarding.affiliates.step3')}</span>
                </div>
              </div>
            )}
            {steps[currentStep].action === 'chat' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600">1</span>
                  </div>
                  <span className="text-gray-700">{t('onboarding.chat.step1')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600">2</span>
                  </div>
                  <span className="text-gray-700">{t('onboarding.chat.step2')}</span>
                </div>
              </div>
            )}
            {steps[currentStep].action === 'bookings' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600">1</span>
                  </div>
                  <span className="text-gray-700">{t('onboarding.bookings.step1')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600">2</span>
                  </div>
                  <span className="text-gray-700">{t('onboarding.bookings.step2')}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            {t('onboarding.back')}
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? t('onboarding.loading') : currentStep === steps.length - 1 ? t('onboarding.finish') : t('onboarding.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 