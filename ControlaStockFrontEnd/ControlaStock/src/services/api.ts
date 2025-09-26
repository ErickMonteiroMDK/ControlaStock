import type {
  InventoryItem,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  User,
  CreateUserRequest,
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

  // ================== AUTENTICAÇÃO ==================
  static async login(email: string, password: string): Promise<{success: boolean}> {
    try {
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      const loginData = { 
        email: email, 
        senha: password 
      };

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        throw new Error(`Login falhou: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('controlastock_token', data.token);
        localStorage.setItem('controlastock_user', JSON.stringify({ email }));
        return { success: true };
      } else {
        throw new Error('Token não recebido na resposta');
      }
      
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async register(nome: string, cpf: string, email: string, password: string): Promise<{success: boolean}> {
    try {
      if (!nome || !cpf || !email || !password) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const userData = { 
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ''), // Remove pontos e traços, enviando apenas números
        email: email.trim().toLowerCase(), 
        senha: password
      };

      // CORREÇÃO: mudança de /auth/register para /auth/registrar
      const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
        mode: 'cors'
      });

      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText}. Resposta: ${responseBody || 'Sem detalhes'}`);
      }

      return { success: true };

    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return false;
    }
  }

  // ================== USUÁRIOS ==================
  static async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<User[]>(response);
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return this.handleResponse<User>(response);
  }

  // ================== INVENTÁRIO ==================
  static async getInventoryItems(): Promise<InventoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/inventario`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<InventoryItem[]>(response);
  }

  static async createInventoryItem(itemData: CreateInventoryItemRequest): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/inventario`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
    return this.handleResponse<InventoryItem>(response);
  }

  static async updateInventoryItem(
    id: number,
    itemData: UpdateInventoryItemRequest
  ): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/inventario/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    return this.handleResponse<InventoryItem>(response);
  }

  static async deleteInventoryItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/inventario/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar item: ${response.status}`);
    }
  }

  // ================== SESSÃO ==================
  static logout(): void {
    localStorage.removeItem('controlastock_token');
    localStorage.removeItem('controlastock_user');
  }

  static isLoggedIn(): boolean {
    const token = localStorage.getItem('controlastock_token');
    return !!token;
  }

  static getCurrentUser(): { email: string } | null {
    const userString = localStorage.getItem('controlastock_user');
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  }
}

export default ApiService;