import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  InventoryItem,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiError,
  LoginResponse,
  RegisterResponse,
  BackendError
} from '../types/api.types';

const API_BASE_URL = 'http://localhost:8080';

export class ApiService {
  private static axiosInstance: AxiosInstance;

  // Configuração inicial do axios
  static {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Interceptor para adicionar token automaticamente
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Não adicionar token para rotas públicas
        const publicRoutes = ['/auth/login', '/auth/registrar', '/health', '/favicon.ico'];
        if (publicRoutes.some(route => config.url?.includes(route))) {
          return config;
        }

        const token = localStorage.getItem('controlastock_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Token adicionado à requisição:', config.url);
        } else {
          console.warn('⚠️ Token não encontrado para rota protegida:', config.url);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para tratamento de respostas
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('✅ Resposta recebida:', response.status, response.config.url);
        return response;
      },
      (error: AxiosError<BackendError>) => {
        console.error('❌ Erro Axios:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // Extrai a mensagem de erro de forma tipada
        const errorData = error.response?.data;
        let errorMessage = 'Erro desconhecido';
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        const apiError: ApiError = {
          message: errorMessage,
          status: error.response?.status || 0
        };
        
        // Se token expirou ou é inválido, fazer logout automático
        if (error.response?.status === 401) {
          console.log('🔒 Token inválido ou expirado, fazendo logout...');
          this.logout();
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  // ================== AUTENTICAÇÃO ==================
  static async login(email: string, password: string): Promise<{success: boolean; user?: User}> {
    try {
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      const loginData = { 
        email: email.trim().toLowerCase(), 
        senha: password 
      };

      console.log('🔐 Tentando login com:', loginData);
      console.log('🔗 Endpoint: /auth/login');
      
      const response = await this.axiosInstance.post<LoginResponse>('/auth/login', loginData);
      
      if (response.data.token) {
        localStorage.setItem('controlastock_token', response.data.token);
        
        // Como seu LoginResponseDto só retorna token, precisamos buscar os dados do usuário
        try {
          const userProfile = await this.getCurrentUserProfile();
          localStorage.setItem('controlastock_user', JSON.stringify(userProfile));
          
          console.log('✅ Login realizado com sucesso, token salvo');
          return { success: true, user: userProfile };
        } catch {
          // Se não conseguir buscar o perfil, salva pelo menos o email
          localStorage.setItem('controlastock_user', JSON.stringify({ email: loginData.email }));
          console.log('✅ Login realizado, mas não foi possível buscar perfil completo');
          return { success: true, user: { email: loginData.email } as User };
        }
      } else {
        throw new Error('Token não recebido na resposta');
      }
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
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
        cpf: cpf.replace(/\D/g, ''), // Remove pontos e traços
        email: email.trim().toLowerCase(), 
        senha: password,
        role: 'USER'
      };

      console.log('📝 Tentando registrar usuário:', userData);
      console.log('🔗 Endpoint: /auth/registrar');
      
      await this.axiosInstance.post<RegisterResponse>('/auth/registrar', userData);
      console.log('✅ Usuário registrado com sucesso');
      
      return { success: true };

    } catch (error) {
      console.error('❌ Erro no registro:', error);
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      // Tenta acessar uma rota pública - agora usando /auth/login para testar
      await this.axiosInstance.get('/auth/login', { timeout: 3000 });
      return true;
    } catch (error: unknown) {
      // Verifica se é um AxiosError para acessar response de forma segura
      if (axios.isAxiosError(error)) {
        // Se for 405 (Method Not Allowed), significa que o endpoint existe mas não aceita GET
        if (error.response?.status === 405) {
          console.log('✅ Servidor online (endpoint existe)');
          return true;
        }
        // Se for 400, o servidor está online mas espera dados de login
        if (error.response?.status === 400) {
          console.log('✅ Servidor online (endpoint espera POST)');
          return true;
        }
        // Se for 404, tenta outro endpoint
        if (error.response?.status === 404) {
          console.log('⚠️ Endpoint /auth/login não encontrado, testando conexão básica...');
          // Testa conexão básica
          await axios.get(API_BASE_URL, { timeout: 3000 });
          console.log('✅ Servidor online (conexão básica OK)');
          return true;
        }
      }
      console.error('❌ Servidor offline:', error);
      return false;
    }
  }

  // ================== USUÁRIOS ==================
  static async getUsers(): Promise<User[]> {
    console.log('📋 Buscando lista de usuários...');
    const response = await this.axiosInstance.get<User[]>('/api/usuarios');
    return response.data;
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await this.axiosInstance.post<User>('/api/usuarios', userData);
    return response.data;
  }

  // ================== PERFIL DO USUÁRIO ==================
  static async getCurrentUserProfile(): Promise<User> {
    console.log('👤 Buscando perfil do usuário...');
    const response = await this.axiosInstance.get<User>('/api/usuarios/perfil');
    return response.data;
  }

  static async updateUserProfile(userData: UpdateUserRequest): Promise<User> {
    const response = await this.axiosInstance.put<User>('/api/usuarios/perfil', userData);
    return response.data;
  }

  static async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await this.axiosInstance.put<User>(`/api/usuarios/${id}`, userData);
    return response.data;
  }

  static async getUserById(id: number): Promise<User> {
    const response = await this.axiosInstance.get<User>(`/api/usuarios/${id}`);
    return response.data;
  }

  // ================== INVENTÁRIO ==================
static async getInventoryItems(): Promise<InventoryItem[]> {
  console.log('📦 Buscando itens do inventário...');
  try {
    const response = await this.axiosInstance.get<InventoryItem[]>('/api/inventario');
    console.log('✅ Itens encontrados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar itens:', error);
    throw error;
  }
}

static async createInventoryItem(itemData: CreateInventoryItemRequest): Promise<InventoryItem> {
  console.log('➕ Criando novo item:', itemData);
  
  try {
    // Garantir que os dados estejam no formato correto
    const formattedData = {
      nome: itemData.nome?.trim(),
      localizacao: itemData.localizacao?.trim(),
      quantidade: Number(itemData.quantidade) || 0,
      descricao: itemData.descricao?.trim()
    };

    console.log('📤 Dados formatados para envio:', formattedData);
    
    const response = await this.axiosInstance.post<InventoryItem>('/api/inventario', formattedData);
    console.log('✅ Item criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar item:', error);
    throw error;
  }
}

static async updateInventoryItem(
  id: number,
  itemData: UpdateInventoryItemRequest
): Promise<InventoryItem> {
  console.log('✏️ Atualizando item:', id, itemData);
  
  try {
    const response = await this.axiosInstance.put<InventoryItem>(`/api/inventario/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar item:', error);
    throw error;
  }
}

static async deleteInventoryItem(id: number): Promise<void> {
  console.log('🗑️ Deletando item:', id);
  
  try {
    await this.axiosInstance.delete(`/api/inventario/${id}`);
    console.log('✅ Item deletado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao deletar item:', error);
    throw error;
  }
}

  // ================== SESSÃO ==================
  static logout(): void {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('controlastock_token');
    localStorage.removeItem('controlastock_user');
  }

  static isLoggedIn(): boolean {
    const token = localStorage.getItem('controlastock_token');
    const isLogged = !!token;
    console.log('🔍 Verificando se está logado:', isLogged);
    return isLogged;
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('controlastock_token');
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