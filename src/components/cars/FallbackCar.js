import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Modelo de fallback para quando o modelo 3D não puder ser carregado
 * @param {Object} props - Propriedades do componente
 * @param {string} props.color - Cor do carro
 */
const FallbackCar = ({ color = '#FF69B4' }) => {
  const modelRef = useRef();
  
  // Cores derivadas para detalhes
  const darkerColor = useMemo(() => {
    const tempColor = new THREE.Color(color);
    tempColor.multiplyScalar(0.7); // 30% mais escuro
    return tempColor;
  }, [color]);
  
  const lighterColor = useMemo(() => {
    const tempColor = new THREE.Color(color);
    tempColor.multiplyScalar(1.2); // 20% mais claro
    return tempColor;
  }, [color]);
  
  // Material para vidros - mais translúcido e refletivo
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#1a1a2e',
      metalness: 0.3,
      roughness: 0.05,
      transmission: 0.95, // Maior transparência
      reflectivity: 0.7,  // Maior reflexão
      clearcoat: 0.8,     // Mais brilho
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
      ior: 1.5 // Índice de refração similar ao vidro real
    });
  }, []);
  
  // Material para pneus - preto fosco
  const tireMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      metalness: 0.1,
      roughness: 0.8
    });
  }, []);
  
  // Material para aros das rodas - metálico brilhante
  const wheelRimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e0e0e0',
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.5
    });
  }, []);
  
  // Material para detalhes cromados
  const chromeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e8e8e8',
      metalness: 1.0,
      roughness: 0.05,
      envMapIntensity: 2.0
    });
  }, []);
  
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
      {/* Corpo principal do carro - mais aerodinâmico */}
      <Box args={[1, 0.35, 2.2]} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.7} 
          clearcoatRoughness={0.1}
        />
      </Box>
      
      {/* Teto do carro */}
      <Box args={[0.9, 0.15, 1.4]} position={[0, 0.15, -0.1]} castShadow>
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.7} 
          clearcoatRoughness={0.1}
        />
      </Box>
      
      {/* Capô dianteiro - mais baixo e esportivo */}
      <Box args={[0.95, 0.2, 0.9]} position={[0, 0.02, 0.7]} castShadow>
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.8} 
          clearcoatRoughness={0.1}
        />
      </Box>
      
      {/* Frente inclinada para design mais esportivo */}
      <Box 
        args={[0.9, 0.15, 0.2]} 
        position={[0, 0.05, 1.15]} 
        rotation={[0.2, 0, 0]} 
        castShadow
      >
        <meshPhysicalMaterial 
          color={lighterColor} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.8}
        />
      </Box>
      
      {/* Traseira do carro - mais elevada e esportiva */}
      <Box args={[0.95, 0.3, 0.4]} position={[0, 0.1, -0.9]} castShadow>
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.5} 
          clearcoatRoughness={0.1}
        />
      </Box>
      
      {/* Rodas - corrigidas para orientação correta */}
      {/* Roda dianteira esquerda */}
      <group position={[-0.52, -0.22, 0.7]}>
        <Cylinder 
          args={[0.28, 0.28, 0.18, 24]} 
          rotation={[0, 0, Math.PI/2]} 
          castShadow
        >
          <primitive object={tireMaterial} />
        </Cylinder>
        <Torus 
          args={[0.22, 0.04, 16, 24]} 
          rotation={[Math.PI/2, 0, 0]} 
          castShadow
        >
          <primitive object={wheelRimMaterial} />
        </Torus>
        {/* Centro da roda */}
        <Box 
          args={[0.01, 0.1, 0.1]} 
          position={[0.09, 0, 0]} 
          castShadow
        >
          <primitive object={chromeMaterial} />
        </Box>
        {/* Raios da roda */}
        {[...Array(5)].map((_, i) => (
          <Box 
            key={i} 
            args={[0.01, 0.04, 0.2]} 
            position={[0.09, 0, 0]} 
            rotation={[(i * Math.PI/2.5), 0, 0]} 
            castShadow
          >
            <primitive object={wheelRimMaterial} />
          </Box>
        ))}
      </group>
      
      {/* Roda dianteira direita */}
      <group position={[0.52, -0.22, 0.7]}>
        <Cylinder 
          args={[0.28, 0.28, 0.18, 24]} 
          rotation={[0, 0, Math.PI/2]} 
          castShadow
        >
          <primitive object={tireMaterial} />
        </Cylinder>
        <Torus 
          args={[0.22, 0.04, 16, 24]} 
          rotation={[Math.PI/2, 0, 0]} 
          castShadow
        >
          <primitive object={wheelRimMaterial} />
        </Torus>
        {/* Centro da roda */}
        <Box 
          args={[0.01, 0.1, 0.1]} 
          position={[-0.09, 0, 0]} 
          castShadow
        >
          <primitive object={chromeMaterial} />
        </Box>
        {/* Raios da roda */}
        {[...Array(5)].map((_, i) => (
          <Box 
            key={i} 
            args={[0.01, 0.04, 0.2]} 
            position={[-0.09, 0, 0]} 
            rotation={[(i * Math.PI/2.5), 0, 0]} 
            castShadow
          >
            <primitive object={wheelRimMaterial} />
          </Box>
        ))}
      </group>
      
      {/* Roda traseira esquerda */}
      <group position={[-0.52, -0.22, -0.7]}>
        <Cylinder 
          args={[0.28, 0.28, 0.18, 24]} 
          rotation={[0, 0, Math.PI/2]} 
          castShadow
        >
          <primitive object={tireMaterial} />
        </Cylinder>
        <Torus 
          args={[0.22, 0.04, 16, 24]} 
          rotation={[Math.PI/2, 0, 0]} 
          castShadow
        >
          <primitive object={wheelRimMaterial} />
        </Torus>
        {/* Centro da roda */}
        <Box 
          args={[0.01, 0.1, 0.1]} 
          position={[0.09, 0, 0]} 
          castShadow
        >
          <primitive object={chromeMaterial} />
        </Box>
        {/* Raios da roda */}
        {[...Array(5)].map((_, i) => (
          <Box 
            key={i} 
            args={[0.01, 0.04, 0.2]} 
            position={[0.09, 0, 0]} 
            rotation={[(i * Math.PI/2.5), 0, 0]} 
            castShadow
          >
            <primitive object={wheelRimMaterial} />
          </Box>
        ))}
      </group>
      
      {/* Roda traseira direita */}
      <group position={[0.52, -0.22, -0.7]}>
        <Cylinder 
          args={[0.28, 0.28, 0.18, 24]} 
          rotation={[0, 0, Math.PI/2]} 
          castShadow
        >
          <primitive object={tireMaterial} />
        </Cylinder>
        <Torus 
          args={[0.22, 0.04, 16, 24]} 
          rotation={[Math.PI/2, 0, 0]} 
          castShadow
        >
          <primitive object={wheelRimMaterial} />
        </Torus>
        {/* Centro da roda */}
        <Box 
          args={[0.01, 0.1, 0.1]} 
          position={[-0.09, 0, 0]} 
          castShadow
        >
          <primitive object={chromeMaterial} />
        </Box>
        {/* Raios da roda */}
        {[...Array(5)].map((_, i) => (
          <Box 
            key={i} 
            args={[0.01, 0.04, 0.2]} 
            position={[-0.09, 0, 0]} 
            rotation={[(i * Math.PI/2.5), 0, 0]} 
            castShadow
          >
            <primitive object={wheelRimMaterial} />
          </Box>
        ))}
      </group>
      
      {/* Janelas - vidro de alta qualidade */}
      <Box args={[0.85, 0.2, 1.2]} position={[0, 0.25, 0]} castShadow>
        <primitive object={glassMaterial} />
      </Box>
      
      {/* Para-brisa dianteiro inclinado */}
      <Box 
        args={[0.85, 0.01, 0.5]} 
        position={[0, 0.25, 0.6]} 
        rotation={[Math.PI/6, 0, 0]} 
        castShadow
      >
        <primitive object={glassMaterial} />
      </Box>
      
      {/* Para-brisa traseiro inclinado */}
      <Box 
        args={[0.85, 0.01, 0.5]} 
        position={[0, 0.25, -0.6]} 
        rotation={[-Math.PI/6, 0, 0]} 
        castShadow
      >
        <primitive object={glassMaterial} />
      </Box>
      
      {/* Faróis integrados ao design - mais harmoniosos */}
      <Box 
        args={[0.22, 0.08, 0.05]} 
        position={[-0.35, 0.08, 1.12]} 
        rotation={[0.1, 0, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF" 
          emissiveIntensity={1.2} 
          toneMapped={false}
        />
      </Box>
      <Box 
        args={[0.22, 0.08, 0.05]} 
        position={[0.35, 0.08, 1.12]} 
        rotation={[0.1, 0, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF" 
          emissiveIntensity={1.2} 
          toneMapped={false}
        />
      </Box>
      
      {/* Lanternas traseiras */}
      <Box args={[0.2, 0.1, 0.05]} position={[-0.35, 0.15, -1.1]} castShadow>
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000" 
          emissiveIntensity={1.0} 
          toneMapped={false}
        />
      </Box>
      <Box args={[0.2, 0.1, 0.05]} position={[0.35, 0.15, -1.1]} castShadow>
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000" 
          emissiveIntensity={1.0} 
          toneMapped={false}
        />
      </Box>
      
      {/* Para-choque dianteiro esportivo com entradas de ar */}
      <Box args={[0.95, 0.15, 0.1]} position={[0, -0.15, 1.05]} castShadow>
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Entradas de ar no para-choque dianteiro */}
      <Box args={[0.3, 0.08, 0.05]} position={[-0.25, -0.15, 1.11]} castShadow>
        <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.8} />
      </Box>
      <Box args={[0.3, 0.08, 0.05]} position={[0.25, -0.15, 1.11]} castShadow>
        <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.8} />
      </Box>
      
      {/* Grade central */}
      <Box args={[0.3, 0.08, 0.02]} position={[0, -0.05, 1.12]} castShadow>
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
      </Box>
      
      {/* Detalhe cromado na frente */}
      <Box args={[0.6, 0.02, 0.02]} position={[0, 0, 1.12]} castShadow>
        <primitive object={chromeMaterial} />
      </Box>
      
      {/* Para-choque traseiro */}
      <Box args={[0.95, 0.15, 0.1]} position={[0, -0.15, -1.05]} castShadow>
        <meshStandardMaterial color={darkerColor} metalness={0.6} roughness={0.4} />
      </Box>
      
      {/* Escapamentos */}
      <Cylinder 
        args={[0.05, 0.05, 0.1, 16]} 
        position={[-0.25, -0.15, -1.11]} 
        rotation={[Math.PI/2, 0, 0]} 
        castShadow
      >
        <meshStandardMaterial color="#777777" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder 
        args={[0.05, 0.05, 0.1, 16]} 
        position={[0.25, -0.15, -1.11]} 
        rotation={[Math.PI/2, 0, 0]} 
        castShadow
      >
        <meshStandardMaterial color="#777777" metalness={0.9} roughness={0.1} />
      </Cylinder>
      
      {/* Aerofólio traseiro */}
      <Box args={[0.7, 0.05, 0.15]} position={[0, 0.3, -1.05]} castShadow>
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Suportes do aerofólio */}
      <Box args={[0.05, 0.15, 0.05]} position={[-0.25, 0.2, -1.05]} castShadow>
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </Box>
      <Box args={[0.05, 0.15, 0.05]} position={[0.25, 0.2, -1.05]} castShadow>
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Detalhes laterais - vincos aerodinâmicos */}
      <Box 
        args={[0.02, 0.1, 1.8]} 
        position={[-0.5, 0, 0]} 
        rotation={[0, 0, Math.PI/12]} 
        castShadow
      >
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </Box>
      <Box 
        args={[0.02, 0.1, 1.8]} 
        position={[0.5, 0, 0]} 
        rotation={[0, 0, -Math.PI/12]} 
        castShadow
      >
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </Box>
    </group>
  );
};

export default FallbackCar;