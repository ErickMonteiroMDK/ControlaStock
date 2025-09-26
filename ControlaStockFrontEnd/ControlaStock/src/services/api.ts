import type {
  InventoryItem,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  User,
  CreateUserRequest,
  UpdateUserRequest,
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

  // Métodos de Usuários (baseado no Swagger)
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

  static async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });

    return this.handleResponse<User>(response);
  }

  static async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    await this.handleResponse<void>(response);
  }

  // Métodos de Inventário (baseado no Swagger)
  static async getInventoryItems(): Promise<InventoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/inventario`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<InventoryItem[]>(response);
  }

  static async getInventoryItem(id: number): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/inventario/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<InventoryItem>(response);
  }

  static async createInventoryItem(itemData: CreateInventoryItemRequest): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/inventario`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData)
    });

    return this.handleResponse<InventoryItem>(response);
  }

  static async updateInventoryItem(id: number, itemData: UpdateInventoryItemRequest): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/inventario/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData)
    });

    return this.handleResponse<InventoryItem>(response);
  }

  static async deleteInventoryItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/inventario/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    await this.handleResponse<void>(response);
  }

  static async addQuantityToItem(id: number, quantidade: number): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/inventario/${id}/adicionar`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ quantidade })
    });

    return this.handleResponse<InventoryItem>(response);
  }

  static async removeQuantityFromItem(id: number, quantidade: number): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/inventario/${id}/remover`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ quantidade })
    });

    return this.handleResponse<InventoryItem>(response);
  }

  // Métodos utilitários para compatibilidade com sistema de login simples
  // Agora usando o parâmetro password para validação básica
  static async login(email: string, password: string): Promise<{success: boolean}> {
    try {
      // Validação básica - você pode implementar lógica mais complexa aqui
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Simular uma verificação básica
      if (password.length < 3) {
        throw new Error('Senha muito curta');
      }

      // Como não há autenticação real, simular login local
      localStorage.setItem('controlastock_token', 'fake-token');
      localStorage.setItem('controlastock_user', JSON.stringify({ email }));
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async register(email: string, password: string): Promise<{success: boolean}> {
    try {
      // Validação básica
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      if (password.length < 3) {
        throw new Error('Senha deve ter pelo menos 3 caracteres');
      }

      // Usar createUser em vez de endpoint de registro separado
      await this.createUser({ email, senha: password });
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem('controlastock_token');
    localStorage.removeItem('controlastock_user');
  }

  static isLoggedIn(): boolean {
    return !!localStorage.getItem('controlastock_token');
  }

  static getCurrentUser(): { email: string } | null {
    const userString = localStorage.getItem('controlastock_user');
    if (!userString) {
      return null;
    }

    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error('Erro ao parse do usuário:', error);
      return null;
    }
  }

  // Health check
  static async healthCheck(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET'
    });

    return this.handleResponse<string>(response);
  }
}

export default ApiService;
export type { 
  InventoryItem, 
  CreateInventoryItemRequest, 
  UpdateInventoryItemRequest, 
  User,
  CreateUserRequest,
  UpdateUserRequest
};
