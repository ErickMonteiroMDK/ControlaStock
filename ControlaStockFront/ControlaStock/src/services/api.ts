import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  User,
  ApiError
} from '../types/api.types';

const API_BASE_URL = 'http://localhost:8080';

export class ApiService {
  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('controlastock_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (error) {
        console.error('Erro ao ler a resposta do erro:', error);
      }
      
      const error: ApiError = {
        message: errorMessage,
        status: response.status
      };
      throw new Error(error.message);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    return response.text() as Promise<T>;
  }

  // Métodos de autenticação
  static async login(email: string, password: string): Promise<LoginResponse> {
    const credentials: LoginRequest = {
      email,
      senha: password
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await this.handleResponse<LoginResponse>(response);
    
    localStorage.setItem('controlastock_token', data.token);
    localStorage.setItem('controlastock_user', JSON.stringify({ email }));
    
    return data;
  }

  static async register(email: string, password: string): Promise<RegisterResponse> {
    const userData: RegisterRequest = {
      email,
      senha: password
    };

    const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    return this.handleResponse<RegisterResponse>(response);
  }

  static logout(): void {
    localStorage.removeItem('controlastock_token');
    localStorage.removeItem('controlastock_user');
  }

  static isLoggedIn(): boolean {
    return !!localStorage.getItem('controlastock_token');
  }

  static getCurrentUser(): User | null {
    const userString = localStorage.getItem('controlastock_user');
    if (!userString) {
      return null;
    }

    try {
      return JSON.parse(userString) as User;
    } catch (error) {
      console.error('Erro ao parse do usuário:', error);
      return null;
    }
  }

  // Métodos de produtos
  static async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<Product[]>(response);
  }

  static async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    return this.handleResponse<Product>(response);
  }

  static async updateProduct(id: number, productData: UpdateProductRequest): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    return this.handleResponse<Product>(response);
  }

  static async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    await this.handleResponse<void>(response);
  }
}

export default ApiService;
export type { Product, CreateProductRequest, UpdateProductRequest, LoginResponse, User };