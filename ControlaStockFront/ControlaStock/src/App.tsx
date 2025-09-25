import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;