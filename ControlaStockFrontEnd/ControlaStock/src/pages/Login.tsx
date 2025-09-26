import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Email ou senha incorretos');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao fazer login');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-main-bg d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            
            {/* Card Principal */}
            <div className="auth-main-card">
              
              {/* Header com Gradiente */}
              <div className="auth-header">
                <span className="auth-icon">🔐</span>
                <h1 className="auth-title">Bem-vindo de Volta</h1>
                <p className="auth-subtitle">Entre na sua conta ControlaStock</p>
              </div>

              {/* Corpo do Card */}
              <div className="auth-body">
                
                {/* Mensagem de Erro */}
                {error && (
                  <div className="alert alert-danger alert-modern d-flex align-items-center mb-4">
                    <i className="bi bi-shield-exclamation me-3 fs-5"></i>
                    <span>{error}</span>
                  </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                  
                  {/* Campo Email */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope-fill"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  {/* Campo Senha */}
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock-fill"></i>
                      Senha
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      required
                    />
                  </div>

                  {/* Botão de Entrar */}
                  <button
                    type="submit"
                    className="btn btn-primary-modern w-100 py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-modern"></span>
                        ENTRANDO...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        ENTRAR NA CONTA
                      </>
                    )}
                  </button>
                </form>

                {/* Link para Registro */}
                <div className="auth-switch">
                  <p className="mb-0 text-muted">
                    Não tem uma conta?{' '}
                    <Link to="/registrar" className="fw-bold">
                      Criar conta agora
                    </Link>
                  </p>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="auth-footer mt-4">
              <p className="mb-0">
                © 2024 ControlaStock - Sistema de Gestão de Estoque
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;