import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types/api.types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    minStock: 0,
    description: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await ApiService.getProducts();
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

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        const updateData: UpdateProductRequest = { ...formData };
        await ApiService.updateProduct(editingProduct.id, updateData);
      } else {
        await ApiService.createProduct(formData);
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
      name: '',
      category: '',
      quantity: 0,
      price: 0,
      minStock: 0,
      description: ''
    });
    setEditingProduct(null);
    setShowModal(false);
    setError('');
  };

  const handleEdit = (product: Product): void => {
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      minStock: product.minStock,
      description: product.description || ''
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await ApiService.deleteProduct(id);
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
    field: keyof CreateProductRequest, 
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
                    const status = getStockStatus(product.quantity, product.minStock);
                    return (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.name}</strong>
                          {product.description && (
                            <div className="text-muted small">
                              {product.description}
                            </div>
                          )}
                        </td>
                        <td>{product.category}</td>
                        <td>{product.quantity}</td>
                        <td>R$ {product.price.toFixed(2)}</td>
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
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
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
                          value={formData.quantity}
                          onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
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
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
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
                          value={formData.minStock}
                          onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
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
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
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