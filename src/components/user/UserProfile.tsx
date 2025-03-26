import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { updateProfile } from 'firebase/auth';

const UserProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await updateProfile(currentUser, {
        displayName: displayName
      });
      toast.success('Profil erfolgreich aktualisiert');
      setIsEditing(false);
    } catch (error) {
      toast.error('Fehler beim Aktualisieren des Profils');
      console.error('Fehler beim Aktualisieren des Profils:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mein Profil</h1>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Profilbild */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-blue-600">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || '?'}
            </span>
          </div>
        </div>

        {/* Profilinformationen */}
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-gray-900">
                {currentUser?.displayName || 'Nicht angegeben'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-Mail
              </label>
              <p className="mt-1 text-gray-900">{currentUser?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-Mail verifiziert
              </label>
              <p className="mt-1">
                {currentUser?.emailVerified ? (
                  <span className="text-green-600">Ja</span>
                ) : (
                  <span className="text-red-600">Nein</span>
                )}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Profil bearbeiten
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-Mail
              </label>
              <p className="mt-1 text-gray-900">{currentUser?.email}</p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Wird gespeichert...' : 'Speichern'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 