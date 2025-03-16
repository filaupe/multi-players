// server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config/config');
const socketController = require('./controllers/socketController');
const { getLocalIpAddress } = require('./getLocalIp');

// Inicializa o servidor Express
const app = express();
const server = http.createServer(app);

// Configura o Socket.IO com CORS
const io = socketIo(server, { cors: config.CORS });

// Rota básica para verificar se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Servidor de multiplayer está rodando!');
});

// Manipula conexões de socket
io.on('connection', (socket) => {
  socketController.handleConnection(socket, io);
});

// Inicia o servidor
server.listen(config.PORT, '0.0.0.0', () => {
  const localIp = getLocalIpAddress();
  console.log(`\n===== SERVIDOR MULTIPLAYER INICIADO =====`);
  console.log(`Servidor rodando na porta ${config.PORT}`);
  console.log(`Endereço local: http://localhost:${config.PORT}`);
  console.log(`Endereço na rede: http://${localIp}:${config.PORT}`);
  console.log(`\nPara que outros jogadores se conectem, eles devem usar:`);
  console.log(`http://${localIp}:${config.PORT}`);
  console.log(`===========================================\n`);
});