/**
 * Arquivo de índice para importação de áudios
 * 
 * Este arquivo facilita a importação de arquivos de áudio no jogo.
 * Adicione suas importações de áudio aqui e exporte-as para uso em todo o jogo.
 */

// Músicas
import relaxingGuitar from './music/relaxing-guitar-loop-v5.mp3';

// Efeitos sonoros
// Importando o som de clique de botão como um módulo
import popCleanAudio from './sfx/pop-clean.mp3';

export { relaxingGuitar };

export const popClean = popCleanAudio;
// Exemplo: export { default as carEngine } from './sfx/car-engine.mp3';
// Exemplo: export { default as crash } from './sfx/crash.mp3';

/**
 * Função auxiliar para carregar e reproduzir sons
 * @param {string} soundPath - Caminho para o arquivo de som
 * @param {Object} options - Opções de reprodução (loop, volume, etc.)
 * @returns {HTMLAudioElement} - Elemento de áudio
 */
export const playSound = (soundPath, options = {}) => {
  const audio = new Audio(soundPath);
  
  // Configurar opções
  if (options.loop) audio.loop = options.loop;
  if (options.volume !== undefined) audio.volume = options.volume;
  
  // Reproduzir o som
  audio.play().catch(error => {
    console.warn('Erro ao reproduzir som:', error);
  });
  
  return audio;
};

/**
 * Classe para gerenciar áudio no jogo
 */
export class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.isMuted = false;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
  }

  /**
   * Carrega um som na memória
   * @param {string} id - Identificador único para o som
   * @param {string} path - Caminho para o arquivo de som
   */
  loadSound(id, path) {
    // Verifica se o som já foi carregado
    if (this.sounds[id]) {
      return; // Som já carregado, não precisa carregar novamente
    }
    
    // Cria um novo elemento de áudio
    const audio = new Audio(path);
    
    // Configura o evento de erro para registrar problemas de carregamento
    audio.onerror = (e) => {
      console.error(`Erro ao carregar o som ${id}:`, e);
    };
    
    // Pré-carrega o áudio
    audio.load();
    
    // Armazena o som no dicionário
    this.sounds[id] = audio;
  }

  /**
   * Reproduz um efeito sonoro
   * @param {string} id - Identificador do som
   * @param {boolean} loop - Se o som deve ser reproduzido em loop
   * @returns {HTMLAudioElement} - Elemento de áudio ou null se estiver mudo
   */
  playSFX(id, loop = false) {
    if (this.isMuted) return null;
    
    const sound = this.sounds[id];
    if (!sound) {
      console.warn(`Som ${id} não encontrado`);
      return null;
    }
    
    sound.volume = this.sfxVolume;
    sound.loop = loop;
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.warn(`Erro ao reproduzir som ${id}:`, error);
    });
    
    return sound;
  }

  /**
   * Reproduz música de fundo
   * @param {string} id - Identificador da música
   */
  playMusic(id) {
    if (this.isMuted) return;
    
    // Para a música atual se estiver tocando
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
    
    const music = this.sounds[id];
    if (!music) {
      console.warn(`Música ${id} não encontrada`);
      return;
    }
    
    music.volume = this.musicVolume;
    music.loop = true;
    
    // Tenta reproduzir a música e lida com possíveis erros
    const playPromise = music.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn(`Erro ao reproduzir música ${id}:`, error);
        
        // Tenta reproduzir novamente após interação do usuário
        const resumeAudio = () => {
          music.play().catch(e => console.warn('Falha ao reproduzir áudio após interação:', e));
          document.removeEventListener('click', resumeAudio);
          document.removeEventListener('keydown', resumeAudio);
        };
        
        document.addEventListener('click', resumeAudio, { once: true });
        document.addEventListener('keydown', resumeAudio, { once: true });
      });
    }
    
    this.music = music;
  }

  /**
   * Para todos os sons
   */
  stopAll() {
    // Para todos os efeitos sonoros
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    
    // Limpa a referência à música atual
    this.music = null;
  }

  /**
 * Ativa/desativa o áudio
 * @param {boolean} muted - Se o áudio deve ser silenciado
 */
setMuted(muted) {
  this.isMuted = muted;
  
  // Para todos os sons se estiver silenciado
  if (muted) {
    this.stopAll();
  } else if (this.music) {
    // Se não estiver silenciado e tiver uma música definida, tenta reproduzi-la novamente
    const musicId = Object.keys(this.sounds).find(id => this.sounds[id] === this.music);
    if (musicId) {
      this.playMusic(musicId);
    }
  }
  
  // Dispara um evento personalizado para notificar a mudança de estado
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent('audioMuteChanged', { 
      detail: { muted: this.isMuted } 
    }));
  }
  
  // Salva a preferência no localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('audioMuted', muted ? 'true' : 'false');
  }
  
  console.log(`Áudio ${muted ? 'silenciado' : 'ativado'}`);
  return this.isMuted;
}

  /**
   * Define o volume da música
   * @param {number} volume - Volume entre 0 e 1
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
  }

  /**
   * Define o volume dos efeitos sonoros
   * @param {number} volume - Volume entre 0 e 1
   */
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
  
  /**
   * Alterna o estado de silenciamento
   * @returns {boolean} O novo estado de silenciamento
   */
  toggleMute() {
    return this.setMuted(!this.isMuted);
  }
}

// Exporta uma instância única do gerenciador de áudio
export const audioManager = new AudioManager();

/**
 * Alterna entre silenciar e ativar o áudio
 * @returns {boolean} O novo estado de silenciamento (true = silenciado, false = ativo)
 */
export const toggleMute = () => {
  const newMuteState = !audioManager.isMuted;
  audioManager.setMuted(newMuteState);
  return newMuteState;
};

/**
 * Configura o botão de silenciar
 * Esta função procura por botões de silenciar no DOM e configura os listeners
 */
export const setupMuteButton = () => {
  // Carrega a preferência salva
  if (typeof localStorage !== 'undefined') {
    const savedMute = localStorage.getItem('audioMuted');
    if (savedMute === 'true') {
      audioManager.setMuted(true);
    }
  }
  
  // Função para atualizar a aparência do botão de silenciar
  const updateMuteButtonUI = (muted) => {
    const muteButtons = document.querySelectorAll('.mute-button, .sound-toggle, #muteButton, [data-action="mute"]');
    
    muteButtons.forEach(button => {
      // Atualiza classes para refletir o estado
      if (muted) {
        button.classList.add('muted');
        button.classList.remove('unmuted');
      } else {
        button.classList.add('unmuted');
        button.classList.remove('muted');
      }
      
      // Atualiza texto ou ícone se necessário
      const muteIcon = button.querySelector('.mute-icon, .sound-icon');
      const muteText = button.querySelector('.mute-text');
      
      if (muteIcon) {
        // Se houver um ícone, atualiza sua classe ou atributos
        muteIcon.classList.toggle('fa-volume-mute', muted);
        muteIcon.classList.toggle('fa-volume-up', !muted);
      }
      
      if (muteText) {
        // Se houver um texto, atualiza seu conteúdo
        muteText.textContent = muted ? 'Ativar Som' : 'Silenciar';
      }
      
      // Atualiza atributos ARIA para acessibilidade
      button.setAttribute('aria-pressed', muted ? 'true' : 'false');
      button.setAttribute('title', muted ? 'Ativar Som' : 'Silenciar');
    });
  };
  
  // Configura os listeners para os botões de silenciar
  document.addEventListener('click', (event) => {
    const muteButton = 
      event.target.closest('.mute-button') || 
      event.target.closest('.sound-toggle') || 
      event.target.closest('#muteButton') ||
      event.target.closest('[data-action="mute"]');
    
    if (muteButton) {
      const newMuteState = toggleMute();
      updateMuteButtonUI(newMuteState);
      
      // Evita que o som de clique seja reproduzido ao silenciar
      event.stopPropagation();
    }
  });
  
  // Escuta por mudanças no estado de silenciamento
  document.addEventListener('audioMuteChanged', (event) => {
    updateMuteButtonUI(event.detail.muted);
  });
  
  // Atualiza a UI inicialmente
  updateMuteButtonUI(audioManager.isMuted);
  
  console.log('Mute button setup complete');
};

/**
 * Reproduz o som de clique de botão
 * Esta função pode ser chamada diretamente de qualquer parte do código
 */
export const playButtonClickSound = () => {
  // Certifica-se de que o som está carregado
  if (!audioManager.sounds['buttonClick']) {
    audioManager.loadSound('buttonClick', popClean);
  }
  
  // Reproduz o som
  audioManager.playSFX('buttonClick');
};

/**
 * Configura o som de clique para todos os botões
 * Esta função deve ser chamada após o carregamento do DOM
 */
export const setupButtonClickSound = () => {
  // Carrega o som de clique
  audioManager.loadSound('buttonClick', popClean);
  
  // Função para reproduzir o som de clique
  const playClickSound = () => {
    audioManager.playSFX('buttonClick');
  };
  
  // Adiciona um listener para todos os cliques no documento
  document.addEventListener('click', (event) => {
    // Verifica se o elemento clicado é um botão ou tem papel de botão
    const isButton = 
      event.target.tagName === 'BUTTON' || 
      event.target.closest('button') ||
      event.target.getAttribute('role') === 'button' ||
      event.target.closest('[role="button"]') ||
      // Seletores específicos para controles de jogo, seleção de cor e botão de corrida
      event.target.closest('.game-control') ||
      event.target.closest('.color-selector') ||
      event.target.closest('.race-button') ||
      // Seletores adicionais para troca de cor do veículo
      event.target.closest('.car-color-option') ||
      event.target.closest('.color-picker') ||
      event.target.closest('[data-color]') ||
      event.target.closest('.vehicle-color-selector');
    
    if (isButton) {
      // Reproduz o som de clique
      playClickSound();
    }
  });
  
  // Adiciona listeners para eventos específicos de mudança de cor do veículo
  // Estes eventos podem ser disparados por código JavaScript ao mudar a cor
  document.addEventListener('colorChange', playClickSound);
  document.addEventListener('vehicleColorChange', playClickSound);
  document.addEventListener('carColorSelected', playClickSound);
  
  // Adiciona listeners para eventos de mudança em inputs que podem controlar a cor
  document.addEventListener('change', (event) => {
    const isColorInput = 
      event.target.type === 'color' ||
      event.target.classList.contains('color-input') ||
      event.target.closest('.color-selector');
    
    if (isColorInput) {
      playClickSound();
    }
  });
  
  console.log('Button click sound setup complete');
};

// Configura o som de clique automaticamente quando o DOM estiver pronto
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupButtonClickSound();
      setupMuteButton();
    });
  } else {
    setupButtonClickSound();
    setupMuteButton();
  }
}