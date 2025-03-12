import { useFrame, useThree } from '@react-three/fiber';

function PlayerCamera({ playerRef }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!playerRef.current) return;
    const mesh = playerRef.current.getMesh();
    if (!mesh) return;

    // Ajuste aqui o offset da câmera
    camera.position.x = mesh.position.x + 5;
    camera.position.y = mesh.position.y + 5;
    camera.position.z = mesh.position.z + 10;

    // Faz a câmera olhar para o personagem
    camera.lookAt(mesh.position);
  });

  return null;
}

export default PlayerCamera;
