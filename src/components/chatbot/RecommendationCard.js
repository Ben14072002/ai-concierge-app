import React from 'react';

const RecommendationCard = ({ recommendation, type, onSelect }) => {
  const getIcon = () => {
    switch (type) {
      case 'restaurant':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'activity':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'attraction':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onSelect(recommendation)}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-primary-600">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {recommendation.name}
          </h3>
          <div className="mt-1 text-sm text-gray-500">
            <p>{recommendation.type}</p>
            {recommendation.rating && (
              <p className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{recommendation.rating}</span>
              </p>
            )}
            {recommendation.duration && (
              <p>{recommendation.duration}</p>
            )}
            <p className="font-medium text-primary-600">{recommendation.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard; 