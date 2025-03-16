// src/scenes/MainScene.js
import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment, Sky } from '@react-three/drei';
import Player from '../components/Player';
import OtherPlayer from '../components/OtherPlayer';
import FollowOrbitControls from '../components/FollowOrbitControls';
import PlayerCamera from '../components/PlayerCamera';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { CAMERA_CONFIG } from '../config/constants';
import GameControls from '../components/ui/gameControls/GameControls';
import { audioManager } from '../assets/audio';
import Ramp from '../components/game/Ramp';
import GameHUD from '../components/ui/GameHUD';

// Importa os estilos do HUD
import '../assets/styles/GameHUD.css';

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
  
  // Estados para o HUD
  const [carSpeed, setCarSpeed] = useState(0);
  const [isDrifting, setIsDrifting] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 });
  const [playerRotation, setPlayerRotation] = useState(0);

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

  // Função para atualizar os dados do HUD
  const updateHUDData = (data) => {
    if (data.speed !== undefined) setCarSpeed(data.speed);
    if (data.isDrifting !== undefined) setIsDrifting(data.isDrifting);
    if (data.isFlying !== undefined) setIsFlying(data.isFlying);
    if (data.isUpsideDown !== undefined) setIsUpsideDown(data.isUpsideDown);
    if (data.position) setPlayerPosition({ x: data.position.x, z: data.position.z });
    if (data.rotation !== undefined) setPlayerRotation(data.rotation);
  };

  return (
    <>
      {/* Exibe mensagem de erro se houver problemas de conexão */}
      {(connectionStatus === 'error' || connectionStatus === 'disconnected') && (
        <ConnectionError message={errorMessage} />
      )}
      
      {/* Controles do jogo */}
      <GameControls onReturnToMainMenu={handleReturnToMainMenu} />
      
      {/* HUD do jogo */}
      <GameHUD 
        speed={carSpeed} 
        isDrifting={isDrifting} 
        isFlying={isFlying} 
        isUpsideDown={isUpsideDown}
        playerPosition={playerPosition}
        playerRotation={playerRotation}
        otherPlayers={Object.values(otherPlayers)}
      />
      
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
            onHUDUpdate={updateHUDData}
          />

          {/* Renderiza os outros players */}
          {Object.keys(otherPlayers).map((id) => (
            <OtherPlayer key={id} data={otherPlayers[id]} />
          ))}

          {/* Chão físico: caixa fina horizontal, com face superior em y = 0 */}
          <RigidBody type="fixed">
            <mesh position={[0, -0.5, 0]} receiveShadow>
              <boxGeometry args={[500, 1, 500]} />
              <meshStandardMaterial color="#8BC34A" />
            </mesh>
          </RigidBody>
          
          {/* Pista de corrida circular gigante */}
          <RigidBody type="fixed" position={[0, 0.01, 0]}>
            <group>
              {/* Pista circular externa */}
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
                <ringGeometry args={[80, 100, 64]} />
                <meshStandardMaterial color="#555555" />
              </mesh>
              
              {/* Reta de chegada */}
              <mesh position={[90, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
                <boxGeometry args={[10, 0.1, 20]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              
              {/* Marcações na pista */}
              {Array.from({ length: 16 }).map((_, index) => {
                const angle = (index * Math.PI) / 8;
                const x = 90 * Math.cos(angle);
                const z = 90 * Math.sin(angle);
                return (
                  <mesh key={`mark-${index}`} position={[x, 0.02, z]} rotation={[0, angle + Math.PI/2, 0]} receiveShadow>
                    <boxGeometry args={[2, 0.05, 5]} />
                    <meshStandardMaterial color="#FFFF00" />
                  </mesh>
                );
              })}
            </group>
          </RigidBody>
          
          {/* Barreiras externas */}
          {Array.from({ length: 32 }).map((_, index) => {
            const angle = (index * Math.PI) / 16;
            const x = 105 * Math.cos(angle);
            const z = 105 * Math.sin(angle);
            return (
              <RigidBody key={`barrier-ext-${index}`} type="fixed" position={[x, 0, z]} rotation={[0, angle + Math.PI/2, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[20, 2, 1]} />
                  <meshStandardMaterial color="#FF0000" />
                </mesh>
              </RigidBody>
            );
          })}
          
          {/* Barreiras internas */}
          {Array.from({ length: 24 }).map((_, index) => {
            const angle = (index * Math.PI) / 12;
            const x = 75 * Math.cos(angle);
            const z = 75 * Math.sin(angle);
            return (
              <RigidBody key={`barrier-int-${index}`} type="fixed" position={[x, 0, z]} rotation={[0, angle + Math.PI/2, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[15, 1.5, 1]} />
                  <meshStandardMaterial color="#0000FF" />
                </mesh>
              </RigidBody>
            );
          })}
          
          {/* Rampas estrategicamente posicionadas */}
          <Ramp 
            position={[0, 0, 90]} 
            rotation={[0, 0, 0]} 
            size={[15, 3, 8]} 
            color="#FF5500" 
          />
          
          <Ramp 
            position={[0, 0, -90]} 
            rotation={[0, Math.PI, 0]} 
            size={[15, 3, 8]} 
            color="#FF5500" 
          />
          
          <Ramp 
            position={[90, 0, 0]} 
            rotation={[0, -Math.PI/2, 0]} 
            size={[15, 3, 8]} 
            color="#FF5500" 
          />
          
          <Ramp 
            position={[-90, 0, 0]} 
            rotation={[0, Math.PI/2, 0]} 
            size={[15, 3, 8]} 
            color="#FF5500" 
          />
          
          {/* Obstáculos na pista */}
          {Array.from({ length: 12 }).map((_, index) => {
            const angle = (index * Math.PI) / 6;
            const radius = 90; // Raio médio da pista
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            return (
              <RigidBody key={`obstacle-${index}`} type="fixed" position={[x, 0.5, z]}>
                <mesh castShadow>
                  <coneGeometry args={[1, 2, 16]} />
                  <meshStandardMaterial color="#FF5500" />
                </mesh>
              </RigidBody>
            );
          })}
        </Physics>

        {/* Câmera que segue o player */}
        <PlayerCamera playerRef={playerRef} />
      </Canvas>
    </>
  );
}

export default MainScene;