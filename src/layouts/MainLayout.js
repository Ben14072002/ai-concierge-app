import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MainLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-primary-600">AI Concierge</Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/login" className="btn-secondary mr-4">
                {t('login')}
              </Link>
              <Link to="/register" className="btn-primary">
                {t('register')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} AI Concierge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 