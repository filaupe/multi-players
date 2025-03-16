// server/config/config.js

/**
 * Configurações do servidor
 */
module.exports = {
  // Porta em que o servidor vai rodar
  PORT: process.env.PORT || 4000,
  
  // Configurações do CORS
  CORS: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  
  // Configurações iniciais do jogador
  PLAYER: {
    INITIAL_POSITION: [0, 1, 0]
  }
};