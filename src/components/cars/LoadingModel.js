import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Componente que exibe uma representação simples de carros em um ambiente 3D
 */
const LoadingModel = () => {
  const groupRef = useRef();
  
  // Animação suave de rotação
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Carro 1 - vermelho */}
      <group position={[-1.5, 0, 0]}>
        {/* Corpo do carro */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.2, 0.4]} />
          <meshStandardMaterial color="#cc0000" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Cabine */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.5, 0.15, 0.35]} />
          <meshStandardMaterial color="#cc0000" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Rodas */}
        <mesh position={[0.25, 0.1, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.25, 0.1, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0.25, 0.1, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.25, 0.1, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* Carro 2 - azul */}
      <group position={[0, 0, 0]}>
        {/* Corpo do carro */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.2, 0.4]} />
          <meshStandardMaterial color="#0066cc" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Cabine */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.5, 0.15, 0.35]} />
          <meshStandardMaterial color="#0066cc" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Rodas */}
        <mesh position={[0.25, 0.1, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.25, 0.1, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0.25, 0.1, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.25, 0.1, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* Carro 3 - verde */}
      <group position={[1.5, 0, 0]}>
        {/* Corpo do carro */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.2, 0.4]} />
          <meshStandardMaterial color="#00cc66" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Cabine */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.5, 0.15, 0.35]} />
          <meshStandardMaterial color="#00cc66" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Rodas */}
        <mesh position={[0.25, 0.1, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.25, 0.1, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0.25, 0.1, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.25, 0.1, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    </group>
  );
};

export default LoadingModel;