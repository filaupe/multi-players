// src/components/FollowOrbitControls.js
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function FollowOrbitControls({ playerRef, distance = 10, minDistance = 5, maxDistance = 20 }) {
  const orbitRef = useRef();

  useFrame(() => {
    if (playerRef.current && orbitRef.current) {
      const mesh = typeof playerRef.current.getMesh === 'function'
        ? playerRef.current.getMesh()
        : null;
      if (mesh && mesh.position) {
        orbitRef.current.target.copy(mesh.position);
        orbitRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={orbitRef}
      minDistance={minDistance}
      maxDistance={maxDistance}
      initialDistance={distance}
    />
  );
}

export default FollowOrbitControls;