import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Inventory from '../pages/Inventory';
import Login from '../pages/Login';
import Menu from '../pages/Menu';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import { ApiService } from '../services/api';

export function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = ApiService.isLoggedIn();
        setIsLoggedIn(isAuthenticated);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.login(email, password);
      setIsLoggedIn(true); // Atualiza estado local
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleRegister = async (nome: string, cpf: string, email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.register(nome, cpf, email, password);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const handleLogout = (): void => {
    ApiService.logout();
    setIsLoggedIn(false); // Atualiza estado local
  };

  // Loading screen
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz com redirecionamento baseado no estado */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/menu" replace /> : <Navigate to="/login" replace />} 
        />
        
        {/* Rotas públicas - redireciona se já logado */}
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/menu" replace /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/registrar" 
          element={isLoggedIn ? <Navigate to="/menu" replace /> : <Register onRegister={handleRegister} />} 
        />
        
        {/* Rotas privadas - redireciona se não logado */}
        <Route 
          path="/menu" 
          element={isLoggedIn ? <Menu onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/inventory" 
          element={isLoggedIn ? <Inventory /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}