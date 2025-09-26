import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description?: string;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    minStock: 0,
    description: ''
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('controlastock_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('controlastock_products', JSON.stringify(products));
  }, [products]);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...formData, id: editingProduct.id }
          : p
      ));
    } else {
      const newProduct: Product = {
        ...formData,
        id: Date.now()
      };
      setProducts([...products, newProduct]);
    }

    resetForm();
  };

  const resetForm = () => {
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
  };

  const handleEdit = (product: Product) => {
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

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { text: 'Sem estoque', class: 'danger' };
    if (quantity <= minStock) return { text: 'Estoque baixo', class: 'warning' };
    return { text: 'Em estoque', class: 'success' };
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
            >
              + Adicionar Produto
            </button>
          </div>
        </div>
      </div>

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

      <div className="row">
        <div className="col-12">
          {filteredProducts.length === 0 ? (
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
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(product.id)}
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
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
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
                          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
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
                          onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
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
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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