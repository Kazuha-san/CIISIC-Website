import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { Institutions } from './pages/Institutions';
import { IndustryLogin } from './pages/IndustryLogin';
import { IndustryDashboard } from './pages/IndustryDashboard';
import { SubmitProblem } from './pages/SubmitProblem';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { SubmissionDetails } from './pages/SubmissionDetails';

// Role-based Protected Route for Industry Partners
const IndustryRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/industry/login" replace />;
  }

  if (currentUser.role !== 'industry') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

// Role-based Protected Route for CII Administrators
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/industry/dashboard" replace />;
  }

  return <>{children}</>;
};

// Route controller that redirects already authenticated users
const GuestRoute: React.FC<{ children: React.ReactNode; role: 'industry' | 'admin' }> = ({ children, role }) => {
  const { currentUser } = useApp();

  if (currentUser && currentUser.role === role) {
    if (currentUser.role === 'industry') {
      return <Navigate to="/industry/dashboard" replace />;
    }
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <RootLayout>
          <Routes>
            {/* Public Hub Website */}
            <Route path="/" element={<Home />} />
            
            {/* Dedicated Partner Institutions Directory */}
            <Route path="/institutions" element={<Institutions />} />

            {/* Industry Portal Routes */}
            <Route 
              path="/industry/login" 
              element={
                <GuestRoute role="industry">
                  <IndustryLogin />
                </GuestRoute>
              } 
            />
            <Route 
              path="/industry/dashboard" 
              element={
                <IndustryRoute>
                  <IndustryDashboard />
                </IndustryRoute>
              } 
            />
            <Route 
              path="/industry/submit" 
              element={
                <IndustryRoute>
                  <SubmitProblem />
                </IndustryRoute>
              } 
            />

            {/* CII Administration Portal Routes */}
            <Route 
              path="/admin/login" 
              element={
                <GuestRoute role="admin">
                  <AdminLogin />
                </GuestRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/details/:id" 
              element={
                <AdminRoute>
                  <SubmissionDetails />
                </AdminRoute>
              } 
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
