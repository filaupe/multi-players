import React, { useState, useEffect } from 'react';
import { audioManager } from '../../assets/audio';
import { relaxingGuitar } from '../../assets/audio';

/**
 * Componente de controle de áudio para a tela inicial
 */
function HomeAudioControls() {
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(false);

  // Inicializa o áudio quando o componente é montado
  useEffect(() => {
    // Carrega a música de fundo se ainda não estiver carregada
    if (!audioManager.sounds['homeMusic']) {
      audioManager.loadSound('homeMusic', relaxingGuitar);
    }
    
    // Carrega o efeito sonoro de clique (se existir)
    try {
      // Tenta carregar o efeito sonoro de clique se existir
      // Se não existir, não vai gerar erro, apenas um aviso no console
      import('../../assets/audio/sfx/click.mp3')
        .then(clickSound => {
          audioManager.loadSound('click', clickSound.default);
        })
        .catch(err => {
          console.log('Efeito sonoro de clique não encontrado, ignorando.');
        });
    } catch (error) {
      console.log('Efeito sonoro de clique não encontrado, ignorando.');
    }
    
    // Garante que a música de fundo seja iniciada
    const startMusic = () => {
      // Verifica se a música já está tocando
      if (audioManager.music && !audioManager.music.paused) {
        return; // Música já está tocando, não faz nada
      }
      
      // Inicia a música de fundo
      audioManager.playMusic('homeMusic');
    };
    
    // Tenta iniciar a música imediatamente
    startMusic();
    
    // Como backup, tenta novamente após um pequeno atraso
    // Isso ajuda em casos onde o navegador pode atrasar o carregamento do áudio
    const musicTimer = setTimeout(startMusic, 500);
    
    // Limpa quando o componente é desmontado
    return () => {
      clearTimeout(musicTimer);
      if (audioManager.music && audioManager.music.src.includes('relaxing-guitar-loop-v5.mp3')) {
        audioManager.music.pause();
        audioManager.music.currentTime = 0;
        audioManager.music = null;
      }
    };
  }, []);

  // Controla o estado de mudo da música
  const toggleMusicMute = () => {
    const newMusicMuted = !isMusicMuted;
    setIsMusicMuted(newMusicMuted);
    
    if (audioManager.music) {
      if (newMusicMuted) {
        audioManager.music.volume = 0;
      } else {
        audioManager.music.volume = audioManager.musicVolume;
      }
    }
  };

  // Controla o estado de mudo dos efeitos sonoros
  const toggleSfxMute = () => {
    const newSfxMuted = !isSfxMuted;
    setIsSfxMuted(newSfxMuted);
    audioManager.setSFXVolume(newSfxMuted ? 0 : 0.7);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '10px',
      zIndex: 1000
    }}>
      {/* Botão de música */}
      <button
        onClick={toggleMusicMute}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease'
        }}
        title={isMusicMuted ? "Ativar Música" : "Silenciar Música"}
      >
        {isMusicMuted ? '🔇' : '🎵'}
      </button>
      
      {/* Botão de efeitos sonoros */}
      <button
        onClick={toggleSfxMute}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease'
        }}
        title={isSfxMuted ? "Ativar Efeitos Sonoros" : "Silenciar Efeitos Sonoros"}
      >
        {isSfxMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

export default HomeAudioControls;