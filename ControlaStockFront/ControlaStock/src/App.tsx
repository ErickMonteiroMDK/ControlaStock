// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Verificar se há token salvo no localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          userEmail={userEmail} 
          onLogout={handleLogout} 
        />
        
        <Routes>
          {/* Suas rotas irão aqui futuramente */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
