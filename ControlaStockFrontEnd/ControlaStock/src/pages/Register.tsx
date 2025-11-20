import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterProps {
  onRegister: (nome: string, cpf: string, email: string, password: string) => Promise<boolean>;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [nome, setNome] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!nome || !cpf || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
      setError('CPF deve estar no formato 000.000.000-00');
      setLoading(false);
      return;
    }

    try {
      const success = await onRegister(nome, cpf, email, password);
      if (success) {
        setSuccess('Conta criada com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao criar conta');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-main-bg d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-4">
            
            <div className="auth-main-card">
              
              {/* Header mais compacto */}
              <div className="auth-header pb-3">
                <span className="auth-icon">👤</span>
                <h1 className="auth-title mb-1">Criar Conta</h1>
                <p className="auth-subtitle mb-0">Junte-se ao ControlaStock</p>
              </div>

              <div className="auth-body">
                
                {error && (
                  <div className="alert alert-danger alert-modern d-flex align-items-center mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <span className="small">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success alert-modern d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle me-2"></i>
                    <span className="small">{success}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  {/* Campos com espaçamento reduzido */}
                  <div className="form-group mb-3">
                    <label htmlFor="nome" className="form-label mb-1">
                      <i className="bi bi-person-fill me-1"></i>
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="cpf" className="form-label mb-1">
                      <i className="bi bi-card-checklist me-1"></i>
                      CPF
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="cpf"
                      value={cpf}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label mb-1">
                      <i className="bi bi-envelope-fill me-1"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  {/* Senhas em linha para economizar espaço */}
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label mb-1">
                          <i className="bi bi-lock-fill me-1"></i>
                          Senha
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-sm"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 chars"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group mb-3">
                        <label htmlFor="confirmPassword" className="form-label mb-1">
                          <i className="bi bi-lock-fill me-1"></i>
                          Confirmar
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-sm"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repita a senha"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-modern w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-modern"></span>
                        CRIANDO...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        CRIAR CONTA
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-switch text-center">
                  <p className="mb-0 text-muted small">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="fw-bold">
                      Fazer login
                    </Link>
                  </p>
                </div>

              </div>
            </div>

            <div className="auth-footer mt-3">
              <p className="mb-0 small text-center">
                © 2025 ControlaStock
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;