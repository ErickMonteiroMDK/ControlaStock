// src/types/api.types.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description?: string;
}

export interface UpdateProductRequest {
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome?: string;
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

export interface User {
  email: string;
}

export interface ApiError {
  message: string;
  status?: number;
}