// server/controllers/socketController.js
const playerService = require('../services/playerService');

/**
 * Controlador para gerenciar eventos de socket
 */
class SocketController {
  /**
   * Configura os handlers de eventos para um socket
   * @param {Object} socket - Objeto do socket
   * @param {Object} io - Instância do Socket.IO
   */
  handleConnection(socket, io) {
    console.log('Novo cliente conectado: ' + socket.id);

    // Quando um novo jogador se conecta
    socket.on('newPlayer', (data) => this.handleNewPlayer(socket, data));
    
    // Atualização de posição do jogador
    socket.on('playerMovement', (data) => this.handlePlayerMovement(socket, data));
    
    // Desconexão do jogador
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  /**
   * Manipula a entrada de um novo jogador
   * @param {Object} socket - Objeto do socket
   * @param {Object} data - Dados do novo jogador
   */
  handleNewPlayer(socket, data) {
    // Validação dos dados recebidos
    if (!data || typeof data !== 'object') {
      console.warn(`Dados inválidos recebidos de ${socket.id}`);
      data = {};
    }
    
    // Adiciona o jogador ao serviço
    const player = playerService.addPlayer(socket.id, data.name);
    
    // Envia para o novo jogador a lista de jogadores existentes
    socket.emit('existingPlayers', playerService.getAllPlayers());
    
    // Notifica os demais jogadores sobre o novo jogador
    socket.broadcast.emit('playerJoined', player);
  }

  /**
   * Manipula a atualização de posição de um jogador
   * @param {Object} socket - Objeto do socket
   * @param {Object} data - Dados de movimento
   */
  handlePlayerMovement(socket, data) {
    // Validação dos dados recebidos
    if (!data || typeof data !== 'object' || !data.position) {
      console.warn(`Dados de movimento inválidos recebidos de ${socket.id}`);
      return;
    }
    
    const updatedPlayer = playerService.updatePlayerPosition(socket.id, data.position);
    
    if (updatedPlayer) {
      // Notifica os outros jogadores sobre a movimentação
      socket.broadcast.emit('playerMoved', { 
        id: socket.id, 
        position: updatedPlayer.position // Usa a posição validada
      });
    }
  }

  /**
   * Manipula a desconexão de um jogador
   * @param {Object} socket - Objeto do socket
   */
  handleDisconnect(socket) {
    console.log('Cliente desconectado: ' + socket.id);
    
    // Remove o jogador do serviço
    playerService.removePlayer(socket.id);
    
    // Notifica os outros jogadores sobre a desconexão
    socket.broadcast.emit('playerDisconnected', socket.id);
  }
}

module.exports = new SocketController();