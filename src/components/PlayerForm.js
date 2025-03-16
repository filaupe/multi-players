import React, { useState } from 'react';
import { PLAYER_CONFIG } from '../config/constants';

function PlayerForm({ setPlayerName }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação do nome
    const trimmedName = name.trim();
    
    if (trimmedName === '') {
      setError('Por favor, digite um nome válido');
      return;
    }
    
    if (trimmedName.length > PLAYER_CONFIG.MAX_NAME_LENGTH) {
      setError(`O nome deve ter no máximo ${PLAYER_CONFIG.MAX_NAME_LENGTH} caracteres`);
      return;
    }
    
    // Limpa o erro e define o nome
    setError('');
    setPlayerName(trimmedName);
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
          maxLength={PLAYER_CONFIG.MAX_NAME_LENGTH}
        />
        <button type="submit">Entrar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default PlayerForm;