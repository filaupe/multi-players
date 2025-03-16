import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function PlayerCamera({ playerRef }) {
  const { camera } = useThree();
  const [isReverseCam, setIsReverseCam] = useState(false);
  const lastPlayerPosition = useRef(new THREE.Vector3());
  const playerDirection = useRef(new THREE.Vector3());
  const keysRef = useRef({});
  const targetPosition = useRef(new THREE.Vector3());
  const currentCameraPosition = useRef(new THREE.Vector3());
  const smoothFactor = 0.03; // Fator de suavização ainda mais reduzido
  const cameraHeight = useRef(5); // Altura fixa da câmera

  // Adiciona event listeners para as teclas
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
      
      // Ativa o modo de câmera reversa com Shift
      if (e.key === 'Shift') {
        setIsReverseCam(true);
      }
    };
    
    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
      
      // Desativa o modo de câmera reversa quando soltar Shift
      if (e.key === 'Shift') {
        setIsReverseCam(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!playerRef.current) return;
    const mesh = playerRef.current.getMesh();
    if (!mesh) return;

    // Inicializa a posição atual da câmera se ainda não estiver definida
    if (!currentCameraPosition.current.x && !currentCameraPosition.current.y && !currentCameraPosition.current.z) {
      currentCameraPosition.current.copy(camera.position);
    }

    // Calcula a direção do movimento do jogador com um limiar maior para evitar micro-movimentos
    if (lastPlayerPosition.current.distanceTo(mesh.position) > 0.05) {
      playerDirection.current.subVectors(mesh.position, lastPlayerPosition.current).normalize();
      lastPlayerPosition.current.copy(mesh.position);
    }

    // Obtém a direção do carro a partir da rotação do mesh
    // Agora a direção é positiva no eixo Z (para frente)
    const carDirection = new THREE.Vector3(0, 0, 1).applyEuler(mesh.rotation);
    carDirection.y = 0;
    carDirection.normalize();
    
    // Modo de câmera reversa (quando Shift está pressionado)
    if (isReverseCam) {
      // Posiciona a câmera na frente do jogador na direção do carro
      const offset = carDirection.clone().multiplyScalar(10);
      
      // Define a posição alvo da câmera com altura fixa
      targetPosition.current.copy(mesh.position).add(offset);
      targetPosition.current.y = mesh.position.y + cameraHeight.current; // Altura fixa relativa ao carro
    } 
    // Modo de câmera normal (fixa atrás do carro)
    else {
      // Posiciona a câmera atrás do jogador na direção do carro
      const offset = carDirection.clone().multiplyScalar(-10);
      
      // Define a posição alvo da câmera com altura fixa
      targetPosition.current.copy(mesh.position).add(offset);
      targetPosition.current.y = mesh.position.y + cameraHeight.current; // Altura fixa relativa ao carro
    }
    
    // Aplica suavização dupla para reduzir tremores
    // Primeiro, suaviza a posição atual da câmera em direção à posição alvo
    // Suaviza separadamente os componentes horizontal e vertical
    currentCameraPosition.current.x = THREE.MathUtils.lerp(currentCameraPosition.current.x, targetPosition.current.x, smoothFactor);
    currentCameraPosition.current.z = THREE.MathUtils.lerp(currentCameraPosition.current.z, targetPosition.current.z, smoothFactor);
    
    // Suaviza a altura com um fator ainda menor para evitar tremores verticais
    currentCameraPosition.current.y = THREE.MathUtils.lerp(currentCameraPosition.current.y, targetPosition.current.y, smoothFactor * 0.5);
    
    // Depois, suaviza a posição da câmera em direção à posição atual calculada
    camera.position.copy(currentCameraPosition.current);
    
    // Suaviza o olhar da câmera para o carro
    // Cria um ponto de mira ligeiramente acima do carro para melhor visualização
    const lookAtPosition = new THREE.Vector3().copy(mesh.position);
    lookAtPosition.y += 0.5; // Olha um pouco acima do centro do carro
    camera.lookAt(lookAtPosition);
  });

  return null;
}

export default PlayerCamera;