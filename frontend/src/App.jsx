import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import DataSyncBanner from './components/DataSyncBanner';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Analytics from './pages/Analytics';
import Reflection from './pages/Reflection';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gold-500">Trading Journal Pro+</h2>
          <p className="text-gray-400 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route wrapper - redirects to dashboard if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gold-500">Trading Journal Pro+</h2>
          <p className="text-gray-400 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-dark-bg flex">
                    <Navbar />
                    <div className="flex-1 min-w-0 transition-all duration-300">
                      <DataSyncBanner />
                      <KeyboardShortcuts />
                      <main className="container mx-auto px-4 py-6 max-w-7xl">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/journal" element={<Journal />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/reflection" element={<Reflection />} />
                          <Route path="/rules" element={<Rules />} />
                          <Route path="/settings" element={<Settings />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#151922',
                color: '#e5e7eb',
                border: '1px solid #2d3748',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
