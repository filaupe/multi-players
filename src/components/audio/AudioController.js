import React, { useEffect, useState } from 'react';
import { audioManager } from '../../assets/audio';

/**
 * Componente para controlar o áudio do jogo
 * Este componente pode ser usado para gerenciar o áudio globalmente
 */
function AudioController() {
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.7);

  // Inicializa o gerenciador de áudio
  useEffect(() => {
    // Aqui você pode carregar os sons que serão usados no jogo
    // Exemplo:
    // audioManager.loadSound('engine', '/assets/audio/sfx/engine.mp3');
    // audioManager.loadSound('crash', '/assets/audio/sfx/crash.mp3');
    // audioManager.loadSound('background', '/assets/audio/music/race-theme.mp3');
    
    // Inicia a música de fundo quando o componente for montado
    // audioManager.playMusic('background');
    
    // Limpa os sons quando o componente for desmontado
    return () => {
      audioManager.stopAll();
    };
  }, []);

  // Atualiza o estado de mudo no gerenciador de áudio
  useEffect(() => {
    audioManager.setMuted(isMuted);
  }, [isMuted]);

  // Atualiza o volume da música no gerenciador de áudio
  useEffect(() => {
    audioManager.setMusicVolume(musicVolume);
  }, [musicVolume]);

  // Atualiza o volume dos efeitos sonoros no gerenciador de áudio
  useEffect(() => {
    audioManager.setSFXVolume(sfxVolume);
  }, [sfxVolume]);

  // Alterna entre mudo e som
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Ajusta o volume da música
  const handleMusicVolumeChange = (e) => {
    setMusicVolume(parseFloat(e.target.value));
  };

  // Ajusta o volume dos efeitos sonoros
  const handleSfxVolumeChange = (e) => {
    setSfxVolume(parseFloat(e.target.value));
  };

  return (
    <div className="audio-controls" style={{
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '10px',
      borderRadius: '5px',
      color: 'white',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: '200px'
    }}>
      <button 
        onClick={toggleMute}
        style={{
          padding: '8px',
          backgroundColor: isMuted ? '#FF4500' : '#32CD32',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isMuted ? 'Ativar Som' : 'Silenciar'}
      </button>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Música: {Math.round(musicVolume * 100)}%
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={musicVolume}
          onChange={handleMusicVolumeChange}
          style={{ width: '100%' }}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Efeitos: {Math.round(sfxVolume * 100)}%
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={sfxVolume}
          onChange={handleSfxVolumeChange}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default AudioController;