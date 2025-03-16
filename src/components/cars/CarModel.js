import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Componente que renderiza um modelo de carro esportivo detalhado
 * @param {Object} props - Propriedades do componente
 * @param {string} props.color - Cor principal do carro
 * @param {string} props.id - ID do carro
 * @returns {JSX.Element} Modelo 3D do carro esportivo
 */
const CarModel = ({ color = "#FF69B4", id = "default-car" }) => {
  const { scene } = useThree();
  
  // Cores para as lanternas com maior intensidade
  const headlightColor = "#FFFFFF"; // Branco brilhante para faróis dianteiros
  const tailLightColor = "#FF0000"; // Vermelho vivo para lanternas traseiras
  
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
  
  // Material para vidros - azul escuro e refletivo
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#0a1a3f', // Azul escuro
      metalness: 0.5,
      roughness: 0.05,
      transmission: 0.6, // Transparência ajustada para o azul
      reflectivity: 0.9,  // Alta reflexão
      clearcoat: 0.9,     // Brilho intenso
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
      ior: 1.5 // Índice de refração similar ao vidro real
    });
  }, []);
  
  // Material para rodas - preto com brilho
  const wheelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#000000',
      metalness: 0.2,
      roughness: 0.7
    });
  }, []);
  
  // Material para aros das rodas - preto metálico
  const wheelRimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#000000',
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
  
  return (
    <group>
      {/* Corpo principal do carro - mais aerodinâmico e esportivo */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.35, 2.2]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.7} 
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Parte superior do carro - teto com inclinação esportiva */}
      <mesh position={[0, 0.15, -0.1]} castShadow>
        <boxGeometry args={[0.9, 0.15, 1.4]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.7} 
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Capô dianteiro - mais baixo e aerodinâmico */}
      <mesh position={[0, 0.02, 0.7]} castShadow>
        <boxGeometry args={[0.95, 0.2, 0.9]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.8} 
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Frente inclinada - para dar aspecto aerodinâmico */}
      <mesh position={[0, 0.05, 1.15]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.15, 0.2]} />
        <meshPhysicalMaterial 
          color={lighterColor} 
          metalness={0.8} 
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>
      
      {/* Traseira do carro - mais elevada e esportiva */}
      <mesh position={[0, 0.1, -0.9]} castShadow>
        <boxGeometry args={[0.95, 0.3, 0.4]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.5} 
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Aerofólio traseiro */}
      <mesh position={[0, 0.3, -1.05]} castShadow>
        <boxGeometry args={[0.7, 0.05, 0.15]} />
        <meshStandardMaterial 
          color={darkerColor} 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Suportes do aerofólio */}
      <mesh position={[-0.25, 0.2, -1.05]} castShadow>
        <boxGeometry args={[0.05, 0.15, 0.05]} />
        <meshStandardMaterial 
          color={darkerColor} 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.25, 0.2, -1.05]} castShadow>
        <boxGeometry args={[0.05, 0.15, 0.05]} />
        <meshStandardMaterial 
          color={darkerColor} 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Rodas - corrigidas para orientação correta */}
      {/* Roda dianteira esquerda */}
      <group position={[-0.52, -0.22, 0.7]} name="frontLeftWheel" userData={{ wheelType: 'frontLeft' }}>
        <mesh castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 24]} />
          <primitive object={wheelMaterial} />
        </mesh>
        <mesh castShadow rotation={[0, Math.PI/2, 0]}>
          <torusGeometry args={[0.22, 0.04, 16, 24]} />
          <primitive object={wheelRimMaterial} />
        </mesh>
        {/* Centro da roda */}
        <mesh castShadow position={[0.09, 0, 0]}>
          <boxGeometry args={[0.01, 0.1, 0.1]} />
          <primitive object={chromeMaterial} />
        </mesh>
        {/* Raios da roda */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={i} 
            castShadow 
            position={[0.09, 0, 0]} 
            rotation={[0, (i * Math.PI/2.5), Math.PI/2]}
          >
            <boxGeometry args={[0.01, 0.04, 0.2]} />
            <primitive object={wheelRimMaterial} />
          </mesh>
        ))}
      </group>
      
      {/* Roda dianteira direita */}
      <group position={[0.52, -0.22, 0.7]} name="frontRightWheel" userData={{ wheelType: 'frontRight' }}>
        <mesh castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 24]} />
          <primitive object={wheelMaterial} />
        </mesh>
        <mesh castShadow rotation={[0, Math.PI/2, 0]}>
          <torusGeometry args={[0.22, 0.04, 16, 24]} />
          <primitive object={wheelRimMaterial} />
        </mesh>
        {/* Centro da roda */}
        <mesh castShadow position={[-0.09, 0, 0]}>
          <boxGeometry args={[0.01, 0.1, 0.1]} />
          <primitive object={chromeMaterial} />
        </mesh>
        {/* Raios da roda */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={i} 
            castShadow 
            position={[-0.09, 0, 0]} 
            rotation={[0, (i * Math.PI/2.5), Math.PI/2]}
          >
            <boxGeometry args={[0.01, 0.04, 0.2]} />
            <primitive object={wheelRimMaterial} />
          </mesh>
        ))}
      </group>
      
      {/* Roda traseira esquerda */}
      <group position={[-0.52, -0.22, -0.7]} name="rearLeftWheel" userData={{ wheelType: 'rearLeft' }}>
        <mesh castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 24]} />
          <primitive object={wheelMaterial} />
        </mesh>
        <mesh castShadow rotation={[0, Math.PI/2, 0]}>
          <torusGeometry args={[0.22, 0.04, 16, 24]} />
          <primitive object={wheelRimMaterial} />
        </mesh>
        {/* Centro da roda */}
        <mesh castShadow position={[0.09, 0, 0]}>
          <boxGeometry args={[0.01, 0.1, 0.1]} />
          <primitive object={chromeMaterial} />
        </mesh>
        {/* Raios da roda */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={i} 
            castShadow 
            position={[0.09, 0, 0]} 
            rotation={[0, (i * Math.PI/2.5), Math.PI/2]}
          >
            <boxGeometry args={[0.01, 0.04, 0.2]} />
            <primitive object={wheelRimMaterial} />
          </mesh>
        ))}
      </group>
      
      {/* Roda traseira direita */}
      <group position={[0.52, -0.22, -0.7]} name="rearRightWheel" userData={{ wheelType: 'rearRight' }}>
        <mesh castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 24]} />
          <primitive object={wheelMaterial} />
        </mesh>
        <mesh castShadow rotation={[0, Math.PI/2, 0]}>
          <torusGeometry args={[0.22, 0.04, 16, 24]} />
          <primitive object={wheelRimMaterial} />
        </mesh>
        {/* Centro da roda */}
        <mesh castShadow position={[-0.09, 0, 0]}>
          <boxGeometry args={[0.01, 0.1, 0.1]} />
          <primitive object={chromeMaterial} />
        </mesh>
        {/* Raios da roda */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={i} 
            castShadow 
            position={[-0.09, 0, 0]} 
            rotation={[0, (i * Math.PI/2.5), Math.PI/2]}
          >
            <boxGeometry args={[0.01, 0.04, 0.2]} />
            <primitive object={wheelRimMaterial} />
          </mesh>
        ))}
      </group>
      
      {/* Cabine/Janelas - vidro translúcido e refletivo */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.85, 0.2, 1.2]} />
        <primitive object={glassMaterial} />
      </mesh>
      
      {/* Para-brisa dianteiro inclinado */}
      <mesh position={[0, 0.25, 0.6]} rotation={[Math.PI/6, 0, 0]} castShadow>
        <boxGeometry args={[0.85, 0.01, 0.5]} />
        <primitive object={glassMaterial} />
      </mesh>
      
      {/* Para-brisa traseiro inclinado */}
      <mesh position={[0, 0.25, -0.6]} rotation={[-Math.PI/6, 0, 0]} castShadow>
        <boxGeometry args={[0.85, 0.01, 0.5]} />
        <primitive object={glassMaterial} />
      </mesh>
      
      {/* Lanternas dianteiras (brancas) com formato moderno */}
      <mesh position={[-0.35, 0.08, 1.12]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.08, 0.05]} />
        <meshStandardMaterial 
          color={headlightColor} 
          emissive={headlightColor} 
          emissiveIntensity={1.2} 
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.35, 0.08, 1.12]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.08, 0.05]} />
        <meshStandardMaterial 
          color={headlightColor} 
          emissive={headlightColor} 
          emissiveIntensity={1.2} 
          toneMapped={false}
        />
      </mesh>
      
      {/* Lanternas traseiras (vermelhas) com formato moderno */}
      <mesh position={[-0.35, 0.15, -1.1]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial 
          color={tailLightColor} 
          emissive={tailLightColor} 
          emissiveIntensity={1.0} 
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.35, 0.15, -1.1]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial 
          color={tailLightColor} 
          emissive={tailLightColor} 
          emissiveIntensity={1.0} 
          toneMapped={false}
        />
      </mesh>
      
      {/* Para-choque dianteiro - mais baixo e esportivo */}
      <mesh position={[0, -0.15, 1.05]} castShadow>
        <boxGeometry args={[0.95, 0.15, 0.1]} />
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Entradas de ar no para-choque dianteiro */}
      <mesh position={[-0.25, -0.15, 1.11]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.05]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0.25, -0.15, 1.11]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.05]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* Grade central */}
      <mesh position={[0, -0.05, 1.12]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Detalhe cromado na frente */}
      <mesh position={[0, 0, 1.12]} castShadow>
        <boxGeometry args={[0.6, 0.02, 0.02]} />
        <primitive object={chromeMaterial} />
      </mesh>
      
      {/* Para-choque traseiro */}
      <mesh position={[0, -0.15, -1.05]} castShadow>
        <boxGeometry args={[0.95, 0.15, 0.1]} />
        <meshStandardMaterial color={darkerColor} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Escapamentos */}
      <mesh position={[-0.25, -0.15, -1.11]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        <meshStandardMaterial color="#777777" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.25, -0.15, -1.11]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        <meshStandardMaterial color="#777777" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Detalhes laterais - vincos aerodinâmicos */}
      <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI/12]} castShadow>
        <boxGeometry args={[0.02, 0.1, 1.8]} />
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI/12]} castShadow>
        <boxGeometry args={[0.02, 0.1, 1.8]} />
        <meshStandardMaterial color={darkerColor} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

export default CarModel;