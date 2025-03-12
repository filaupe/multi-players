// src/components/NameTag.js
import React from 'react';
import { Billboard, Text } from '@react-three/drei';

function NameTag({ text, position }) {
  return (
    <Billboard position={position}>
      <Text fontSize={0.5} color="black" anchorX="center" anchorY="middle">
        {text}
      </Text>
    </Billboard>
  );
}

export default NameTag;
