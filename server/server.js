const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const players = {};

io.on('connection', (socket) => {
  console.log('Novo cliente conectado: ' + socket.id);

  // Quando um novo jogador se conecta
  socket.on('newPlayer', (data) => {
    players[socket.id] = { id: socket.id, name: data.name, position: [0, 1, 0] };
    
    // Envia para o novo jogador a lista de jogadores existentes
    socket.emit('existingPlayers', players);
    
    // Notifica os demais jogadores sobre o novo jogador
    socket.broadcast.emit('playerJoined', players[socket.id]);
  });

  // Atualização de posição do jogador
  socket.on('playerMovement', (data) => {
    if (players[socket.id]) {
      players[socket.id].position = data.position;
      // Notifica os outros jogadores sobre a movimentação
      socket.broadcast.emit('playerMoved', { id: socket.id, position: data.position });
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado: ' + socket.id);
    delete players[socket.id];
    socket.broadcast.emit('playerDisconnected', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Servidor rodando na porta 4000');
});
