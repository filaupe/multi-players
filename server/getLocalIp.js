/**
 * Script para obter o endereço IP local do computador
 */
const os = require('os');

/**
 * Obtém o endereço IP local do computador
 * @returns {string|null} O endereço IP local ou null se não encontrado
 */
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  
  // Procura por interfaces de rede não-internas
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignora endereços IPv6 e interfaces de loopback
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  // Se não encontrar um IP não-interno, retorna localhost
  return '127.0.0.1';
}

// Obtém e exibe o IP local
const localIp = getLocalIpAddress();
console.log(`\n===== INFORMAÇÕES DE CONEXÃO MULTIPLAYER =====`);
console.log(`Endereço IP local: ${localIp}`);
console.log(`URL do servidor: http://${localIp}:4000`);
console.log(`\nPara que outros jogadores se conectem, eles devem usar:`);
console.log(`REACT_APP_SERVER_URL=http://${localIp}:4000 npm start`);
console.log(`\nOu editar src/config/serverConfig.js e definir:`);
console.log(`export const SERVER_ADDRESS = 'http://${localIp}:4000';`);
console.log(`\n===============================================\n`);

// Exporta a função para uso em outros arquivos
module.exports = { getLocalIpAddress };