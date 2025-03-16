// src/components/game/Player.js
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';

/**
 * Componente do jogador principal com física e controles
 */
const Player = forwardRef(({ playerName, playerColor, multiplayer, onGameOver }, ref) => {
  const rigidBodyRef = useRef(null);
  const meshRef = useRef(null);
  const canJumpRef = useRef(false);
  const { camera } = useThree();

  // Cria um objeto dummy para rastrear a posição do player
  const dummyRef = useRef(new THREE.Object3D());

  // Hook personalizado para controles do jogador
  const { keysRef } = usePlayerControls();

  // Mapeia as cores selecionadas para valores hexadecimais
  const getColorHex = () => {
    const colorMap = {
      'red': '#FF4500',
      'blue': '#1E90FF',
      'green': '#32CD32',
      'yellow': '#FFD700'
    };
    return colorMap[playerColor] || '#FF4500'; // Vermelho como cor padrão
  };

  // Expor o dummy através de getMesh para que a câmera possa usar sua posição
  useImperativeHandle(ref, () => ({
    getMesh: () => dummyRef.current,
  }));

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    // Atualiza a posição do dummy para a posição atual do rigidBody
    const pos = rigidBodyRef.current.translation();
    dummyRef.current.position.set(pos.x, pos.y, pos.z);

    // Se o player cair abaixo de um limiar, aciona o Game Over
    if (pos.y < -10) {
      onGameOver?.();
      return;
    }

    const speed = 5;
    const movement = new THREE.Vector3();

    // Calcula a direção de movimento com base na orientação da câmera (no plano XZ)
    const forwardVector = new THREE.Vector3();
    camera.getWorldDirection(forwardVector);
    forwardVector.y = 0;
    forwardVector.normalize();

    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(forwardVector, new THREE.Vector3(0, 1, 0)).normalize();

    if (keysRef.current['w']) movement.add(forwardVector);
    if (keysRef.current['s']) movement.sub(forwardVector);
    if (keysRef.current['a']) movement.sub(rightVector);
    if (keysRef.current['d']) movement.add(rightVector);

    if (movement.length() > 0) {
      movement.normalize().multiplyScalar(speed);
    }

    // Preserva a componente vertical da velocidade
    const currentVel = rigidBodyRef.current.linvel();
    rigidBodyRef.current.setLinvel(
      { x: movement.x, y: currentVel.y, z: movement.z },
      true
    );

    // Pulo: se espaço estiver pressionado e o player puder pular, aplica impulso vertical
    if (keysRef.current[' ']) {
      if (canJumpRef.current) {
        rigidBodyRef.current.applyImpulse({ x: 0, y: 7, z: 0 }, true);
        canJumpRef.current = false;
      }
    }

    // Envia a posição para o servidor multiplayer
    if (multiplayer && typeof multiplayer.sendMovement === 'function') {
      multiplayer.sendMovement([pos.x, pos.y, pos.z]);
    }
  });

  // Funções de colisão para detectar contato com o chão e permitir pulo
  const handleCollisionEnter = () => {
    canJumpRef.current = true;
  };

  const handleCollisionExit = () => {
    canJumpRef.current = false;
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders="cuboid"
      friction={0}         // Baixa fricção
      restitution={0.2}    // Restituição leve
      canSleep={false}     // Mantém o corpo ativo
      lockRotations={true} // Impede rotações indesejadas
      onCollisionEnter={handleCollisionEnter}
      onCollisionExit={handleCollisionExit}
      position={[0, 2, 0]}  // Inicia o player acima da plataforma
    >
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={getColorHex()} />
      </mesh>
      <Billboard position={[0, 1.5, 0]}>
        <Text fontSize={0.5} color="black" anchorX="center" anchorY="middle">
          {playerName}
        </Text>
      </Billboard>
    </RigidBody>
  );
});

export default Player;