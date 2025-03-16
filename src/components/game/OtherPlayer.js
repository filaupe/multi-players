// src/components/game/OtherPlayer.js
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Componente para renderizar outros jogadores na cena
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados do jogador (id, nome, posição, cor)
 */
function OtherPlayer({ data }) {
  const meshRef = useRef();

  // Mapeia as cores selecionadas para valores hexadecimais
  const getColorHex = () => {
    const colorMap = {
      'red': '#FF4500',
      'blue': '#1E90FF',
      'green': '#32CD32',
      'yellow': '#FFD700'
    };
    return colorMap[data.color] || '#1E90FF'; // Azul como cor padrão para outros jogadores
  };

  // Atualiza a posição de forma suave (interpolação)
  useFrame(() => {
    if (meshRef.current) {
      const targetPosition = new THREE.Vector3(...data.position);
      meshRef.current.position.lerp(targetPosition, 0.2);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={data.position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={getColorHex()} />
      </mesh>
      <Billboard position={[data.position[0], data.position[1] + 1.5, data.position[2]]}>
        <Text fontSize={0.5} color="black" anchorX="center" anchorY="middle">
          {data.name}
        </Text>
      </Billboard>
    </group>
  );
}

export default OtherPlayer;