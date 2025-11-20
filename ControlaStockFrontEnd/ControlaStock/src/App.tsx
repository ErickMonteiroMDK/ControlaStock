import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import { ApiService } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverOnline, setServerOnline] = useState<boolean>(true);

  useEffect(() => {
    const initializeApp = async (): Promise<void> => {
      try {
        console.log('🚀 Inicializando aplicação...');
        
        // Testar conexão com o servidor
        const isServerOnline = await ApiService.testConnection();
        setServerOnline(isServerOnline);

        if (isServerOnline) {
          // Verificar autenticação apenas se o servidor estiver online
          const isAuthenticated = ApiService.isLoggedIn();
          console.log('🔐 Status de autenticação:', isAuthenticated);
          
          if (isAuthenticated) {
            // Testar se o token ainda é válido fazendo uma requisição simples
            try {
              await ApiService.getInventoryItems();
              setIsLoggedIn(true);
              console.log('✅ Token válido, usuário autenticado');
            } catch {
              console.log('❌ Token inválido ou expirado');
              ApiService.logout();
              setIsLoggedIn(false);
            }
          } else {
            setIsLoggedIn(false);
          }
        } else {
          console.error('Servidor não está respondendo');
        }
      } catch {
        console.error('Erro ao inicializar a aplicação');
        setServerOnline(false);
      } finally {
        setLoading(false);
        console.log('✅ Aplicação inicializada');
      }
    };

    initializeApp();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await ApiService.login(email, password);
      if (result.success) {
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      if (error instanceof Error) {
        console.error('Mensagem de erro:', error.message);
      }
      return false;
    }
  };

  const handleRegister = async (
    nome: string,
    cpf: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result = await ApiService.register(nome, cpf, email, password);
      return result.success;
    } catch (error: unknown) {
      console.error('Erro no registro:', error);
      if (error instanceof Error) {
        console.error('Mensagem de erro:', error.message);
      }
      return false;
    }
  };

  const handleLogout = (): void => {
    ApiService.logout();
    setIsLoggedIn(false);
    console.log('👋 Usuário deslogado');
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
        <div className="alert alert-danger text-center" style={{ maxWidth: '500px' }}>
          <h4>🚫 Servidor Offline</h4>
          <p className="mb-3">Não foi possível conectar ao servidor. Verifique se:</p>
          <ul className="text-start mb-3">
            <li>O backend Spring Boot está rodando na porta 8080</li>
            <li>O comando <code>mvn spring-boot:run</code> foi executado</li>
            <li>Não há outros serviços usando a porta 8080</li>
          </ul>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/menu" /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/menu" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/registrar" 
            element={isLoggedIn ? <Navigate to="/menu" /> : <Register onRegister={handleRegister} />} 
          />
          <Route 
            path="/menu" 
            element={isLoggedIn ? <Menu onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/inventory" 
            element={isLoggedIn ? <Inventory /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;