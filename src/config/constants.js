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
  
  // Configurações de física do carro ajustadas para melhor controle
  ACCELERATION: 0.15,        // Taxa de aceleração por frame (aumentada para compensar curvas)
  MAX_SPEED: 12,             // Velocidade máxima mantida
  BRAKE_FORCE: 0.5,          // Força de frenagem (reduzida para frenagem mais suave)
  DRIFT_FACTOR: 0.5,         // Fator de aderência durante drift (reduzido para menos perda de velocidade)
  NORMAL_GRIP: 0.995,        // Aderência normal mantida
  RAMP_BOOST: 10,            // Força de impulso ao atingir uma rampa
  MIN_SPEED_FOR_RAMP: 5,     // Velocidade mínima para ativar o impulso da rampa
  CRITICAL_ANGLE: 130,       // Ângulo crítico (em graus) para reiniciar o jogo
  ROTATION_RECOVERY_SPEED: 0.1, // Velocidade de recuperação da rotação
  STEERING_SENSITIVITY: 0.035, // Sensibilidade da direção (reduzida para curvas mais suaves)
  TRACTION_CONTROL: 0.92,    // Controle de tração (aumentado para reduzir deslizamento e perda de velocidade)
  OBSTACLE_ASSIST: 0.6,      // Fator de assistência para superar obstáculos
  WHEEL_RADIUS: 0.2,         // Raio das rodas do carro
  MAX_OBSTACLE_HEIGHT: 0.1,  // Altura máxima de obstáculo que o carro pode superar (metade do raio da roda)
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