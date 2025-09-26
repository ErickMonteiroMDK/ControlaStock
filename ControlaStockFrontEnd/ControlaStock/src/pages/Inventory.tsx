import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { 
  InventoryItem, 
  CreateInventoryItemRequest, 
  UpdateInventoryItemRequest 
} from '../services/api';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<CreateInventoryItemRequest>({
    nome: '',
    categoria: '',
    quantidade: 0,
    preco: 0,
    estoqueMinimo: 0,
    descricao: ''
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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao carregar produtos');
      }
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(products.map(p => p.categoria))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao salvar produto');
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      nome: '',
      categoria: '',
      quantidade: 0,
      preco: 0,
      estoqueMinimo: 0,
      descricao: ''
    });
    setEditingProduct(null);
    setShowModal(false);
    setError('');
  };

  const handleEdit = (product: InventoryItem): void => {
    setFormData({
      nome: product.nome,
      categoria: product.categoria,
      quantidade: product.quantidade,
      preco: product.preco,
      estoqueMinimo: product.estoqueMinimo,
      descricao: product.descricao || ''
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
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro ao excluir produto');
        }
      }
    }
  };

  const getStockStatus = (quantity: number, minStock: number): { text: string; class: string } => {
    if (quantity === 0) return { text: 'Sem estoque', class: 'danger' };
    if (quantity <= minStock) return { text: 'Estoque baixo', class: 'warning' };
    return { text: 'Em estoque', class: 'success' };
  };

  const handleInputChange = (
    field: keyof CreateInventoryItemRequest, 
    value: string | number
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2">Inventário</h1>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
              type="button"
            >
              + Adicionar Produto
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      {error && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <div className="text-muted">
            Total: {filteredProducts.length} produto(s)
          </div>
        </div>
      </div>

      {/* Tabela de produtos */}
      <div className="row">
        <div className="col-12">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">Nenhum produto encontrado</h5>
              <p className="text-muted">
                {products.length === 0 
                  ? 'Adicione seu primeiro produto para começar!'
                  : 'Tente ajustar os filtros de busca.'
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const status = getStockStatus(product.quantidade, product.estoqueMinimo);
                    return (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.nome}</strong>
                          {product.descricao && (
                            <div className="text-muted small">
                              {product.descricao}
                            </div>
                          )}
                        </td>
                        <td>{product.categoria}</td>
                        <td>{product.quantidade}</td>
                        <td>R$ {product.preco.toFixed(2)}</td>
                        <td>
                          <span className={`badge bg-${status.class}`}>
                            {status.text}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleEdit(product)}
                            type="button"
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(product.id)}
                            type="button"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome do Produto</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.categoria}
                      onChange={(e) => handleInputChange('categoria', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Quantidade</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={formData.quantidade}
                          onChange={(e) => handleInputChange('quantidade', parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Preço (R$)</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          step="0.01"
                          value={formData.preco}
                          onChange={(e) => handleInputChange('preco', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Estoque Mínimo</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={formData.estoqueMinimo}
                          onChange={(e) => handleInputChange('estoqueMinimo', parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Descrição (opcional)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.descricao || ''}
                      onChange={(e) => handleInputChange('descricao', e.target.value)}
                    ></textarea>
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
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
