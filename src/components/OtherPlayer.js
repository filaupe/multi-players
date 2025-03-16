import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { getCarById } from '../assets/models/cars';

// Modelo de fallback para quando o modelo 3D não puder ser carregado
const FallbackCarModel = ({ color }) => {
  return (
    <group rotation={[0, Math.PI, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color={color || "#FF0000"} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Rodas */}
      <mesh position={[-0.5, -0.3, 0.7]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.5, -0.3, 0.7]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.5, -0.3, -0.7]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.5, -0.3, -0.7]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Janelas */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.9, 0.3, 0.8]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Componente para carregar o modelo do carro
const CarModel = ({ carId, color }) => {
  const car = getCarById(carId || 'red-car');
  const carColor = color || (car ? car.color : "#FF0000");
  
  // Sempre usamos o modelo de fallback
  return <FallbackCarModel color={carColor} />;
};

function OtherPlayer({ data }) {
  const groupRef = useRef();
  const [showDefaultMesh, setShowDefaultMesh] = useState(true);
  const targetPosition = useRef(new THREE.Vector3(...data.position));
  const targetRotation = useRef(0);
  const prevPosition = useRef(new THREE.Vector3(...data.position));
  
  // Atualiza a posição de forma suave
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Atualiza a posição alvo
      targetPosition.current.set(...data.position);
      
      // Calcula a direção do movimento
      const direction = new THREE.Vector3().subVectors(
        targetPosition.current, 
        prevPosition.current
      );
      
      // Se houver movimento significativo, atualiza a rotação
      if (direction.length() > 0.01) {
        targetRotation.current = Math.atan2(direction.x, direction.z);
      }
      
      // Interpola a posição atual para a posição alvo
      groupRef.current.position.lerp(targetPosition.current, 0.2);
      
      // Interpola a rotação atual para a rotação alvo
      const currentRotation = groupRef.current.rotation.y;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation.current,
        0.1
      );
      
      // Armazena a posição atual para o próximo frame
      prevPosition.current.copy(groupRef.current.position);
    }
  });
  
  // Tenta carregar o modelo do carro - executado apenas uma vez na montagem
  useEffect(() => {
    // Se o modelo for carregado com sucesso, esconde o mesh padrão
    if (data.car) {
      setShowDefaultMesh(false);
    }
  }, []); // Dependência vazia para executar apenas uma vez

  return (
    <group 
      ref={groupRef} 
      position={data.position}
    >
      {/* Mesh padrão (mostrado apenas se o modelo não for carregado) */}
      {showDefaultMesh && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={data.color || "blue"} />
        </mesh>
      )}
      
      {/* Modelo do carro */}
      {!showDefaultMesh && (
        <Suspense fallback={null}>
          <CarModel carId={data.car} color={data.color} />
        </Suspense>
      )}
      
      {/* Nome do jogador */}
      <Billboard position={[0, 1.5, 0]}>
        <Text 
          fontSize={0.5} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
        >
          {data.name}
        </Text>
      </Billboard>
    </group>
  );
}

export default OtherPlayer;