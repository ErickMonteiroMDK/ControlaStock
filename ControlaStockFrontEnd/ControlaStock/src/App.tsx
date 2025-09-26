import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar'; // REMOVIDO - estava causando duplicação
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import { ApiService } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverOnline, setServerOnline] = useState<boolean>(true);

  useEffect(() => {
    const initializeApp = async (): Promise<void> => {
      // Testar conexão com o servidor
      const isServerOnline = await ApiService.testConnection();
      setServerOnline(isServerOnline);
      
      if (!isServerOnline) {
        console.error('Servidor não está respondendo');
      }

      // Verificar autenticação
      const isAuthenticated = ApiService.isLoggedIn();
      
      setIsLoggedIn(isAuthenticated);
      setLoading(false);
    };

    initializeApp();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.login(email, password);
      setIsLoggedIn(true);
      return true;
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const handleRegister = async (nome: string, cpf: string, email: string, password: string): Promise<boolean> => {
    try {
      await ApiService.register(nome, cpf, email, password);
      return true;
    } catch (error: unknown) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  // Adicionar função de logout que atualiza o estado
  const handleLogout = (): void => {
    ApiService.logout();
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Conectando ao servidor...</p>
        </div>
      </div>
    );
  }

  if (!serverOnline) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger text-center">
          <h4>Servidor Offline</h4>
          <p>Não foi possível conectar ao servidor. Verifique se o backend está rodando.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* NAVBAR REMOVIDA - cada página gerencia sua própria navbar */}
        
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/menu" /> : <Navigate to="/login" />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/menu" /> : <Login onLogin={handleLogin} />} />
          <Route path="/registrar" element={isLoggedIn ? <Navigate to="/menu" /> : <Register onRegister={handleRegister} />} />
          <Route path="/menu" element={isLoggedIn ? <Menu onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/inventory" element={isLoggedIn ? <Inventory /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;