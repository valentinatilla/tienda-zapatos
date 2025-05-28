function UserBadge({ user, onLogout }) {
  const badgeStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '8px 14px',
    borderRadius: '999px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    fontSize: '14px',
    gap: '10px'
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #3498db'
  };

  const nameStyle = {
    fontWeight: 'bold',
    color: '#2c3e50'
  };

  const logoutBtnStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '13px'
  };

  return (
    <div style={badgeStyle}>
      <img
        src="https://i.pravatar.cc/300?img=5"
        alt="Perfil"
        style={avatarStyle}
      />
      <span style={nameStyle}>
  {user?.username || 'Usuario'} 
  {user?.role === 'admin' && ' 👑'}
</span>
      <button onClick={onLogout} style={logoutBtnStyle}>Salir</button>
    </div>
  );
}

export default UserBadge;