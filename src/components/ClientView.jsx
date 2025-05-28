import { useState, useEffect } from 'react';

function ClientView({ token }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/products/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => alert('Error al cargar productos'));
  }, [token]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const clearCart = () => {
    setCart([]);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>🛍️ Tienda en línea</h2>

      <input
        type="text"
        placeholder="🔍 Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: '12px',
          width: '100%',
          maxWidth: '500px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '2rem'
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
        {filtered.map((p) => (
          <div key={p.id} style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '1rem',
            backgroundColor: 'white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <img
              src={`data:image/png;base64,${p.image}`}
              alt={p.name}
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
            <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>{p.name}</h3>
            <p style={{ color: '#555' }}>{p.description}</p>
            <strong style={{ marginTop: '0.5rem', fontSize: '1.2rem', color: '#27ae60' }}>${p.price.toFixed(2)}</strong>
            <button
              onClick={() => addToCart(p)}
              style={{
                marginTop: '1rem',
                backgroundColor: '#3498db',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🛒 Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>🧺 Carrito ({cart.length} producto{cart.length !== 1 ? 's' : ''})</h3>
        {cart.length > 0 ? (
          <>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <button
              onClick={clearCart}
              style={{
                marginTop: '1rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Vaciar carrito 🧹
            </button>
          </>
        ) : (
          <p>El carrito está vacío.</p>
        )}
      </div>
    </div>
  );
}

export default ClientView;