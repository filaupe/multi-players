// src/config/constants.js
import { SERVER_CONFIG } from './serverConfig';

// Exporta a configuração do servidor
export { SERVER_CONFIG };

// Configurações do jogador
export const PLAYER_CONFIG = {
  INITIAL_POSITION: [0, 2, 0],
  JUMP_FORCE: 7,
  MOVE_SPEED: 5,
  MAX_NAME_LENGTH: 15,
};

// Configurações da câmera
export const CAMERA_CONFIG = {
  DEFAULT_FOV: 60,
  DEFAULT_POSITION: [0, 5, 10],
  MIN_DISTANCE: 5,
  MAX_DISTANCE: 20,
  DEFAULT_DISTANCE: 10,
};

// Configurações do jogo
export const GAME_CONFIG = {
  GAME_OVER_HEIGHT: -10, // Altura em que o jogador perde
};