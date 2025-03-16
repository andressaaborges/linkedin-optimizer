import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import ChatPage from './pages/chat';
import ProfileAnalysisPage from './pages/profile-analysis';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  if (isAuthenticated === null) {
    return null; // Loading state
  }

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/chat" 
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/profile-analysis" 
            element={isAuthenticated ? <ProfileAnalysisPage /> : <Navigate to="/login" replace />} 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;