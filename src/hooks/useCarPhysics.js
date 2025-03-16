// src/hooks/useCarPhysics.js
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { PLAYER_CONFIG } from '../config/constants';

/**
 * Hook para gerenciar a física do carro
 * @returns {Object} Objeto contendo funções e estados para a física do carro
 */
export function useCarPhysics() {
  // Referências para os estados físicos do carro
  const currentSpeedRef = useRef(0);
  const isGroundedRef = useRef(false);
  const isDriftingRef = useRef(false);
  const isInAirRef = useRef(false);
  const lastGroundedTimeRef = useRef(0);
  const carRotationRef = useRef(new THREE.Euler());
  
  // Estados para UI e feedback
  const [isDrifting, setIsDrifting] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  /**
   * Atualiza a física do carro com base nos controles
   * @param {Object} keys - Objeto contendo o estado das teclas
   * @param {Object} rigidBody - Referência ao corpo rígido do carro
   * @param {Object} mesh - Referência ao mesh do carro
   * @param {Object} camera - Referência à câmera
   * @param {Number} delta - Tempo desde o último frame
   * @returns {Object} Vetor de movimento calculado
   */
  const updateCarPhysics = (keys, rigidBody, mesh, camera, delta) => {
    if (!rigidBody) return { movement: new THREE.Vector3(), isUpsideDown: false };

    // Obtém a velocidade atual
    const currentVel = rigidBody.linvel();
    
    // Calcula a velocidade atual (magnitude no plano XZ)
    const horizontalVelocity = new THREE.Vector2(currentVel.x, currentVel.z);
    currentSpeedRef.current = horizontalVelocity.length();
    
    // Atualiza o estado da UI
    setCurrentSpeed(Math.round(currentSpeedRef.current * 10) / 10);

    // Vetores de direção baseados na orientação da câmera
    const forwardVector = new THREE.Vector3();
    camera.getWorldDirection(forwardVector);
    forwardVector.y = 0;
    forwardVector.normalize();

    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(forwardVector, new THREE.Vector3(0, 1, 0)).normalize();

    // Vetor de movimento final
    const movement = new THREE.Vector3();

    // Direção (teclas A/D)
    let turnFactor = 0;
    
    if (keys['a']) turnFactor = -1;
    if (keys['d']) turnFactor = 1;

    // Calcula o vetor de direção do carro baseado na rotação do mesh
    const carDirection = new THREE.Vector3(0, 0, 1).applyEuler(mesh.rotation);
    carDirection.y = 0;
    carDirection.normalize();

    // Aceleração (tecla W) - permite acelerar para frente
    if (keys['w']) {
      // Aceleração mais suave e controlada
      // Reduz menos a aceleração durante curvas
      const turnPenalty = Math.abs(turnFactor) * 0.3; // Reduzido de 0.5 para 0.3
      const accelerationMultiplier = 1 - turnPenalty;
      
      currentSpeedRef.current = Math.min(
        currentSpeedRef.current + (PLAYER_CONFIG.ACCELERATION * accelerationMultiplier), 
        PLAYER_CONFIG.MAX_SPEED
      );
      
      // Aplica a aceleração na direção do carro
      movement.add(carDirection.clone().multiplyScalar(currentSpeedRef.current));
      
      // Adiciona um componente vertical para ajudar a subir rampas
      // Isso ajuda o carro a "escalar" pequenos obstáculos
      if (isGroundedRef.current) {
        const climbAssist = new THREE.Vector3(0, 0.15, 0);
        movement.add(climbAssist);
      }
    } 
    // Ré (tecla S) - permite andar para trás
    else if (keys['s']) {
      // Se estiver indo para frente, freia
      if (currentSpeedRef.current > 0) {
        currentSpeedRef.current = Math.max(
          currentSpeedRef.current - PLAYER_CONFIG.BRAKE_FORCE,
          0
        );
        
        // Se ainda estiver em movimento para frente, aplica a direção atual do carro
        if (currentSpeedRef.current > 0) {
          movement.add(carDirection.clone().multiplyScalar(currentSpeedRef.current));
        }
      } 
      // Se já estiver parado ou indo para trás, acelera para trás
      else {
        currentSpeedRef.current = Math.max(
          currentSpeedRef.current - PLAYER_CONFIG.ACCELERATION,
          -PLAYER_CONFIG.MAX_SPEED * 0.5 // Velocidade máxima de ré é metade da velocidade para frente
        );
        
        // Aplica a aceleração na direção oposta do carro
        movement.add(carDirection.clone().multiplyScalar(currentSpeedRef.current));
        
        // Adiciona um componente vertical para ajudar a subir rampas em marcha ré
        if (isGroundedRef.current) {
          const climbAssist = new THREE.Vector3(0, 0.1, 0);
          movement.add(climbAssist);
        }
      }
    } 
    // Desaceleração natural (sem W ou S)
    else {
      // Desaceleração natural mais forte para melhor controle
      const decelRate = PLAYER_CONFIG.ACCELERATION * 0.7;
      
      // Se estiver indo para frente
      if (currentSpeedRef.current > 0) {
        currentSpeedRef.current = Math.max(
          currentSpeedRef.current - decelRate,
          0
        );
      } 
      // Se estiver indo para trás
      else if (currentSpeedRef.current < 0) {
        currentSpeedRef.current = Math.min(
          currentSpeedRef.current + decelRate,
          0
        );
      }
      
      // Se ainda estiver em movimento, aplica a direção atual do carro
      if (currentSpeedRef.current !== 0) {
        movement.add(carDirection.clone().multiplyScalar(currentSpeedRef.current));
      }
    }

    // Detecta se está fazendo drift (curva em alta velocidade)
    isDriftingRef.current = (Math.abs(turnFactor) > 0 && currentSpeedRef.current > PLAYER_CONFIG.MAX_SPEED * 0.5);
    setIsDrifting(isDriftingRef.current);

    // Aplica a rotação ao modelo do carro
    if (mesh && turnFactor !== 0) {
      // Rotação mais suave para reduzir movimentos bruscos
      const rotationSpeed = PLAYER_CONFIG.STEERING_SENSITIVITY;
      
      // Ajusta a sensibilidade da direção com base na velocidade
      const speedFactor = Math.min(Math.abs(currentSpeedRef.current) / PLAYER_CONFIG.MAX_SPEED, 1);
      const adjustedRotationSpeed = rotationSpeed * (0.7 + 0.3 * speedFactor);
      
      // Se estiver indo para frente, curva normal
      if (currentSpeedRef.current > 0) {
        mesh.rotation.y -= turnFactor * adjustedRotationSpeed;
      } 
      // Se estiver indo para trás, inverte a direção da curva
      else if (currentSpeedRef.current < 0) {
        mesh.rotation.y += turnFactor * adjustedRotationSpeed;
      }
      // Se estiver parado, permite girar no lugar, mas mais lentamente
      else {
        mesh.rotation.y -= turnFactor * adjustedRotationSpeed * 0.4;
      }
      
      // Aplica o efeito de drift com mais controle e suavidade
      if (isDriftingRef.current) {
        // Reduz a aderência durante o drift, mas com mais controle
        const driftDirection = new THREE.Vector3(rightVector.x, 0, rightVector.z)
          .multiplyScalar(turnFactor * Math.abs(currentSpeedRef.current) * 0.08 * PLAYER_CONFIG.DRIFT_FACTOR);
        
        // Aplica o drift com base no controle de tração, com transição mais suave
        // Reduzido o efeito de lerp para manter mais da velocidade original
        movement.lerp(driftDirection, (1 - PLAYER_CONFIG.TRACTION_CONTROL) * 0.5);
      }
      
      // Rotaciona as rodas dianteiras na direção da curva
      if (mesh.children && mesh.children.length > 0) {
        // Procura os grupos das rodas dianteiras usando nome
        let frontLeftWheelGroup = mesh.children.find(child => 
          child.name === "frontLeftWheel");
        
        let frontRightWheelGroup = mesh.children.find(child => 
          child.name === "frontRightWheel");
        
        // Fallback para busca por posição se nome não funcionar
        if (!frontLeftWheelGroup || !frontRightWheelGroup) {
          const frontLeftByPosition = mesh.children.find(child => 
            child.position && 
            child.position.x < -0.4 && 
            child.position.z > 0.4);
          
          const frontRightByPosition = mesh.children.find(child => 
            child.position && 
            child.position.x > 0.4 && 
            child.position.z > 0.4);
          
          // Use os resultados da busca por posição se necessário
          if (!frontLeftWheelGroup && frontLeftByPosition) {
            console.log("Usando roda esquerda encontrada por posição");
            frontLeftWheelGroup = frontLeftByPosition;
          }
          
          if (!frontRightWheelGroup && frontRightByPosition) {
            console.log("Usando roda direita encontrada por posição");
            frontRightWheelGroup = frontRightByPosition;
          }
        }
        
        // Log para debug - remover após confirmar que está funcionando
        console.log("Rodas encontradas:", 
          frontLeftWheelGroup ? "Esquerda OK" : "Esquerda não encontrada", 
          frontRightWheelGroup ? "Direita OK" : "Direita não encontrada",
          "Total de filhos:", mesh.children.length);
        
        if (frontLeftWheelGroup) {
          // Aplica rotação à roda dianteira esquerda (em torno do eixo Y)
          // Rotação mais direta para maior visibilidade
          frontLeftWheelGroup.rotation.y = turnFactor * Math.PI / 3; // 60 graus máximo
          
          // Log para debug - remover após confirmar que está funcionando
          console.log("Rotação roda esquerda:", frontLeftWheelGroup.rotation.y);
        }
        
        if (frontRightWheelGroup) {
          // Aplica rotação à roda dianteira direita (em torno do eixo Y)
          // Rotação mais direta para maior visibilidade
          frontRightWheelGroup.rotation.y = turnFactor * Math.PI / 3; // 60 graus máximo
          
          // Log para debug - remover após confirmar que está funcionando
          console.log("Rotação roda direita:", frontRightWheelGroup.rotation.y);
        }
      }
    } else if (mesh) {
      // Retorna as rodas à posição normal quando não estiver virando
      if (mesh.children && mesh.children.length > 0) {
        // Procura os grupos das rodas dianteiras usando userData
        let frontLeftWheelGroup = mesh.children.find(child => 
          child.userData && child.userData.wheelType === 'frontLeft');
        
        let frontRightWheelGroup = mesh.children.find(child => 
          child.userData && child.userData.wheelType === 'frontRight');
        
        // Fallback para busca por posição se userData não funcionar
        if (!frontLeftWheelGroup || !frontRightWheelGroup) {
          const frontLeftByPosition = mesh.children.find(child => 
            child.position && 
            child.position.x < -0.4 && 
            child.position.z > 0.4);
          
          const frontRightByPosition = mesh.children.find(child => 
            child.position && 
            child.position.x > 0.4 && 
            child.position.z > 0.4);
          
          // Use os resultados da busca por posição se necessário
          if (!frontLeftWheelGroup && frontLeftByPosition) {
            frontLeftWheelGroup = frontLeftByPosition;
          }
          
          if (!frontRightWheelGroup && frontRightByPosition) {
            frontRightWheelGroup = frontRightByPosition;
          }
        }
        
        if (frontLeftWheelGroup) {
          // Retorna diretamente à posição zero para resposta imediata
          frontLeftWheelGroup.rotation.y = 0;
        }
        
        if (frontRightWheelGroup) {
          // Retorna diretamente à posição zero para resposta imediata
          frontRightWheelGroup.rotation.y = 0;
        }
      }
    }
    
    // Rotaciona as rodas enquanto o carro se move
    if (mesh && mesh.children && mesh.children.length > 0) {
      // Encontra todas as rodas usando userData ou nome
      let wheels = mesh.children.filter(child => 
        (child.userData && child.userData.wheelType) || 
        (child.name && child.name.includes("Wheel")));
      
      // Fallback: se não encontrar rodas por userData ou nome, procura por posição
      if (wheels.length === 0) {
        wheels = mesh.children.filter(child => 
          child.position && 
          Math.abs(child.position.x) > 0.4 && 
          Math.abs(child.position.y) < -0.1);
      }
      
      // Log para debug
      console.log("Rodas para rotação encontradas:", wheels.length);
      
      // Velocidade de rotação baseada na velocidade do carro
      const wheelRotationSpeed = currentSpeedRef.current * 0.3; // Aumentado para maior visibilidade
      
      // Aplica rotação a todas as rodas
      wheels.forEach(wheel => {
        // Rodas dianteiras já têm rotação no eixo Y para virar
        // Aqui aplicamos rotação no eixo X para simular o movimento para frente/trás
        if (wheel.children && wheel.children.length > 0) {
          const firstMesh = wheel.children[0];
          if (firstMesh) {
            // Rotação em Z porque as rodas estão rotacionadas em 90 graus (Math.PI/2)
            if (currentSpeedRef.current !== 0) {
              firstMesh.rotation.z += (currentSpeedRef.current > 0 ? -1 : 1) * wheelRotationSpeed * delta * 10;
            }
          }
        }
      });
    }

    // Atualiza a referência de rotação do carro
    if (mesh) {
      carRotationRef.current.copy(mesh.rotation);
    }

    // Verifica se o carro está de cabeça para baixo
    const isUpsideDown = checkIfUpsideDown();

    return {
      movement,
      isUpsideDown
    };
  };

  /**
   * Verifica se o carro está de cabeça para baixo
   * @returns {Boolean} Verdadeiro se o carro estiver de cabeça para baixo
   */
  const checkIfUpsideDown = () => {
    // Converte a rotação para graus
    const rotationDegrees = {
      x: THREE.MathUtils.radToDeg(carRotationRef.current.x) % 360,
      y: THREE.MathUtils.radToDeg(carRotationRef.current.y) % 360,
      z: THREE.MathUtils.radToDeg(carRotationRef.current.z) % 360
    };

    // Normaliza os ângulos para o intervalo -180 a 180
    const normalizeAngle = (angle) => {
      return angle > 180 ? angle - 360 : (angle < -180 ? angle + 360 : angle);
    };

    const normalizedX = normalizeAngle(rotationDegrees.x);
    const normalizedZ = normalizeAngle(rotationDegrees.z);

    // Verifica se o ângulo de rotação excede o ângulo crítico
    return (Math.abs(normalizedX) > PLAYER_CONFIG.CRITICAL_ANGLE || 
            Math.abs(normalizedZ) > PLAYER_CONFIG.CRITICAL_ANGLE);
  };

  /**
   * Detecta colisão com uma rampa e aplica impulso se necessário
   * @param {Object} collision - Informações da colisão
   * @param {Object} rigidBody - Referência ao corpo rígido do carro
   */
  const handleRampCollision = (collision, rigidBody) => {
    if (!rigidBody || !collision) return;

    // Verifica se a colisão é com uma rampa (pode ser identificada por tags, nomes, etc.)
    const isRamp = collision.target?.name?.includes('ramp') || false;
    
    if (isRamp && currentSpeedRef.current > PLAYER_CONFIG.MIN_SPEED_FOR_RAMP) {
      // Calcula o impulso com base na velocidade
      const impulseStrength = PLAYER_CONFIG.RAMP_BOOST * 
        (currentSpeedRef.current / PLAYER_CONFIG.MAX_SPEED);
      
      // Aplica o impulso vertical
      rigidBody.applyImpulse({ x: 0, y: impulseStrength, z: 0 }, true);
      
      // Atualiza o estado de voo
      isInAirRef.current = true;
      setIsFlying(true);
      
      console.log('Ramp boost applied!', impulseStrength);
    }
    
    // Detecta e supera pequenos obstáculos (degraus)
    handleSmallObstacles(collision, rigidBody);
  };
  
  /**
   * Detecta e ajuda o carro a superar pequenos obstáculos (degraus)
   * @param {Object} collision - Informações da colisão
   * @param {Object} rigidBody - Referência ao corpo rígido do carro
   */
  const handleSmallObstacles = (collision, rigidBody) => {
    if (!rigidBody || !collision) return;
    
    // Obtém a normal da colisão (direção perpendicular à superfície de colisão)
    const normal = collision.normal;
    if (!normal) return;
    
    // Usa as constantes definidas para o tamanho da roda e altura máxima do obstáculo
    const wheelRadius = PLAYER_CONFIG.WHEEL_RADIUS;
    const maxObstacleHeight = PLAYER_CONFIG.MAX_OBSTACLE_HEIGHT;
    
    // Verifica se a colisão é frontal (na direção do movimento)
    const carDirection = new THREE.Vector3(0, 0, 1).applyEuler(carRotationRef.current);
    carDirection.y = 0;
    carDirection.normalize();
    
    // Calcula o ângulo entre a direção do carro e a normal da colisão
    const normalXZ = new THREE.Vector3(normal.x, 0, normal.z).normalize();
    const dotProduct = carDirection.dot(normalXZ);
    
    // Se a colisão for frontal (ângulo próximo a 180 graus, dot product próximo a -1)
    // e o carro estiver em movimento
    if (dotProduct < -0.5 && currentSpeedRef.current > 0.5) {
      // Verifica a altura da colisão em relação ao solo
      // Se a colisão ocorrer abaixo da altura máxima permitida
      if (collision.point && collision.point.y < maxObstacleHeight) {
        // Aplica um impulso vertical para ajudar o carro a superar o obstáculo
        // A força do impulso é proporcional à velocidade do carro
        const obstacleImpulse = Math.min(
          PLAYER_CONFIG.ACCELERATION * 12 * (currentSpeedRef.current / PLAYER_CONFIG.MAX_SPEED),
          PLAYER_CONFIG.JUMP_FORCE * PLAYER_CONFIG.OBSTACLE_ASSIST
        );
        
        // Aplica o impulso vertical e um pouco na direção do movimento
        rigidBody.applyImpulse({ 
          x: carDirection.x * obstacleImpulse * 0.6, 
          y: obstacleImpulse, 
          z: carDirection.z * obstacleImpulse * 0.6 
        }, true);
        
        console.log('Small obstacle assistance applied!', obstacleImpulse);
      }
    }
  };

  /**
   * Gerencia o estado de contato com o solo
   * @param {Boolean} isGrounded - Se o carro está em contato com o solo
   */
  const updateGroundedState = (isGrounded) => {
    // Atualiza o estado de contato com o solo
    isGroundedRef.current = isGrounded;
    
    // Se acabou de tocar o solo após estar no ar
    if (isGrounded && isInAirRef.current) {
      isInAirRef.current = false;
      setIsFlying(false);
      console.log('Landed!');
    }
    
    // Atualiza o tempo do último contato com o solo
    if (isGrounded) {
      lastGroundedTimeRef.current = Date.now();
    }
  };

  return {
    updateCarPhysics,
    handleRampCollision,
    handleSmallObstacles,
    updateGroundedState,
    isDrifting,
    isFlying,
    currentSpeed
  };
}