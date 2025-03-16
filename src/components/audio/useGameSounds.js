import { useEffect } from 'react';
import { audioManager } from '../../assets/audio';

/**
 * Hook personalizado para gerenciar os sons do jogo
 * @returns {Object} Objeto com funções para reproduzir sons do jogo
 */
export function useGameSounds() {
  // Carrega os sons quando o hook é usado pela primeira vez
  useEffect(() => {
    // Carrega os efeitos sonoros
    // Nota: Substitua estes caminhos pelos caminhos reais dos seus arquivos de som
    // audioManager.loadSound('engine', '/assets/audio/sfx/engine.mp3');
    // audioManager.loadSound('crash', '/assets/audio/sfx/crash.mp3');
    // audioManager.loadSound('drift', '/assets/audio/sfx/drift.mp3');
    // audioManager.loadSound('horn', '/assets/audio/sfx/horn.mp3');
    // audioManager.loadSound('victory', '/assets/audio/sfx/victory.mp3');
    // audioManager.loadSound('gameOver', '/assets/audio/sfx/game-over.mp3');
    
    // Carrega as músicas
    // audioManager.loadSound('menuMusic', '/assets/audio/music/menu-theme.mp3');
    // audioManager.loadSound('raceMusic', '/assets/audio/music/race-theme.mp3');
    
    // Limpa os sons quando o componente for desmontado
    return () => {
      audioManager.stopAll();
    };
  }, []);

  // Funções para reproduzir sons específicos do jogo
  const playEngineSound = (isAccelerating = false) => {
    // Exemplo de como você pode ajustar o volume com base na aceleração
    const engineSound = audioManager.playSFX('engine', true);
    if (engineSound && isAccelerating) {
      engineSound.volume = Math.min(1, audioManager.sfxVolume * 1.5);
    }
    return engineSound;
  };

  const playCrashSound = () => {
    return audioManager.playSFX('crash');
  };

  const playDriftSound = () => {
    return audioManager.playSFX('drift');
  };

  const playHornSound = () => {
    return audioManager.playSFX('horn');
  };

  const playVictorySound = () => {
    return audioManager.playSFX('victory');
  };

  const playGameOverSound = () => {
    return audioManager.playSFX('gameOver');
  };

  const playMenuMusic = () => {
    audioManager.playMusic('menuMusic');
  };

  const playRaceMusic = () => {
    audioManager.playMusic('raceMusic');
  };

  // Retorna todas as funções de som
  return {
    playEngineSound,
    playCrashSound,
    playDriftSound,
    playHornSound,
    playVictorySound,
    playGameOverSound,
    playMenuMusic,
    playRaceMusic
  };
}