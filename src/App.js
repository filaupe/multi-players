// App.js
import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import MainScene from './scenes/MainScene';
import { audioManager, relaxingGuitar } from './assets/audio';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState('red');
  const [playerCar, setPlayerCar] = useState('carro-vermelho');
  // Se "gameOver" for true, mostramos a tela de Game Over ou voltamos para o login
  const [gameOver, setGameOver] = useState(false);

  // Quando o jogo termina, esta função é chamada
  const handleGameOver = () => {
    setGameOver(true);
    
    // Reinicia a música da tela inicial
    if (!audioManager.sounds['homeMusic']) {
      audioManager.loadSound('homeMusic', relaxingGuitar);
    }
    audioManager.playMusic('homeMusic');
  };

  // Quando o jogador clica para jogar novamente
  const handlePlayAgain = () => {
    setGameOver(false);
  };

  return (
    <div className="App">
      {playerName === '' || gameOver ? (
        <HomeScreen 
          setPlayerName={setPlayerName} 
          setPlayerColor={setPlayerColor}
          setPlayerCar={setPlayerCar}
          isGameOver={gameOver}
          onPlayAgain={handlePlayAgain}
          playerNameValue={playerName}
        />
      ) : (
        <MainScene
          playerName={playerName}
          playerColor={playerColor}
          playerCar={playerCar}
          onGameOver={handleGameOver}
        />
      )}
    </div>
  );
}

export default App;
