import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import ResumeFormPage from './pages/ResumeFormPage';
import Export from './pages/Export';
import About from './pages/About';

function App() {
  return (
    <Router>
      {/* Global Toaster configuration */}
      <Toaster 
        position="bottom-center" 
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resume-form" element={<ResumeFormPage />} />
        <Route path="/export" element={<Export />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
