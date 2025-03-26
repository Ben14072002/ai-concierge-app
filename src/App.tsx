import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import BookingList from './components/booking/BookingList';
import BookingConfirmation from './components/booking/BookingConfirmation';
import UserProfile from './components/user/UserProfile';
import NotFound from './components/common/NotFound';

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Firebase Auth Instance
const auth = getAuth();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider auth={auth}>
        <Router>
          <Layout>
            <Routes>
              {/* Öffentliche Routen */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Geschützte Routen */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/properties" element={
                <PrivateRoute>
                  <PropertyList />
                </PrivateRoute>
              } />
              
              <Route path="/properties/:id" element={
                <PrivateRoute>
                  <PropertyDetail />
                </PrivateRoute>
              } />
              
              <Route path="/bookings" element={
                <PrivateRoute>
                  <BookingList />
                </PrivateRoute>
              } />
              
              <Route path="/booking-confirmation/:id" element={
                <PrivateRoute>
                  <BookingConfirmation />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } />
              
              {/* Standardrouten */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          
          {/* Toast Benachrichtigungen */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 