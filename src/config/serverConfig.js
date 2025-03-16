/**
 * Configuração do servidor para conexão multiplayer
 * 
 * Este arquivo permite configurar o endereço do servidor de forma flexível.
 * Para desenvolvimento local, use localhost.
 * Para permitir que outros jogadores se conectem, use seu IP local na rede.
 */

// Endereço do servidor - altere para seu IP local quando quiser que outros jogadores se conectem
// Exemplos:
// - Para desenvolvimento solo: 'http://localhost:4000'
// - Para multiplayer na rede local: 'http://192.168.1.100:4000' (substitua pelo seu IP)
export const SERVER_ADDRESS = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';

// Exporta a configuração completa do servidor
export const SERVER_CONFIG = {
  URL: SERVER_ADDRESS,
};