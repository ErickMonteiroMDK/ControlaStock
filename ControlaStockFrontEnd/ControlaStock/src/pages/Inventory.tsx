import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { 
  InventoryItem, 
  CreateInventoryItemRequest, 
  UpdateInventoryItemRequest 
} from '../types/api.types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<CreateInventoryItemRequest>({
    nome: '',
    quantidade: 0,
    descricao: '',
    localizacao: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await ApiService.getInventoryItems();
      setProducts(data);
      setError('');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar produtos');
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        const updateData: UpdateInventoryItemRequest = { ...formData };
        await ApiService.updateInventoryItem(editingProduct.id, updateData);
      } else {
        await ApiService.createInventoryItem(formData);
      }
      
      await loadProducts();
      resetForm();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erro ao salvar produto');
    }
  };

  const resetForm = (): void => {
    setFormData({
      nome: '',
      quantidade: 0,
      descricao: '',
      localizacao: ''
    });
    setEditingProduct(null);
    setShowModal(false);
    setError('');
  };

  const handleEdit = (product: InventoryItem): void => {
    setFormData({
      nome: product.nome,
      quantidade: product.quantidade,
      descricao: product.descricao || '',
      localizacao: product.localizacao || ''
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await ApiService.deleteInventoryItem(id);
        await loadProducts(); 
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Erro ao excluir produto');
      }
    }
  };

  const getStockStatus = (quantity: number): { text: string; class: string } => {
    if (quantity === 0) return { text: 'Sem estoque', class: 'danger' };
    if (quantity <= 5) return { text: 'Estoque baixo', class: 'warning' };
    return { text: 'Em estoque', class: 'success' };
  };

  const handleInputChange = (
    field: keyof CreateInventoryItemRequest, 
    value: string | number
  ): void => {
    setFormData((prev: CreateInventoryItemRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciar Estoque</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => window.history.back()}
        >
          ← Voltar ao Menu
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filtros */}
      <div className="d-flex mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Novo Produto
        </button>
      </div>

      {/* Tabela */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Nome</th>
              <th>Localização</th>
              <th>Quantidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const stockStatus = getStockStatus(product.quantidade);
                return (
                  <tr key={product.id}>
                    <td>{product.nome}</td>
                    <td>{product.localizacao || 'Não informado'}</td>
                    <td>{product.quantidade}</td>
                    <td>
                      <span className={`badge bg-${stockStatus.class}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center">Nenhum produto encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={resetForm}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.nome}
                      onChange={e => handleInputChange('nome', e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Localização</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.localizacao}
                      onChange={e => handleInputChange('localizacao', e.target.value)}
                      placeholder="Ex: Estoque Principal, Prateleira A1..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantidade</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.quantidade}
                      onChange={e => handleInputChange('quantidade', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea 
                      className="form-control"
                      value={formData.descricao}
                      onChange={e => handleInputChange('descricao', e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;