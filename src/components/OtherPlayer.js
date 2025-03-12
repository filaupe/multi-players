import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

function OtherPlayer({ data }) {
  const meshRef = useRef();

  // Atualiza a posição de forma suave (você pode ajustar o fator de interpolação)
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
        <meshStandardMaterial color="blue" />
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
