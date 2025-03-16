// src/components/game/NameTag.js
import React from 'react';
import { Billboard, Text } from '@react-three/drei';

/**
 * Componente para exibir o nome do jogador acima do personagem
 * @param {Object} props - Propriedades do componente
 * @param {string} props.name - Nome a ser exibido
 * @param {Array} props.position - Posição [x, y, z] do nametag
 * @param {string} props.color - Cor do texto (padrão: preto)
 */
function NameTag({ name, position, color = 'black' }) {
  return (
    <Billboard position={position}>
      <Text 
        fontSize={0.5} 
        color={color} 
        anchorX="center" 
        anchorY="middle"
      >
        {name}
      </Text>
    </Billboard>
  );
}

export default NameTag;