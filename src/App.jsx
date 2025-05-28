import { useState } from 'react';
import LoginForm from './components/LoginForm';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import UserBadge from './components/UserBadge';
import ClientView from './components/ClientView';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

  const handleLoginSuccess = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProducts([]);
    setActiveTab('products');
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/products/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
      else alert(data.detail || 'Error al cargar productos');
    } catch {
      alert('Error de red al cargar productos');
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts([...products, newProduct]);
    setActiveTab('products');
  };

  const handleProductDeleted = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleProductUpdated = (updatedProduct) => {
    const updatedList = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedList);
  };

  const isAdmin = user?.is_admin === true;

  if (!token) return <LoginForm onLoginSuccess={handleLoginSuccess} />;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1rem', padding: '0.5rem 1rem', background: '#f0f2f5', borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0 }}>{isAdmin ? 'Panel de administración' : 'Tienda en línea'}</h2>
        {user && <UserBadge user={user} onLogout={handleLogout} />}
      </div>

      {isAdmin ? (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('products')}
              style={{ marginRight: '1rem', backgroundColor: '#2980b9', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none' }}
            >
              📦 Productos
            </button>
            <button
              onClick={() => setActiveTab('create')}
              style={{ marginRight: '1rem', backgroundColor: '#27ae60', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none' }}
            >
              ➕ Crear Productos
            </button>
            <button
              onClick={() => setActiveTab('token')}
              style={{ backgroundColor: '#8e44ad', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none' }}
            >
              🔑 Token
            </button>
          </div>

          {activeTab === 'products' && (
            <>
              <button onClick={fetchProducts} style={{ marginBottom: '1rem' }}>
                Cargar productos
              </button>
              <ProductList
                products={products}
                token={token}
                onDelete={handleProductDeleted}
                onUpdate={handleProductUpdated}
                user={user}
              />
            </>
          )}

          {activeTab === 'create' && (
            <ProductForm token={token} onProductCreated={handleProductCreated} />
          )}

          {activeTab === 'token' && (
            <>
              <p><strong>Token JWT:</strong></p>
              <textarea rows={5} cols={70} value={token} readOnly />
            </>
          )}
        </>
      ) : (
        <ClientView token={token} user={user} />
      )}
    </div>
  );
}

export default App;