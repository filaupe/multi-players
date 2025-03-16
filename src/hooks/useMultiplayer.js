// src/hooks/useMultiplayer.js
import { useEffect, useRef, useState } from 'react';
import Multiplayer from '../network/Multiplayer';

/**
 * Hook para gerenciar a conexão multiplayer
 * @param {string} playerName - Nome do jogador
 * @param {string} playerColor - Cor do carro do jogador
 * @param {string} playerCar - ID do modelo do carro do jogador
 * @returns {Object} Objeto contendo a referência ao multiplayer, os jogadores conectados e status de conexão
 */
export function useMultiplayer(playerName, playerColor = 'red', playerCar = 'carro-vermelho') {
  const [otherPlayers, setOtherPlayers] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [errorMessage, setErrorMessage] = useState('');
  const multiplayerRef = useRef(null);

  useEffect(() => {
    // Cria uma nova instância do Multiplayer
    const mp = new Multiplayer(playerName, playerColor, playerCar);
    multiplayerRef.current = mp;

    // Configura os listeners de eventos
    mp.on('existingPlayers', (players) => {
      console.log('Existing players (filtered):', players);
      setOtherPlayers(players);
      setConnectionStatus('connected');
    });

    mp.on('playerJoined', (playerData) => {
      console.log('New player joined:', playerData);
      setOtherPlayers((prev) => ({ ...prev, [playerData.id]: playerData }));
    });

    mp.on('playerMoved', (data) => {
      setOtherPlayers((prev) => {
        const updated = { ...prev };
        if (updated[data.id]) {
          updated[data.id].position = data.position;
        }
        return updated;
      });
    });

    mp.on('playerDisconnected', (id) => {
      console.log('Player disconnected:', id);
      setOtherPlayers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });
    
    // Eventos de erro de conexão
    mp.on('connectionError', (message) => {
      setConnectionStatus('error');
      setErrorMessage(message);
    });
    
    mp.on('disconnected', (reason) => {
      setConnectionStatus('disconnected');
      setErrorMessage(`Desconectado: ${reason}`);
    });

    // Limpa os listeners e desconecta quando o componente é desmontado
    return () => {
      mp.removeAllListeners();
      mp.disconnect();
    };
  }, [playerName, playerColor, playerCar]);

  return { 
    multiplayer: multiplayerRef.current, 
    otherPlayers,
    connectionStatus,
    errorMessage
  };
}