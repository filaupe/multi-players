import React, { useState, useEffect } from 'react';
import { SERVER_CONFIG } from '../../config/serverConfig';

/**
 * Componente que exibe informações de conexão para multiplayer
 */
function ConnectionInfo() {
  const [showInfo, setShowInfo] = useState(false);
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    // Extrai o endereço do servidor da configuração
    const serverUrl = new URL(SERVER_CONFIG.URL);
    setIpAddress(serverUrl.host);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      zIndex: 1000,
      fontFamily: '"Poppins", sans-serif',
      color: 'white',
      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
    }}>
      <button
        onClick={() => setShowInfo(!showInfo)}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {showInfo ? 'Ocultar Info' : 'Info Conexão'}
      </button>
      
      {showInfo && (
        <div style={{
          marginTop: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '15px',
          borderRadius: '5px',
          maxWidth: '300px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Informações de Conexão</h3>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
            Servidor: <span style={{ fontWeight: 'bold' }}>{ipAddress}</span>
          </p>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
            Para que outros jogadores se conectem, eles precisam usar o mesmo endereço de servidor.
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
            Nota: Para jogos em rede local, todos os dispositivos devem estar na mesma rede Wi-Fi.
          </p>
        </div>
      )}
    </div>
  );
}

export default ConnectionInfo;