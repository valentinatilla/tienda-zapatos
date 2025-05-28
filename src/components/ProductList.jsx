import { useState } from 'react';

function ProductList({ products, token, onDelete, onUpdate, user }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '', description: '', stock: '' });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setEditData({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock
    });
  };

  const cancelEditing = () => setEditingProduct(null);

  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:8000/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      const updated = await res.json();
      if (res.ok) {
        onUpdate(updated);
        setEditingProduct(null);
      } else {
        alert(updated.detail || 'Error al actualizar');
      }
    } catch {
      alert('Error de red al actualizar');
    }
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '1rem',
    backgroundColor: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    maxWidth: '400px',
    margin: '0 auto 2rem auto'
  };

  const buttonStyle = {
    marginRight: '0.5rem',
    padding: '10px 14px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {products.map((p) => (
        <div key={p.id} style={cardStyle}>
          {editingProduct?.id === p.id ? (
            <div>
              <input name="name" value={editData.name} onChange={handleEditChange} placeholder="Nombre" style={{ width: '100%', marginBottom: '0.5rem' }} />
              <input name="price" value={editData.price} onChange={handleEditChange} placeholder="Precio" style={{ width: '100%', marginBottom: '0.5rem' }} />
              <input name="stock" value={editData.stock} onChange={handleEditChange} placeholder="Stock" style={{ width: '100%', marginBottom: '0.5rem' }} />
              <textarea name="description" value={editData.description} onChange={handleEditChange} placeholder="Descripción" style={{ width: '100%', marginBottom: '0.5rem' }} />
              <button onClick={saveEdit} style={{ ...buttonStyle, backgroundColor: '#2ecc71', color: 'white' }}>Guardar</button>
              <button onClick={cancelEditing} style={{ ...buttonStyle, backgroundColor: '#95a5a6', color: 'white' }}>Cancelar</button>
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#2c3e50' }}>{p.name}</h3>
              <p><strong>Precio:</strong> ${p.price}</p>
              <p><strong>Descripción:</strong> {p.description}</p>
              <p><strong>Stock:</strong> {p.stock > 0 ? p.stock : 'Agotado'}</p>
              {p.image && (
                <img
                  src={`data:image/jpeg;base64,${p.image}`}
                  alt={p.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                />
              )}
              <button onClick={() => onDelete(p.id)} style={{ ...buttonStyle, backgroundColor: '#e74c3c', color: 'white' }}>🗑 Eliminar</button>
              <button onClick={() => startEditing(p)} style={{ ...buttonStyle, backgroundColor: '#f39c12', color: 'white' }}>✏ Editar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
