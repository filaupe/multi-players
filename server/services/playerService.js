// server/services/playerService.js
const config = require('../config/config');

/**
 * Serviço para gerenciar os jogadores
 */
class PlayerService {
  constructor() {
    this.players = {};
  }

  /**
   * Adiciona um novo jogador
   * @param {string} id - ID do socket do jogador
   * @param {string} name - Nome do jogador
   * @returns {Object} Dados do jogador criado
   */
  addPlayer(id, name) {
    // Validação do nome do jogador
    const validName = name && typeof name === 'string' 
      ? name.trim().substring(0, 15) // Limita a 15 caracteres
      : 'Player_' + id.substring(0, 5);
    
    const player = {
      id,
      name: validName,
      position: config.PLAYER.INITIAL_POSITION
    };
    
    this.players[id] = player;
    return player;
  }

  /**
   * Atualiza a posição de um jogador
   * @param {string} id - ID do jogador
   * @param {Array} position - Nova posição [x, y, z]
   * @returns {Object|null} Dados do jogador atualizado ou null se não existir
   */
  updatePlayerPosition(id, position) {
    if (!this.players[id]) return null;
    
    // Validação da posição
    if (!position || !Array.isArray(position) || position.length !== 3) {
      return null;
    }
    
    // Validação de valores numéricos e limites
    const validPosition = position.map((coord, index) => {
      // Verifica se é um número
      if (typeof coord !== 'number' || isNaN(coord)) {
        return this.players[id].position[index];
      }
      
      // Limita valores extremos (opcional, ajuste conforme necessário)
      const MAX_COORD = 1000;
      return Math.max(-MAX_COORD, Math.min(MAX_COORD, coord));
    });
    
    this.players[id].position = validPosition;
    return this.players[id];
  }

  /**
   * Remove um jogador
   * @param {string} id - ID do jogador a ser removido
   */
  removePlayer(id) {
    delete this.players[id];
  }

  /**
   * Obtém todos os jogadores
   * @returns {Object} Objeto com todos os jogadores
   */
  getAllPlayers() {
    return this.players;
  }

  /**
   * Obtém um jogador específico
   * @param {string} id - ID do jogador
   * @returns {Object|null} Dados do jogador ou null se não existir
   */
  getPlayer(id) {
    return this.players[id] || null;
  }
}

module.exports = new PlayerService();