// src/scenes/MainScene.js
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import Multiplayer from '../network/Multiplayer';
import Player from '../components/Player';
import OtherPlayer from '../components/OtherPlayer';
import FollowOrbitControls from '../components/FollowOrbitControls';

function MainScene({ playerName, onGameOver }) {
  const [otherPlayers, setOtherPlayers] = useState({});
  const multiplayerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const mp = new Multiplayer(playerName);
    multiplayerRef.current = mp;

    mp.on('existingPlayers', (players) => {
      console.log('Existing players (filtered):', players);
      setOtherPlayers(players);
    });

    mp.on('playerJoined', (playerData) => {
      console.log('New player joined:', playerData);
      setOtherPlayers((prev) => ({ ...prev, [playerData.id]: playerData }));
    });

    mp.on('playerMoved', (data) => {
      setOtherPlayers((prev) => {
        const updated = { ...prev };
        if (updated[data.id]) {
          updated[data.id].position = data.position;
        }
        return updated;
      });
    });

    mp.on('playerDisconnected', (id) => {
      console.log('Player disconnected:', id);
      setOtherPlayers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    return () => {
      mp.removeAllListeners();
      mp.socket.disconnect();
    };
  }, [playerName]);

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh', display: 'block' }}
      camera={{ position: [0, 5, 10], fov: 60 }}
    >
      {/* Iluminação */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Cena com física */}
      <Physics>
        {/* Player local com física, iniciado em [0,2,0] para ficar sobre a plataforma */}
        <Player
          ref={playerRef}
          playerName={playerName}
          multiplayer={multiplayerRef.current}
          onGameOver={onGameOver}
        />

        {/* Renderiza os outros players */}
        {Object.keys(otherPlayers).map((id) => (
          <OtherPlayer key={id} data={otherPlayers[id]} />
        ))}

        {/* Chão físico: caixa fina horizontal, com face superior em y = 0 */}
        <RigidBody type="fixed">
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[100, 1, 100]} />
            <meshStandardMaterial color="lightgreen" />
          </mesh>
        </RigidBody>
      </Physics>

      {/* Câmera Orbit que segue o player */}
      <FollowOrbitControls playerRef={playerRef} distance={10} />
    </Canvas>
  );
}

export default MainScene;
