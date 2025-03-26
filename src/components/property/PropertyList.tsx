import React, { useState } from 'react';
import { useProperties } from '../../api/hooks';
import PropertyCard from './PropertyCard';
import { Property } from '../../types/property';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const PropertyList: React.FC = () => {
  const { data: properties, isLoading, error } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    type: 'all',
  });

  const filteredProperties = properties?.filter((property: Property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = (!filters.minPrice || property.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || property.price <= Number(filters.maxPrice));

    const matchesType = filters.type === 'all' || property.type === filters.type;

    return matchesSearch && matchesPrice && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Ein Fehler ist aufgetreten beim Laden der Immobilien.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verfügbare Immobilien</h1>
        <p className="mt-2 text-gray-600">
          Entdecken Sie unsere Auswahl an hochwertigen Unterkünften
        </p>
      </div>

      {/* Suchleiste und Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Suche nach Titel oder Ort..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 md:flex-none">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Alle Typen</option>
              <option value="apartment">Apartment</option>
              <option value="house">Haus</option>
              <option value="villa">Villa</option>
            </select>
          </div>

          <div className="flex-1 md:flex-none">
            <input
              type="number"
              placeholder="Min. Preis"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex-1 md:flex-none">
            <input
              type="number"
              placeholder="Max. Preis"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Immobilienliste */}
      {filteredProperties?.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          Keine Immobilien gefunden, die Ihren Kriterien entsprechen.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties?.map((property: Property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList; 