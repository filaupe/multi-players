// src/components/controls/FollowOrbitControls.js
import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Controles de câmera que seguem o jogador
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.playerRef - Referência ao objeto do jogador
 * @param {number} props.distance - Distância da câmera ao jogador
 * @param {number} props.minDistance - Distância mínima da câmera
 * @param {number} props.maxDistance - Distância máxima da câmera
 */
function FollowOrbitControls({ 
  playerRef, 
  distance = 10, 
  minDistance = 5, 
  maxDistance = 20 
}) {
  const controlsRef = useRef();
  const { camera } = useThree();
  
  // Posição alvo para a câmera seguir
  const targetPosition = useRef(new THREE.Vector3());

  useFrame(() => {
    if (playerRef?.current?.getMesh && controlsRef.current) {
      // Obtém a posição atual do jogador
      const playerMesh = playerRef.current.getMesh();
      
      // Atualiza a posição alvo suavemente
      targetPosition.current.lerp(playerMesh.position, 0.1);
      
      // Define o alvo dos controles para a posição do jogador
      controlsRef.current.target.copy(targetPosition.current);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera]}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.5}
      minDistance={minDistance}
      maxDistance={maxDistance}
      maxPolarAngle={Math.PI / 2 - 0.1} // Limita a rotação para não ver por baixo do chão
    />
  );
}

export default FollowOrbitControls;