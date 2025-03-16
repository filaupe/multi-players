// src/components/ui/GameHUD.js
import React from 'react';
import Minimap from './minimap/Minimap';

/**
 * Componente que exibe informações do jogo na tela
 * @param {Object} props - Propriedades do componente
 * @param {Number} props.speed - Velocidade atual do carro
 * @param {Boolean} props.isDrifting - Se o carro está derrapando
 * @param {Boolean} props.isFlying - Se o carro está no ar
 * @param {Boolean} props.isUpsideDown - Se o carro está de cabeça para baixo
 * @param {Object} props.playerPosition - Posição atual do jogador {x, z}
 * @param {Number} props.playerRotation - Rotação atual do jogador (em radianos)
 * @param {Array} props.otherPlayers - Array com posições dos outros jogadores
 * @returns {JSX.Element} Componente HUD
 */
const GameHUD = ({ 
  speed = 0, 
  isDrifting = false, 
  isFlying = false, 
  isUpsideDown = false,
  playerPosition = { x: 0, z: 0 },
  playerRotation = 0,
  otherPlayers = []
}) => {
  return (
    <>
      <div className="game-hud">
        <div className="speed-indicator">
          <span className="speed-value">{Math.round(speed * 10) / 10}</span>
          <span className="speed-unit">km/h</span>
        </div>
        
        <div className="status-indicators">
          {isDrifting && (
            <div className="status-indicator drift">
              DRIFT!
            </div>
          )}
          
          {isFlying && (
            <div className="status-indicator flying">
              AIR!
            </div>
          )}
          
          {isUpsideDown && (
            <div className="status-indicator danger">
              FLIPPED!
            </div>
          )}
        </div>
      </div>
      
      {/* Minimapa */}
      <Minimap 
        playerPosition={playerPosition}
        playerRotation={playerRotation}
        otherPlayers={otherPlayers}
      />
    </>
  );
};

export default GameHUD;