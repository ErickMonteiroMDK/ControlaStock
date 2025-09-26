import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Inventory from '../pages/Inventory';
import Login from '../pages/Login';
import Menu from '../pages/Menu';
import Register from '../pages/Register';
import { ApiService } from '../services/api';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = ApiService.isLoggedIn();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

const RootRedirect: React.FC = () => {
  const isLoggedIn = ApiService.isLoggedIn();
  return isLoggedIn ? <Navigate to="/menu" /> : <Navigate to="/login" />;
};

export function AppRoutes() {
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.login(email, password);
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/registrar" element={<Register onRegister={handleRegister} />} />
        <Route path="/" element={<RootRedirect />} />
        <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}