// src/components/game/Ramp.js
import React from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

/**
 * Componente que representa uma rampa no jogo
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.position - Posição da rampa [x, y, z]
 * @param {Array} props.rotation - Rotação da rampa [x, y, z] em radianos
 * @param {Array} props.size - Tamanho da rampa [largura, altura, comprimento]
 * @param {String} props.color - Cor da rampa
 * @returns {JSX.Element} Componente da rampa
 */
const Ramp = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  size = [5, 1, 3], 
  color = "#FF5500" 
}) => {
  // Cria a geometria da rampa usando uma forma mais simples e eficiente
  const createRampShape = () => {
    const [width, height, depth] = size;
    
    // Cria uma forma extrudida para a rampa
    const shape = new THREE.Shape();
    shape.moveTo(-width/2, -depth/2);
    shape.lineTo(width/2, -depth/2);
    shape.lineTo(width/2, depth/2);
    shape.lineTo(-width/2, depth/2);
    shape.lineTo(-width/2, -depth/2);
    
    const extrudeSettings = {
      steps: 1,
      depth: 0.1,
      bevelEnabled: false
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  return (
    <RigidBody 
      type="fixed" 
      position={position}
      rotation={rotation}
      name="ramp"
      friction={0.3}  // Adiciona um pouco de fricção para melhor controle
    >
      {/* Base da rampa */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[size[0], 0.2, size[2]]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Superfície inclinada */}
      <mesh castShadow receiveShadow position={[0, size[1]/2, size[2]/4]} rotation={[-Math.PI/8, 0, 0]}>
        <boxGeometry args={[size[0], 0.2, size[2] * 1.2]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* Suportes laterais */}
      <mesh castShadow receiveShadow position={[size[0]/2 - 0.2, size[1]/3, 0]}>
        <boxGeometry args={[0.4, size[1] * 0.6, size[2]]} />
        <meshStandardMaterial color="#333333" roughness={0.7} metalness={0.1} />
      </mesh>
      
      <mesh castShadow receiveShadow position={[-size[0]/2 + 0.2, size[1]/3, 0]}>
        <boxGeometry args={[0.4, size[1] * 0.6, size[2]]} />
        <meshStandardMaterial color="#333333" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Marcações visuais na rampa */}
      {[...Array(3)].map((_, i) => (
        <mesh 
          key={`mark-${i}`} 
          castShadow 
          receiveShadow 
          position={[0, 0.15, size[2]/4 - size[2]/3 + i * size[2]/3]} 
          rotation={[-Math.PI/8, 0, 0]}
        >
          <boxGeometry args={[size[0] - 0.5, 0.05, 0.3]} />
          <meshStandardMaterial color="#FFFF00" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </RigidBody>
  );
};

export default Ramp;