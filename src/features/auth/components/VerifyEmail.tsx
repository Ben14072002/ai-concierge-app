import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAuth } from 'firebase/auth';

const VerifyEmail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth(getAuth());

  const handleResendVerification = async () => {
    try {
      if (auth.user) {
        await auth.user.sendEmailVerification();
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.verify.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.verify.message')}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleResendVerification}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('auth.verify.resendButton')}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('auth.verify.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 