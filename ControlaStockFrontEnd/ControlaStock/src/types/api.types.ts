// src/types/api.types.ts
export interface InventoryItem {
  id: number;
  nome: string;
  descricao?: string;
  quantidade: number;
  localizacao: string;
}

export interface CreateInventoryItemRequest {
  nome: string;
  descricao?: string;
  quantidade: number;
  localizacao: string;
}

export interface UpdateInventoryItemRequest {
  nome?: string;
  descricao?: string;
  quantidade?: number;
  localizacao?: string;
}

export interface User {
  id: number;
  email: string;
  nome: string;
  cpf: string;
  role: string;
  senha?: string;
  ultimoAcesso?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateUserRequest {
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  role: string;
}

export interface UpdateUserRequest {
  email?: string;
  senha?: string;
  nome?: string;
  cpf?: string;
  role?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface RegisterResponse {
  id: number;
  email: string;
  nome: string;
  cpf: string;
  role: string;
  createdAt?: string;
}

// Interface para a estrutura de erro padrão do backend
export interface BackendError {
  message?: string;
  error?: string;
  status?: number;
  path?: string;
  timestamp?: string;
}

// Interface para operações de quantidade
export interface QuantityOperation {
  quantidade: number;
}

// Mantidas para compatibilidade (podem ser removidas se não usadas)
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  role: string;
}