import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { affiliateService } from '../../services/affiliateService';

const AffiliateManager = ({ hostId }) => {
  const { t } = useTranslation();
  const [affiliates, setAffiliates] = useState([]);
  const [newAffiliate, setNewAffiliate] = useState({
    name: '',
    category: 'restaurant',
    type: '',
    rating: 0,
    price: '',
    duration: '',
    commission: 0,
    priority: 1,
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAffiliates();
  }, [hostId]);

  const loadAffiliates = async () => {
    await affiliateService.initialize(hostId);
    setAffiliates(affiliateService.getAllAffiliates());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await affiliateService.updateAffiliate(editingId, newAffiliate);
      } else {
        await affiliateService.addAffiliate(hostId, newAffiliate);
      }
      setNewAffiliate({
        name: '',
        category: 'restaurant',
        type: '',
        rating: 0,
        price: '',
        duration: '',
        commission: 0,
        priority: 1,
        description: ''
      });
      setIsEditing(false);
      setEditingId(null);
      loadAffiliates();
    } catch (error) {
      console.error('Error saving affiliate:', error);
    }
  };

  const handleEdit = (affiliate) => {
    setNewAffiliate(affiliate);
    setIsEditing(true);
    setEditingId(affiliate.id);
  };

  const handleDelete = async (affiliateId) => {
    if (window.confirm('Möchten Sie diesen Affiliate-Partner wirklich löschen?')) {
      try {
        await affiliateService.deleteAffiliate(affiliateId);
        loadAffiliates();
      } catch (error) {
        console.error('Error deleting affiliate:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Affiliate-Partner verwalten</h2>
      
      {/* Affiliate Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newAffiliate.name}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategorie</label>
            <select
              value={newAffiliate.category}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="restaurant">Restaurant</option>
              <option value="activity">Aktivität</option>
              <option value="attraction">Sehenswürdigkeit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Typ</label>
            <input
              type="text"
              value={newAffiliate.type}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bewertung</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={newAffiliate.rating}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, rating: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preis</label>
            <input
              type="text"
              value={newAffiliate.price}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dauer</label>
            <input
              type="text"
              value={newAffiliate.duration}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, duration: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Provision (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newAffiliate.commission}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, commission: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priorität</label>
            <input
              type="number"
              min="1"
              max="10"
              value={newAffiliate.priority}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, priority: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea
            value={newAffiliate.description}
            onChange={(e) => setNewAffiliate({ ...newAffiliate, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-3">
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setNewAffiliate({
                  name: '',
                  category: 'restaurant',
                  type: '',
                  rating: 0,
                  price: '',
                  duration: '',
                  commission: 0,
                  priority: 1,
                  description: ''
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            {isEditing ? 'Aktualisieren' : 'Hinzufügen'}
          </button>
        </div>
      </form>

      {/* Affiliates List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bewertung</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provision</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorität</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{affiliate.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{affiliate.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{affiliate.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{affiliate.rating}⭐</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{affiliate.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{affiliate.commission}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{affiliate.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEdit(affiliate)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDelete(affiliate.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AffiliateManager; 