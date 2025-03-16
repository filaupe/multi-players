/**
 * Configurações para o React Three Fiber
 * 
 * Este arquivo contém configurações para melhorar a renderização 3D
 * e garantir compatibilidade com diferentes navegadores e dispositivos.
 */

// Configurações padrão para o Canvas do React Three Fiber
export const defaultCanvasConfig = {
  // Configurações de renderização
  gl: {
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  },
  
  // Configurações de desempenho
  dpr: [1, 2], // Densidade de pixels (min, max)
  shadows: true,
  
  // Configurações de câmera
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5]
  },
  
  // Configurações de eventos
  events: {
    priority: 1, // Prioridade de eventos (1 = alta)
    pointerEvents: true
  },
  
  // Configurações de desempenho
  performance: {
    min: 0.5, // Qualidade mínima (0.5 = 50%)
    max: 1, // Qualidade máxima (1 = 100%)
    debounce: 200 // Tempo de debounce para ajustes de qualidade
  }
};

// Configurações para modelos FBX
export const fbxModelConfig = {
  // Escala padrão para modelos FBX
  scale: [0.005, 0.005, 0.005],
  
  // Rotação padrão para modelos FBX
  rotation: [0, Math.PI, 0],
  
  // Posição padrão para modelos FBX
  position: [0, -0.3, 0]
};

// Configurações de iluminação
export const defaultLightingConfig = {
  // Luz ambiente
  ambientLight: {
    intensity: 0.7,
    color: '#ffffff'
  },
  
  // Luz direcional principal
  mainLight: {
    position: [5, 8, 5],
    intensity: 1.5,
    color: '#ffffff',
    castShadow: true
  },
  
  // Luz de preenchimento
  fillLight: {
    position: [-5, 5, -5],
    intensity: 0.8,
    color: '#4169E1',
    castShadow: false
  }
};

// Configurações de sombras
export const shadowConfig = {
  mapSize: [1024, 1024],
  bias: -0.0001,
  radius: 1
};

// Configurações de ambiente
export const environmentConfig = {
  preset: 'city', // Preset de ambiente (city, forest, dawn, sunset, night, warehouse, park, lobby)
  background: false // Não usar o ambiente como fundo
};

// Configurações de controles de órbita
export const orbitControlsConfig = {
  enableZoom: false,
  enablePan: false,
  autoRotate: false,
  minPolarAngle: Math.PI / 4,
  maxPolarAngle: Math.PI / 2,
  enableRotate: false
};