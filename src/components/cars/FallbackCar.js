import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

/**
 * Modelo de fallback para quando o modelo 3D não puder ser carregado
 * @param {Object} props - Propriedades do componente
 * @param {string} props.color - Cor do carro
 */
const FallbackCar = ({ color = '#FF0000' }) => {
  const modelRef = useRef();
  
  // Rotação automática do modelo
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
    
    // Efeito de flutuação suave
    if (modelRef.current) {
      const time = state.clock.getElapsedTime();
      modelRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    }
  });
  
  return (
    <group
      ref={modelRef}
      scale={[0.5, 0.5, 0.5]}
      position={[0, -0.3, 0]}
    >
      <Box args={[1, 0.5, 2]} castShadow receiveShadow>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </Box>
      
      {/* Rodas */}
      <Box args={[0.3, 0.3, 0.3]} position={[-0.5, -0.3, 0.7]} castShadow>
        <meshStandardMaterial color="#333333" />
      </Box>
      <Box args={[0.3, 0.3, 0.3]} position={[0.5, -0.3, 0.7]} castShadow>
        <meshStandardMaterial color="#333333" />
      </Box>
      <Box args={[0.3, 0.3, 0.3]} position={[-0.5, -0.3, -0.7]} castShadow>
        <meshStandardMaterial color="#333333" />
      </Box>
      <Box args={[0.3, 0.3, 0.3]} position={[0.5, -0.3, -0.7]} castShadow>
        <meshStandardMaterial color="#333333" />
      </Box>
      
      {/* Janelas */}
      <Box args={[0.9, 0.3, 0.8]} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#87CEEB" metalness={0.8} roughness={0.2} />
      </Box>
    </group>
  );
};

export default FallbackCar;