import React, { useState } from 'react';

function PlayerForm({ setPlayerName }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== '') {
      setPlayerName(name.trim());
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bem-vindo ao Multi-Players</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Digite seu nome" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default PlayerForm;
