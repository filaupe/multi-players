import React, { useState, useEffect } from 'react';
import { PLAYER_CONFIG } from '../config/constants';
import HomeAudioControls from '../components/audio/HomeAudioControls';
import ConnectionInfo from '../components/ui/ConnectionInfo';
import { audioManager } from '../assets/audio';
import CarSelector from '../components/cars/CarSelector';
import { getCarById } from '../assets/models/cars';

/**
 * Tela inicial do jogo Multi-Players
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.setPlayerName - Função para definir o nome do jogador
 * @param {Function} props.setPlayerColor - Função para definir a cor do carro do jogador
 * @param {Function} props.setPlayerCar - Função para definir o modelo do carro do jogador
 * @param {boolean} props.isGameOver - Indica se o jogador voltou do jogo
 * @param {Function} props.onPlayAgain - Função para jogar novamente
 * @param {string} props.playerNameValue - Nome do jogador salvo
 */
function HomeScreen({ 
  setPlayerName, 
  setPlayerColor, 
  setPlayerCar, 
  isGameOver = false, 
  onPlayAgain, 
  playerNameValue = '' 
}) {
  const [name, setName] = useState(playerNameValue);
  const [selectedCar, setSelectedCar] = useState('carro-vermelho');
  const [error, setError] = useState('');
  
  // Atualiza o nome quando playerNameValue muda
  useEffect(() => {
    if (playerNameValue) {
      setName(playerNameValue);
    }
  }, [playerNameValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reproduz o som de clique se não estiver mudo
    if (audioManager.sounds['click'] && !audioManager.isMuted) {
      audioManager.playSFX('click');
    }
    
    // Validação do nome
    const trimmedName = name.trim();
    
    if (trimmedName === '') {
      setError('Por favor, digite um nome válido');
      return;
    }
    
    if (trimmedName.length > PLAYER_CONFIG.MAX_NAME_LENGTH) {
      setError(`O nome deve ter no máximo ${PLAYER_CONFIG.MAX_NAME_LENGTH} caracteres`);
      return;
    }
    
    // Limpa o erro e define o nome e o carro
    setError('');
    
    // Se estiver voltando do jogo, chama a função para jogar novamente
    if (isGameOver && onPlayAgain) {
      onPlayAgain();
    }
    
    // Obtém o carro selecionado e sua cor
    const car = getCarById(selectedCar);
    const carColor = car ? car.color : '#FF0000';
    
    setPlayerName(trimmedName);
    setPlayerColor(carColor);
    
    // Se a função setPlayerCar estiver disponível, define o modelo do carro
    if (setPlayerCar) {
      setPlayerCar(selectedCar);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(to bottom, #0B132B, #3A506B)',
      fontFamily: '"Poppins", "Montserrat", sans-serif',
      padding: '0',
      margin: '0',
      overflow: 'hidden',
      boxSizing: 'border-box',
      position: 'fixed',
      top: '0',
      left: '0'
    }}>
      {/* Controles de áudio */}
      <HomeAudioControls />
      
      {/* Informações de conexão */}
      <ConnectionInfo />
      
      {/* Título do jogo */}
      <h1 style={{
        fontSize: 'clamp(32px, 5vw, 48px)',
        margin: '0 0 30px 0',
        color: 'transparent',
        backgroundImage: 'linear-gradient(to right, #c0c0c0, #ffffff, #c0c0c0)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        fontFamily: '"Audiowide", "Orbitron", sans-serif',
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        Multi-Players
      </h1>
      
      {/* Elementos decorativos - Bandeira quadriculada */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '8px',
        background: 'repeating-linear-gradient(to right, #000 0, #000 20px, #fff 20px, #fff 40px)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '8px',
        background: 'repeating-linear-gradient(to right, #000 0, #000 20px, #fff 20px, #fff 40px)'
      }}></div>
      
      {/* Formulário principal */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: 'clamp(20px, 4vw, 40px)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        width: 'clamp(280px, 90%, 700px)',
        maxHeight: '85vh',
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          {/* Título da seção */}
          <h2 style={{
            textAlign: 'center',
            color: '#ffffff',
            marginBottom: '25px',
            fontSize: 'clamp(20px, 3vw, 24px)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {isGameOver ? 'Jogar Novamente' : 'Entrar na Corrida'}
          </h2>
          
          {/* Campo de nome */}
          <div style={{ marginBottom: '25px' }}>
            <label 
              htmlFor="playerName" 
              style={{ 
                display: 'block', 
                marginBottom: '10px',
                fontWeight: 'bold',
                color: '#ffffff',
                fontSize: 'clamp(16px, 2vw, 18px)'
              }}
            >
              Nome do Piloto:
            </label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(12px, 2vw, 15px)',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Insira seu nome de jogador"
              maxLength={PLAYER_CONFIG.MAX_NAME_LENGTH}
              autoFocus
            />
            {error && (
              <p style={{ 
                color: '#FF6B6B', 
                marginTop: '5px', 
                fontSize: 'clamp(12px, 1.5vw, 14px)',
                fontWeight: 'bold'
              }}>
                {error}
              </p>
            )}
          </div>
          
          {/* Separador */}
          <div style={{
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            margin: '10px 0 25px 0'
          }}></div>
          
          {/* Seleção de carro */}
          <CarSelector 
            selectedCar={selectedCar}
            onSelectCar={setSelectedCar}
          />
          
          {/* Botão de entrada */}
          <button
            type="submit"
            onClick={(e) => {
              // Garantir que apenas este botão inicie o jogo
              e.stopPropagation();
            }}
            style={{
              width: '100%',
              padding: 'clamp(12px, 2vw, 18px)',
              backgroundColor: '#FF4500',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'clamp(16px, 2vw, 18px)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '20px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FF6A33'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF4500'}
          >
            {isGameOver ? 'Jogar Novamente' : 'Entrar na Corrida'}
          </button>
        </form>
      </div>
      
      {/* Instruções de jogo */}
      <div style={{
        marginTop: '20px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 'clamp(12px, 1.5vw, 14px)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <p>Use as teclas W, A, S, D para mover o carro e ESPAÇO para pular.</p>
      </div>
    </div>
  );
}

export default HomeScreen;