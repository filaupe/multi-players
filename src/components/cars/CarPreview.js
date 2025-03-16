import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { getCarById } from '../../assets/models/cars';
import FallbackCar from './FallbackCar';
import ModelErrorBoundary from './ModelErrorBoundary';
import LoadingModel from './LoadingModel';
import { defaultCanvasConfig, defaultLightingConfig, orbitControlsConfig, environmentConfig } from '../../config/three';

// Modelo de fallback para quando o modelo 3D não puder ser carregado
const FallbackModel = ({ color }) => {
  return <FallbackCar color={color} />;
};

// Componente para renderizar o modelo 3D do carro com rotação automática
const CarModel = ({ carId, autoRotate = true, interactive = false }) => {
  const car = getCarById(carId);
  const [hovered, setHovered] = useState(false);
  const modelRef = useRef();
  
  // Rotação automática do modelo
  useFrame((state) => {
    if (modelRef.current) {
      // Rotação mais lenta e suave (apenas se autoRotate for true)
      if (autoRotate) {
        modelRef.current.rotation.y += 0.005;
      }
      
      // Efeito de flutuação suave
      const time = state.clock.getElapsedTime();
      modelRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    }
  });
  
  // Usamos sempre o modelo de fallback
  return (
    <group
      ref={modelRef}
      onPointerOver={() => interactive && setHovered(true)}
      onPointerOut={() => interactive && setHovered(false)}
      scale={hovered ? [1.3, 1.3, 1.3] : [1.2, 1.2, 1.2]} // Aumentado o tamanho base e o tamanho ao passar o mouse
      position={[0, -0.3, 0]}
      rotation={[0, Math.PI, 0]}
    >
      <FallbackModel color={car ? car.color : "#FF0000"} />
    </group>
  );
};

// Componente de visualização do carro
const CarPreview = ({ carId }) => {
  const car = getCarById(carId);
  
  return (
    <div style={{ 
      width: '100%', 
      height: '280px', // Aumentado de 180px para 280px
      borderRadius: '10px',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7)'
    }}>
      <Canvas
        dpr={defaultCanvasConfig.dpr}
        shadows={defaultCanvasConfig.shadows}
        gl={defaultCanvasConfig.gl}
      >
        <PerspectiveCamera makeDefault position={[2.5, 1.8, 4.5]} fov={30} /> {/* Ajustada a posição e o FOV */}
        
        <color attach="background" args={['#1a1a1a']} />
        
        {/* Iluminação melhorada */}
        <ambientLight intensity={defaultLightingConfig.ambientLight.intensity} color={defaultLightingConfig.ambientLight.color} />
        <spotLight 
          position={defaultLightingConfig.mainLight.position} 
          angle={0.3} 
          penumbra={1} 
          intensity={defaultLightingConfig.mainLight.intensity} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight 
          position={defaultLightingConfig.fillLight.position} 
          angle={0.3} 
          penumbra={1} 
          intensity={defaultLightingConfig.fillLight.intensity} 
          color={defaultLightingConfig.fillLight.color}
        />
        
        <Suspense fallback={<LoadingModel color={car ? car.color : "#FFFFFF"} />}>
          <ModelErrorBoundary fallbackColor={car ? car.color : "#FF0000"}>
            <CarModel carId={carId} autoRotate={true} interactive={true} />
          </ModelErrorBoundary>
          
          {/* Sombra de contato para efeito realista */}
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.6}
            scale={10}
            blur={2}
            far={1}
            resolution={256}
          />
          
          {/* Ambiente para reflexões realistas */}
          <Environment preset={environmentConfig.preset} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={orbitControlsConfig.enableZoom}
          enablePan={orbitControlsConfig.enablePan}
          autoRotate={orbitControlsConfig.autoRotate}
          minPolarAngle={orbitControlsConfig.minPolarAngle}
          maxPolarAngle={orbitControlsConfig.maxPolarAngle}
          enableRotate={orbitControlsConfig.enableRotate}
        />
      </Canvas>
    </div>
  );
};

export default CarPreview;