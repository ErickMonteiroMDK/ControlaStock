import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface User {
  email: string;
  password: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('controlastock_users');
    const savedLogin = localStorage.getItem('controlastock_logged_user');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedLogin) {
      const loggedUser = JSON.parse(savedLogin);
      setIsLoggedIn(true);
      setUserEmail(loggedUser.email);
    }
  }, []);

  const handleLogin = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setUserEmail(email);
      localStorage.setItem('controlastock_logged_user', JSON.stringify({ email }));
      return true;
    }
    return false;
  };

  const handleRegister = (email: string, password: string): boolean => {
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return false;
    }
    
    const newUser = { email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('controlastock_users', JSON.stringify(updatedUsers));
    return true;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('controlastock_logged_user');
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
          <Route 
            path="/" 
            element={
              isLoggedIn ? (
                <div className="container mt-4">
                  <div className="text-center">
                    <h1 className="display-4 text-primary">ControlaStock</h1>
                    <p className="lead text-muted">Sistema de Controle de Estoque</p>
                    <p className="text-success">✅ Usuário logado: {userEmail}</p>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;