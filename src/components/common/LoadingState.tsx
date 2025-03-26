import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  fullScreen?: boolean;
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  fullScreen = false,
  message,
}) => {
  const { t } = useTranslation();

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      {message && (
        <p className="mt-4 text-sm text-gray-500">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
};

export default LoadingState; 