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
      setError(error instanceof Error ? error.message : 'Erro ao carregar produtos');
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
      setError(error instanceof Error ? error.message : 'Erro ao salvar produto');
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
        setError(error instanceof Error ? error.message : 'Erro ao excluir produto');
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
    setFormData((prev: CreateInventoryItemRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mt-4">
      <h2>Gerenciar Estoque</h2>

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

        <select
          className="form-select"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

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
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const stockStatus = getStockStatus(product.quantidade, product.estoqueMinimo);
                return (
                  <tr key={product.id}>
                    <td>{product.nome}</td>
                    <td>{product.categoria}</td>
                    <td>{product.quantidade}</td>
                    <td>R$ {product.preco.toFixed(2)}</td>
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
                <td colSpan={6} className="text-center">Nenhum produto encontrado</td>
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
                    <label className="form-label">Categoria</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.categoria}
                      onChange={e => handleInputChange('categoria', e.target.value)}
                      required
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
                    <label className="form-label">Preço</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      step="0.01"
                      value={formData.preco}
                      onChange={e => handleInputChange('preco', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estoque Mínimo</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.estoqueMinimo}
                      onChange={e => handleInputChange('estoqueMinimo', Number(e.target.value))}
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
