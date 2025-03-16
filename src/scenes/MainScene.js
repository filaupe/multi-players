// src/scenes/MainScene.js
import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment, Sky } from '@react-three/drei';
import Player from '../components/Player';
import OtherPlayer from '../components/OtherPlayer';
import FollowOrbitControls from '../components/FollowOrbitControls';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { CAMERA_CONFIG } from '../config/constants';
import GameControls from '../components/ui/gameControls/GameControls';
import { audioManager } from '../assets/audio';

/**
 * Componente para exibir mensagens de erro de conexão
 */
const ConnectionError = ({ message }) => (
  <div style={{
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '10px',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    color: 'white',
    borderRadius: '5px',
    zIndex: 1000
  }}>
    <p>Erro de conexão: {message}</p>
    <p>Tente recarregar a página.</p>
  </div>
);

/**
 * Cena principal do jogo
 * @param {Object} props - Propriedades do componente
 * @param {string} props.playerName - Nome do jogador
 * @param {string} props.playerColor - Cor do carro do jogador
 * @param {string} props.playerCar - ID do modelo do carro do jogador
 * @param {Function} props.onGameOver - Callback para quando o jogo termina
 */
function MainScene({ playerName, playerColor, playerCar, onGameOver }) {
  const { multiplayer, otherPlayers, connectionStatus, errorMessage } = useMultiplayer(playerName, playerColor, playerCar);
  const playerRef = useRef(null);

  // Pausa a música da tela inicial quando o jogo começa
  useEffect(() => {
    // Pausa qualquer música que esteja tocando
    if (audioManager.music) {
      audioManager.music.pause();
      audioManager.music.currentTime = 0;
      audioManager.music = null;
    }
    
    // Limpa quando o componente é desmontado
    return () => {
      // Qualquer limpeza necessária
    };
  }, []);

  // Função para lidar com o retorno ao menu principal
  const handleReturnToMainMenu = () => {
    // Desconecta o jogador se necessário
    if (multiplayer && multiplayer.disconnect) {
      multiplayer.disconnect();
    }
    
    // Chama a função onGameOver para voltar à tela inicial
    if (onGameOver) {
      onGameOver();
    }
  };

  return (
    <>
      {/* Exibe mensagem de erro se houver problemas de conexão */}
      {(connectionStatus === 'error' || connectionStatus === 'disconnected') && (
        <ConnectionError message={errorMessage} />
      )}
      
      {/* Controles do jogo */}
      <GameControls onReturnToMainMenu={handleReturnToMainMenu} />
      
      <Canvas
        style={{ width: '100vw', height: '100vh', display: 'block' }}
        shadows
        camera={{ 
          position: CAMERA_CONFIG.DEFAULT_POSITION, 
          fov: CAMERA_CONFIG.DEFAULT_FOV 
        }}
      >
        {/* Iluminação */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        
        {/* Céu */}
        <Sky sunPosition={[100, 10, 100]} />
        <Environment preset="city" />

        {/* Cena com física */}
        <Physics>
          {/* Player local com física */}
          <Player
            ref={playerRef}
            playerName={playerName}
            playerColor={playerColor}
            playerCar={playerCar}
            multiplayer={multiplayer}
            onGameOver={onGameOver}
          />

          {/* Renderiza os outros players */}
          {Object.keys(otherPlayers).map((id) => (
            <OtherPlayer key={id} data={otherPlayers[id]} />
          ))}

          {/* Chão físico: caixa fina horizontal, com face superior em y = 0 */}
          <RigidBody type="fixed">
            <mesh position={[0, -0.5, 0]} receiveShadow>
              <boxGeometry args={[100, 1, 100]} />
              <meshStandardMaterial color="lightgreen" />
            </mesh>
          </RigidBody>
          
          {/* Adiciona algumas plataformas para tornar o jogo mais interessante */}
          <RigidBody type="fixed" position={[10, 1, 10]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[5, 0.5, 5]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          </RigidBody>
          
          <RigidBody type="fixed" position={[-10, 2, -10]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[5, 0.5, 5]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          </RigidBody>
          
          <RigidBody type="fixed" position={[0, 3, -20]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[8, 0.5, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          </RigidBody>
        </Physics>

        {/* Câmera Orbit que segue o player */}
        <FollowOrbitControls 
          playerRef={playerRef} 
          distance={CAMERA_CONFIG.DEFAULT_DISTANCE}
          minDistance={CAMERA_CONFIG.MIN_DISTANCE}
          maxDistance={CAMERA_CONFIG.MAX_DISTANCE}
        />
      </Canvas>
    </>
  );
}

export default MainScene;