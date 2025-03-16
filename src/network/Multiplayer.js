// src/network/Multiplayer.js
import io from 'socket.io-client';
import { EventEmitter } from 'events';
import { SERVER_CONFIG } from '../config/constants';

/**
 * Classe para gerenciar a comunicação multiplayer via Socket.IO
 * @class Multiplayer
 * @extends EventEmitter
 */
class Multiplayer extends EventEmitter {
  /**
   * Cria uma instância do gerenciador de multiplayer
   * @param {string} playerName - Nome do jogador
   * @param {string} playerColor - Cor do carro do jogador
   * @param {string} playerCar - ID do modelo do carro do jogador
   */
  constructor(playerName, playerColor = 'red', playerCar = 'carro-vermelho') {
    super();
    this.playerName = playerName;
    this.playerColor = playerColor;
    this.playerCar = playerCar;
    this.socket = io(SERVER_CONFIG.URL);
    this.myId = null;

    this._setupEventListeners();
  }

  /**
   * Configura os listeners de eventos do socket
   * @private
   */
  _setupEventListeners() {
    // Evento de conexão
    this.socket.on('connect', () => {
      this.myId = this.socket.id;
      console.log('Conectado ao servidor com ID:', this.myId);

      // Envia o evento de novo jogador com nome e cor
      this.socket.emit('newPlayer', { 
        name: this.playerName,
        color: this.playerColor,
        car: this.playerCar
      });
    });
    
    // Evento de erro de conexão
    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão com o servidor:', error);
      this.emit('connectionError', error.message);
    });
    
    // Evento de desconexão
    this.socket.on('disconnect', (reason) => {
      console.warn('Desconectado do servidor:', reason);
      this.emit('disconnected', reason);
    });

    // Recebe a lista de jogadores existentes
    this.socket.on('existingPlayers', (players) => {
      console.log('Recebi existingPlayers:', players);

      // Filtra o próprio ID
      const filtered = this._filterOwnPlayer(players);
      console.log('Filtrados (sem meu ID):', filtered);

      // Emite para que os componentes possam atualizar o estado
      this.emit('existingPlayers', filtered);
    });

    // Quando um novo jogador entra
    this.socket.on('playerJoined', (playerData) => {
      // Se for meu próprio ID, ignora
      if (playerData.id === this.myId) return;
      this.emit('playerJoined', playerData);
    });

    // Quando um jogador se move
    this.socket.on('playerMoved', (data) => {
      // Se for meu próprio ID, ignora
      if (data.id === this.myId) return;
      this.emit('playerMoved', data);
    });

    // Quando um jogador sai
    this.socket.on('playerDisconnected', (id) => {
      // Se for meu próprio ID, ignora
      if (id === this.myId) return;
      this.emit('playerDisconnected', id);
    });
  }

  /**
   * Filtra o próprio jogador da lista de jogadores
   * @param {Object} players - Objeto com todos os jogadores
   * @returns {Object} Objeto filtrado sem o jogador atual
   * @private
   */
  _filterOwnPlayer(players) {
    const filtered = {};
    for (const id in players) {
      if (id !== this.myId) {
        filtered[id] = players[id];
      }
    }
    return filtered;
  }

  /**
   * Envia a posição atual do jogador para o servidor
   * @param {Array} position - Array [x, y, z] com a posição do jogador
   */
  sendMovement(position) {
    // Validação básica da posição antes de enviar
    if (!position || !Array.isArray(position) || position.length !== 3) {
      console.error('Posição inválida:', position);
      return;
    }
    
    // Verifica se todos os elementos são números
    if (position.some(coord => typeof coord !== 'number' || isNaN(coord))) {
      console.error('Coordenadas inválidas na posição:', position);
      return;
    }
    
    this.socket.emit('playerMovement', { position });
  }

  /**
   * Desconecta o socket e limpa os listeners
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.removeAllListeners();
    }
  }
}

export default Multiplayer;