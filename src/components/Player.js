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
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { getCarById } from '../assets/models/cars';
import { useCarPhysics } from '../hooks/useCarPhysics';
import { PLAYER_CONFIG } from '../config/constants';
import CarModel from './cars/CarModel';

// Modelo de fallback para quando o modelo 3D não puder ser carregado
const FallbackCarModel = ({ color }) => {
  return (
    <group>
      {/* Corpo principal do carro */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color={color || "#FF0000"} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Rodas */}
      <group position={[-0.5, -0.3, 0.7]}>
        <mesh castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      
      <group position={[0.5, -0.3, 0.7]}>
        <mesh castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      
      <group position={[-0.5, -0.3, -0.7]}>
        <mesh castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      
      <group position={[0.5, -0.3, -0.7]}>
        <mesh castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      
      {/* Janelas */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.9, 0.3, 0.8]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Lanternas dianteiras (amarelas) - na frente do carro (Z positivo) */}
      <mesh position={[-0.35, 0, 0.95]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#FFCC00" emissive="#FFCC00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.35, 0, 0.95]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#FFCC00" emissive="#FFCC00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Lanternas traseiras (vermelhas) - na traseira do carro (Z negativo) */}
      <mesh position={[-0.35, 0, -0.95]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.35, 0, -0.95]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Para-choque dianteiro - na frente do carro (Z positivo) */}
      <mesh position={[0, -0.1, 0.9]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.2]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
};

// Componente para carregar o modelo do carro
const CarModelLoader = ({ carId, color }) => {
  const car = getCarById(carId || 'red-car');
  const carColor = color || (car ? car.color : "#FF0000");
  
  return <CarModel color={carColor} id={carId} />;
};

// Componente de UI para mostrar informações do carro
const CarUI = ({ isDrifting, isFlying, speed }) => {
  return (
    <Billboard position={[0, 2.2, 0]}>
      <group>
        {/* Velocidade */}
        <Text 
          fontSize={0.3} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
          position={[0, 0, 0]}
        >
          {`${speed} km/h`}
        </Text>
        
        {/* Indicador de Drift */}
        {isDrifting && (
          <Text 
            fontSize={0.25} 
            color="#FF5500" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="black"
            position={[0, -0.3, 0]}
          >
            DRIFT!
          </Text>
        )}
        
        {/* Indicador de Voo */}
        {isFlying && (
          <Text 
            fontSize={0.25} 
            color="#00AAFF" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="black"
            position={[0, -0.3, 0]}
          >
            AIR!
          </Text>
        )}
      </group>
    </Billboard>
  );
};

const Player = forwardRef(({ playerName, playerColor, playerCar, multiplayer, onGameOver, onHUDUpdate }, ref) => {
  const rigidBodyRef = useRef(null);
  const meshRef = useRef(null);
  const keysRef = useRef({});
  const canJumpRef = useRef(false);
  const { camera } = useThree();
  
  // Sempre usar o modelo 3D, não o mesh padrão
  const [showDefaultMesh, setShowDefaultMesh] = useState(false);

  // Cria um objeto dummy para rastrear a posição do player
  const dummyRef = useRef(new THREE.Object3D());

  // Usa o hook de física do carro
  const { 
    updateCarPhysics, 
    handleRampCollision, 
    updateGroundedState,
    isDrifting,
    isFlying,
    currentSpeed
  } = useCarPhysics();

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
    
    // Também atualiza a rotação do dummy para corresponder à rotação do mesh
    if (meshRef.current) {
      dummyRef.current.rotation.copy(meshRef.current.rotation);
    }

    // Se o player cair abaixo de um limiar, aciona o Game Over
    if (pos.y < -10) {
      onGameOver?.();
      return;
    }

    // Atualiza a física do carro com base nos controles
    const { movement, isUpsideDown } = updateCarPhysics(
      keysRef.current, 
      rigidBodyRef.current, 
      meshRef.current, 
      camera, 
      delta
    );

    // Se o carro estiver de cabeça para baixo, aciona o Game Over
    if (isUpsideDown) {
      console.log('Car flipped! Game over.');
      onGameOver?.();
      return;
    }

    // Atualiza o HUD
    if (onHUDUpdate) {
      onHUDUpdate({
        speed: currentSpeed,
        isDrifting,
        isFlying,
        isUpsideDown,
        position: { x: pos.x, z: pos.z },
        rotation: meshRef.current ? meshRef.current.rotation.y : 0
      });
    }

    // Aplica o movimento calculado, preservando a componente vertical da velocidade
    const currentVel = rigidBodyRef.current.linvel();
    rigidBodyRef.current.setLinvel(
      { x: movement.x, y: currentVel.y, z: movement.z },
      true
    );

    // Pulo: se espaço estiver pressionado e o player puder pular, aplica impulso vertical
    if (keysRef.current[' ']) {
      if (canJumpRef.current) {
        rigidBodyRef.current.applyImpulse({ x: 0, y: PLAYER_CONFIG.JUMP_FORCE, z: 0 }, true);
        canJumpRef.current = false;
      }
    }

    // Envia a posição para o servidor multiplayer
    if (multiplayer && typeof multiplayer.sendMovement === 'function') {
      multiplayer.sendMovement([pos.x, pos.y, pos.z]);
    }
  });

  // Funções de colisão para detectar contato com o chão e permitir pulo
  const handleCollisionEnter = (event) => {
    canJumpRef.current = true;
    updateGroundedState(true);
    
    // Verifica se a colisão é com uma rampa
    handleRampCollision(event, rigidBodyRef.current);
  };

  const handleCollisionExit = () => {
    canJumpRef.current = false;
    updateGroundedState(false);
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders="cuboid"
      friction={0.3}      // Aumentada para melhor aderência
      restitution={0.05}  // Reduzida para menos quicar
      canSleep={false}    // Mantém o corpo ativo
      lockRotations={true} // Impede rotações indesejadas
      linearDamping={0.7} // Aumentado para movimento mais suave
      angularDamping={0.9} // Aumentado para reduzir oscilações
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
            <CarModelLoader carId={playerCar} color={playerColor} />
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
      
      {/* UI do carro */}
      <CarUI 
        isDrifting={isDrifting} 
        isFlying={isFlying} 
        speed={currentSpeed} 
      />
    </RigidBody>
  );
});

export default Player;