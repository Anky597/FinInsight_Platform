import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoanChecker from './pages/LoanChecker';
import SegmentationAnalysis from './pages/SegmentationAnalysis';
import ComingSoon from './pages/ComingSoon';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/loan-checker"
              element={
                <ProtectedRoute>
                  <LoanChecker />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/segmentation-analysis" 
              element={
                <ProtectedRoute>
                  <SegmentationAnalysis />
                </ProtectedRoute>
              } 
            />
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;