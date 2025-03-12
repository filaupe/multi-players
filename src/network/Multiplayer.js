import io from 'socket.io-client';
import { EventEmitter } from 'events';

const SOCKET_SERVER_URL = 'http://localhost:4000';

class Multiplayer extends EventEmitter {
  constructor(playerName) {
    super();
    this.playerName = playerName;
    this.socket = io(SOCKET_SERVER_URL);

    // Assim que conectar, armazena o ID do socket para filtrar o próprio player
    this.socket.on('connect', () => {
      this.myId = this.socket.id;
      console.log('Conectado ao servidor com ID:', this.myId);

      // Envia o evento de novo jogador
      this.socket.emit('newPlayer', { name: this.playerName });
    });

    // Recebe a lista de jogadores existentes
    this.socket.on('existingPlayers', (players) => {
      console.log('Recebi existingPlayers:', players);

      // Filtra o próprio ID
      const filtered = {};
      for (const id in players) {
        if (id !== this.myId) {
          filtered[id] = players[id];
        }
      }
      console.log('Filtrados (sem meu ID):', filtered);

      // Emite para que MainScene.js possa atualizar o estado
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

  // Método para enviar a posição atual do player
  sendMovement(position) {
    this.socket.emit('playerMovement', { position });
  }
}

export default Multiplayer;
