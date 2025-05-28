import { useState } from 'react';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const res = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onLoginSuccess(data.access_token, {
          username: data.username,
          is_admin: data.is_admin,
        });
      } else {
        alert(data.detail || 'Credenciales inválidas');
      }
    } catch (error) {
      alert('Error de red');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '1.5rem',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#2980b9',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;