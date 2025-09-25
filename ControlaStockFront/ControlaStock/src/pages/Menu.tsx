import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
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
      color: 'info',
      disabled: true
    },
    {
      title: 'Configurações',
      description: 'Configure as preferências do sistema',
      icon: '⚙️',
      link: '/settings',
      color: 'secondary',
      disabled: true
    }
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="text-center mb-5">
            <h1 className="display-4 text-primary">
              <strong>ControlaStock</strong>
            </h1>
            <p className="lead text-muted">
              Sistema de Controle de Estoque
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="h3 text-center mb-4">Painel Principal</h2>
        </div>
      </div>

      <div className="row g-4">
        {menuItems.map((item, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center d-flex flex-column">
                <div className="mb-3">
                  <span style={{ fontSize: '3rem' }}>{item.icon}</span>
                </div>
                
                <h5 className="card-title text-dark">
                  {item.title}
                </h5>
                
                <p className="card-text text-muted flex-grow-1">
                  {item.description}
                </p>
                
                {item.disabled ? (
                  <button 
                    className={`btn btn-${item.color} disabled`}
                    disabled
                  >
                    Em Breve
                  </button>
                ) : (
                  <Link 
                    to={item.link} 
                    className={`btn btn-${item.color}`}
                  >
                    Acessar
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">
                <span className="text-primary">💡</span> Dica
              </h5>
              <p className="card-text mb-0">
                Comece cadastrando seus produtos no <strong>Inventário</strong> para 
                ter controle completo do seu estoque. Você pode adicionar, editar e 
                remover produtos facilmente.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="text-center text-muted">
            <small>
              © 2024 ControlaStock - Sistema de Controle de Estoque
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;