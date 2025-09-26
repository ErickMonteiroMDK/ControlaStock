import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Menu from './pages/Menu.tsx';
import Inventory from './pages/Inventory.tsx';
import { ApiService } from './services/api.ts';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Verificar se o usuário está logado ao inicializar
  useEffect(() => {
    const checkAuth = (): void => {
      const isAuthenticated = ApiService.isLoggedIn();
      const rawUser = ApiService.getCurrentUser();
      
      setIsLoggedIn(isAuthenticated);
      if (rawUser && typeof rawUser.email === 'string') {
        setUserEmail(rawUser.email);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.login(email, password); 
      setIsLoggedIn(true);
      setUserEmail(email);
      return true;
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const handleRegister = async (email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.register(email, password); 
      return true;
    } catch (error: unknown) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const handleLogout = (): void => {
    ApiService.logout();
    setIsLoggedIn(false);
    setUserEmail('');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          userEmail={userEmail} 
          onLogout={handleLogout}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              isLoggedIn ? <Navigate to="/menu" /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/login" 
            element={
              isLoggedIn ? (
                <Navigate to="/menu" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              isLoggedIn ? (
                <Navigate to="/menu" />
              ) : (
                <Register onRegister={handleRegister} />
              )
            } 
          />
          <Route 
            path="/menu" 
            element={
              isLoggedIn ? <Menu /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/inventory" 
            element={
              isLoggedIn ? <Inventory /> : <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;