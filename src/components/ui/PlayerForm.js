// src/components/ui/PlayerForm.js
import React, { useState } from 'react';

/**
 * Formulário para entrada do nome do jogador
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.setPlayerName - Função para definir o nome do jogador
 */
function PlayerForm({ setPlayerName }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação simples
    if (inputValue.trim() === '') {
      setError('Por favor, digite seu nome');
      return;
    }
    
    if (inputValue.length > 15) {
      setError('O nome deve ter no máximo 15 caracteres');
      return;
    }
    
    // Se passou na validação, define o nome do jogador
    setPlayerName(inputValue);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#282c34'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '300px',
        maxWidth: '90%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
          Multiplayer Game
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="playerName" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#555'
              }}
            >
              Seu Nome:
            </label>
            <input
              id="playerName"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
              placeholder="Digite seu nome"
              autoFocus
            />
            {error && (
              <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {error}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            Entrar no Jogo
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlayerForm;