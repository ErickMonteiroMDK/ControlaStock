import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Inventory from '../pages/Inventory';
import Login from '../pages/Login';
import Menu from '../pages/Menu';
import Register from '../pages/Register';
import { ApiService } from '../services/api';

// Componente para rotas protegidas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = ApiService.isLoggedIn();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

export function AppRoutes() {
  const isLoggedIn = ApiService.isLoggedIn();

  // Função para lidar com login
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.login(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Função para lidar com registro
  const handleRegister = async (email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.register(email, password);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      
      {/* Rota Raiz: redireciona com base no status de login */}
      <Route path="/" element={isLoggedIn ? <Navigate to="/menu" /> : <Navigate to="/login" />} />
      
      {/* Rotas Protegidas */}
      <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
    </Routes>
  );
}
