// src/components/Player.js
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  Suspense
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Billboard, Text, ContactShadows } from '@react-three/drei';
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
  const car = getCarById(carId || 'carro-vermelho');
  const carColor = color || (car ? car.color : "#FF0000");
  
  // Sempre use o fallback model
  return <FallbackCarModel color={carColor} />;
};

const Player = forwardRef(({ playerName, playerColor, playerCar, multiplayer, onGameOver }, ref) => {
  const rigidBodyRef = useRef(null);
  const meshRef = useRef(null);
  const keysRef = useRef({});
  const canJumpRef = useRef(false);
  const { camera } = useThree();
  
  // Sempre usar o modelo 3D, não o mesh padrão
  const [showDefaultMesh, setShowDefaultMesh] = useState(false);

  // Cria um objeto dummy para rastrear a posição do player
  const dummyRef = useRef(new THREE.Object3D());

  // Expor o dummy através de getMesh para que a câmera possa usar sua posição
  useImperativeHandle(ref, () => ({
    getMesh: () => dummyRef.current,
  }));

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
      
      // Rotaciona o modelo na direção do movimento
      if (meshRef.current) {
        const targetRotation = Math.atan2(movement.x, movement.z);
        meshRef.current.rotation.y = targetRotation;
      }
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
      <group ref={meshRef}>
        {/* Mesh padrão (mostrado apenas se o modelo não for carregado) */}
        {showDefaultMesh && (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={playerColor || "orange"} />
          </mesh>
        )}
        
        {/* Modelo do carro */}
        {!showDefaultMesh && (
          <Suspense fallback={null}>
            <CarModel carId={playerCar} color={playerColor} />
          </Suspense>
        )}
      </group>
      
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
          {playerName}
        </Text>
      </Billboard>
    </RigidBody>
  );
});

export default Player;