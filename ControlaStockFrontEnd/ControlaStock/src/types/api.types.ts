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
  localizacao?: string; // Opcional no frontend, será preenchido automaticamente no backend se vazio
}

export interface UpdateInventoryItemRequest {
  nome: string;
  descricao?: string;
  quantidade: number;
  localizacao?: string;
}

export interface User {
  id: number;
  email: string;
  nome?: string;
  cpf?: string;
  senha?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateUserRequest {
  email: string;
  senha: string;
  nome?: string;
  cpf?: string;
}

export interface UpdateUserRequest {
  email?: string;
  senha?: string;
  nome?: string;
  cpf?: string;
}

export interface ApiError {
  message: string;
  status?: number;
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
  nome?: string;
  cpf?: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  nome?: string;
  createdAt?: string;
}