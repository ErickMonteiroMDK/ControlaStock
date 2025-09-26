import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const user = ApiService.getCurrentUser();

  const handleLogout = () => {
    ApiService.logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Inventário',
      description: 'Gerencie seus produtos, estoque e categorias',
      icon: '📦',
      link: '/inventory',
      color: 'primary'
    },
    {
      title: 'Relatórios',
      description: 'Visualize relatórios de vendas e estoque',
      icon: '📊',
      link: '/reports',
      color: 'success',
      disabled: true
    },
    {
      title: 'Fornecedores',
      description: 'Cadastre e gerencie seus fornecedores',
      icon: '🏢',
      link: '/suppliers',
      color: 'warning',
      disabled: true
    },
    {
      title: 'Configurações',
      description: 'Configure as preferências do sistema',
      icon: '⚙️',
      link: '/settings',
      color: 'info',
      disabled: true
    }
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/menu">
            <i className="bi bi-box-seam me-2"></i>ControlaStock
          </Link>
          
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                     style={{width: '32px', height: '32px'}}>
                  <i className="bi bi-person text-primary"></i>
                </div>
                {user?.email}
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Meu perfil</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <div className="container py-5">
        {/* Welcome Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center">
              <h1 className="display-5 fw-bold text-dark mb-3">
                Bem-vindo, {user?.email}!
              </h1>
              <p className="lead text-muted">
                Gerencie seu estoque de forma eficiente e intuitiva
              </p>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="row g-4">
          {menuItems.map((item, index) => (
            <div key={index} className="col-xl-3 col-lg-4 col-md-6">
              <div className={`card h-100 border-0 shadow-sm transition-all${item.disabled ? ' opacity-50' : ''}`}>
                <div className="card-body text-center p-4 d-flex flex-column">
                  <div className="mb-3">
                    <div className={`bg-${item.color} rounded-circle d-inline-flex align-items-center justify-content-center`} 
                         style={{width: '80px', height: '80px'}}>
                      <span style={{fontSize: '2rem'}}>{item.icon}</span>
                    </div>
                  </div>
                  
                  <h5 className="card-title fw-bold text-dark mb-2">
                    {item.title}
                  </h5>
                  
                  <p className="card-text text-muted flex-grow-1">
                    {item.description}
                  </p>
                  
                  {item.disabled ? (
                    <button 
                      className={`btn btn-outline-${item.color} disabled mt-auto`}
                      disabled
                    >
                      <i className="bi bi-clock me-2"></i>Em Breve
                    </button>
                  ) : (
                    <Link 
                      to={item.link} 
                      className={`btn btn-${item.color} mt-auto`}
                    >
                      <i className="bi bi-arrow-right me-2"></i>Acessar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dica */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 bg-gradient-primary text-white">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 className="card-title mb-2">
                      <i className="bi bi-lightbulb me-2"></i>Dica Importante
                    </h5>
                    <p className="card-text mb-0">
                      Comece cadastrando seus produtos no <strong>Inventário</strong> para 
                      ter controle completo do seu estoque. Mantenha seus dados atualizados 
                      para relatórios precisos.
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <Link to="/inventory" className="btn btn-light btn-sm">
                      <i className="bi bi-arrow-right me-1"></i>Ir para Inventário
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="mb-0">
                <i className="bi bi-box-seam me-2"></i>ControlaStock
              </h6>
            </div>
            <div className="col-md-6 text-md-end">
              <small>© 2024 Sistema de Gestão de Estoque. Todos os direitos reservados.</small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;