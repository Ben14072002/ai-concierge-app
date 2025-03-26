import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types/property';
import {
  HeartIcon,
  MapPinIcon,
  StarIcon,
  UserGroupIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavoriteToggle,
  isFavorite = false
}) => {
  const {
    id,
    title,
    price,
    location,
    images,
    bedrooms,
    bathrooms,
    maxGuests,
    rating,
    reviews,
    isAvailable,
    hasSpecialOffer
  } = property;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <Link
      to={`/properties/${id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Bild-Container */}
      <div className="relative h-48">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {!isAvailable && (
            <span className="px-2 py-1 bg-red-500 text-white text-sm rounded">
              Nicht verfügbar
            </span>
          )}
          {hasSpecialOffer && (
            <span className="px-2 py-1 bg-green-500 text-white text-sm rounded">
              Sonderangebot
            </span>
          )}
        </div>

        {/* Favoriten-Button */}
        {onFavoriteToggle && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            {isFavorite ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Inhalt */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {title}
          </h3>
          <p className="text-lg font-bold text-blue-600">
            {price}€ <span className="text-sm text-gray-500">/Nacht</span>
          </p>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Bewertungen */}
        {rating && reviews && (
          <div className="flex items-center mb-3">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-gray-700">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              ({reviews} Bewertungen)
            </span>
          </div>
        )}

        {/* Eigenschaften */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
          <div className="flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>{bedrooms} Schlafzimmer</span>
          </div>
          <div className="flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>{bathrooms} Bäder</span>
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>Max. {maxGuests}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard; 