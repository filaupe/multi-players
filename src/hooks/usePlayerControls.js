// src/hooks/usePlayerControls.js
import { useRef, useEffect } from 'react';

/**
 * Hook para gerenciar os controles do jogador via teclado
 * @returns {Object} Objeto contendo a referência às teclas pressionadas
 */
export function usePlayerControls() {
  const keysRef = useRef({});

  useEffect(() => {
    // Manipuladores de eventos para teclas pressionadas e liberadas
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    
    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    
    // Adiciona os event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Limpa os event listeners quando o componente é desmontado
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { keysRef };
}