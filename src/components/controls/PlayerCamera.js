// src/components/controls/PlayerCamera.js
import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Câmera que segue o jogador em terceira pessoa
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.playerRef - Referência ao objeto do jogador
 * @param {number} props.distance - Distância da câmera ao jogador
 * @param {number} props.height - Altura da câmera em relação ao jogador
 */
function PlayerCamera({ playerRef, distance = 5, height = 2 }) {
  const { camera } = useThree();
  const cameraPositionRef = useRef(new THREE.Vector3());
  const cameraTargetRef = useRef(new THREE.Vector3());

  useFrame(() => {
    if (playerRef?.current?.getMesh) {
      const playerMesh = playerRef.current.getMesh();
      const playerPosition = playerMesh.position;

      // Calcula a posição desejada da câmera
      cameraPositionRef.current.set(
        playerPosition.x - distance, // Posição atrás do jogador
        playerPosition.y + height,   // Altura acima do jogador
        playerPosition.z             // Mesma coordenada Z
      );

      // Define o alvo como a posição do jogador
      cameraTargetRef.current.copy(playerPosition);

      // Atualiza a posição da câmera suavemente
      camera.position.lerp(cameraPositionRef.current, 0.1);
      
      // Faz a câmera olhar para o jogador
      camera.lookAt(cameraTargetRef.current);
    }
  });

  return null; // Este componente não renderiza nada visualmente
}

export default PlayerCamera;