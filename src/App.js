// App.js
import React, { useState } from 'react';
import PlayerForm from './components/PlayerForm';
import MainScene from './scenes/MainScene';

function App() {
  const [playerName, setPlayerName] = useState('');
  // Se "gameOver" for true, mostramos a tela de Game Over ou voltamos para o login
  const [gameOver, setGameOver] = useState(false);

  const handlePlayAgain = () => {
    // Reseta o estado para forçar o jogador a inserir nome novamente
    setPlayerName('');
    setGameOver(false);
  };

  return (
    <>
      {playerName === '' || gameOver ? (
        <PlayerForm setPlayerName={setPlayerName} />
      ) : (
        <MainScene
          playerName={playerName}
          onGameOver={() => setGameOver(true)}
        />
      )}
      {/* Se preferir, pode exibir um modal de Game Over em vez de voltar direto ao login */}
    </>
  );
}

export default App;
