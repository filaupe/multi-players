// src/components/ui/minimap/Minimap.js
import React, { useRef, useEffect } from 'react';
import './Minimap.css';

/**
 * Componente que renderiza um minimapa da pista no canto inferior direito
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.playerPosition - Posição atual do jogador {x, z}
 * @param {Number} props.playerRotation - Rotação atual do jogador (em radianos)
 * @param {Array} props.otherPlayers - Array com posições dos outros jogadores
 * @returns {JSX.Element} Componente do minimapa
 */
const Minimap = ({ playerPosition = { x: 0, z: 0 }, playerRotation = 0, otherPlayers = [] }) => {
  const canvasRef = useRef(null);
  
  // Desenha o minimapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 0.15; // Escala para converter coordenadas do mundo para o minimapa
    
    // Limpa o canvas
    ctx.clearRect(0, 0, width, height);
    
    // Desenha o fundo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);
    
    // Desenha a pista circular
    ctx.beginPath();
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 20;
    ctx.arc(centerX, centerY, 90 * scale, 0, Math.PI * 2);
    ctx.stroke();
    
    // Desenha a linha de chegada
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(75 * scale, -10 * scale, 25 * scale, 20 * scale);
    ctx.restore();
    
    // Desenha as rampas
    const rampPositions = [
      { x: 0, z: 90, rotation: 0 },
      { x: 0, z: -90, rotation: Math.PI },
      { x: 90, z: 0, rotation: -Math.PI/2 },
      { x: -90, z: 0, rotation: Math.PI/2 }
    ];
    
    rampPositions.forEach(ramp => {
      ctx.save();
      ctx.translate(centerX + ramp.x * scale, centerY + ramp.z * scale);
      ctx.rotate(ramp.rotation);
      ctx.fillStyle = '#FF5500';
      ctx.fillRect(-7.5 * scale, -4 * scale, 15 * scale, 8 * scale);
      ctx.restore();
    });
    
    // Desenha o jogador
    const playerX = centerX - playerPosition.x * scale;
    const playerZ = centerY - playerPosition.z * scale;
    
    ctx.save();
    ctx.translate(playerX, playerZ);
    ctx.rotate(playerRotation);
    
    // Triângulo para representar o jogador
    ctx.beginPath();
    ctx.fillStyle = '#FF0000';
    ctx.moveTo(0, -5);
    ctx.lineTo(-3, 5);
    ctx.lineTo(3, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Desenha outros jogadores
    otherPlayers.forEach(player => {
      if (!player.position) return;
      
      const otherX = centerX - player.position.x * scale;
      const otherZ = centerY - player.position.z * scale;
      
      ctx.save();
      ctx.translate(otherX, otherZ);
      ctx.rotate(player.rotation || 0);
      
      // Círculo para representar outros jogadores
      ctx.beginPath();
      ctx.fillStyle = player.color || '#00FF00';
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    
  }, [playerPosition, playerRotation, otherPlayers]);
  
  return (
    <div className="minimap-container">
      <canvas ref={canvasRef} width={200} height={200} className="minimap-canvas" />
    </div>
  );
};

export default Minimap;