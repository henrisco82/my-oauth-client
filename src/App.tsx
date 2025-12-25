import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OAuthProvider } from '@/contexts/OAuthContext';
import { Home, Login, Authorized } from '@/pages';

const App: React.FC = () => {
  return (
    <Router>
      <OAuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/authorized" element={<Authorized />} />
        </Routes>
      </OAuthProvider>
    </Router>
  );
};

export default App;
