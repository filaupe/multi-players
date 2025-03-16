import React, { useState, useEffect } from 'react';
import SettingsPanel from './SettingsPanel';
import ConfirmationDialog from './ConfirmationDialog';
import './GameControls.css';

// Ícones para os botões (usando Font Awesome)
const Icons = {
  SETTINGS: <i className="fas fa-cog"></i>,
  SOUND: <i className="fas fa-volume-up"></i>,
  SOUND_MUTED: <i className="fas fa-volume-mute"></i>,
  MUSIC: <i className="fas fa-music"></i>,
  MUSIC_MUTED: <i className="fas fa-ban"></i>,
  HOME: <i className="fas fa-home"></i>
};

const GameControls = ({ onReturnToMainMenu }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Função para alternar o painel de configurações
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Função para alternar o som do jogo
  const toggleSound = () => {
    setSoundMuted(!soundMuted);
    // Aqui você implementaria a lógica para silenciar os efeitos sonoros
  };

  // Função para alternar a música do jogo
  const toggleMusic = () => {
    setMusicMuted(!musicMuted);
    // Aqui você implementaria a lógica para silenciar a música de fundo
  };

  // Função para mostrar o diálogo de confirmação
  const handleHomeClick = () => {
    setShowConfirmation(true);
  };

  // Função para confirmar o retorno ao menu principal
  const handleConfirmReturn = () => {
    setShowConfirmation(false);
    if (onReturnToMainMenu) {
      onReturnToMainMenu();
    }
  };

  // Função para cancelar o retorno ao menu principal
  const handleCancelReturn = () => {
    setShowConfirmation(false);
  };

  // Fechar o painel de configurações ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettings && !event.target.closest('.settings-panel') && 
          !event.target.closest('.control-button[data-control="settings"]')) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  return (
    <>
      <div className="game-controls">
        <button 
          className={`control-button ${showSettings ? 'active' : ''}`}
          onClick={toggleSettings}
          data-control="settings"
          title="Configurações"
        >
          {Icons.SETTINGS}
        </button>
        
        <button 
          className={`control-button ${soundMuted ? 'active' : ''}`}
          onClick={toggleSound}
          title={soundMuted ? "Ativar som" : "Silenciar som"}
        >
          {soundMuted ? Icons.SOUND_MUTED : Icons.SOUND}
        </button>
        
        <button 
          className={`control-button ${musicMuted ? 'active' : ''}`}
          onClick={toggleMusic}
          title={musicMuted ? "Ativar música" : "Silenciar música"}
        >
          {musicMuted ? Icons.MUSIC_MUTED : Icons.MUSIC}
        </button>
        
        <button 
          className="control-button"
          onClick={handleHomeClick}
          title="Voltar ao menu principal"
        >
          {Icons.HOME}
        </button>
      </div>

      {/* Painel de configurações */}
      <SettingsPanel 
        visible={showSettings} 
        soundMuted={soundMuted}
        musicMuted={musicMuted}
        onToggleSound={toggleSound}
        onToggleMusic={toggleMusic}
      />

      {/* Diálogo de confirmação */}
      <ConfirmationDialog
        visible={showConfirmation}
        title="Voltar ao Menu Principal"
        message="Tem certeza que deseja sair do jogo e voltar ao menu principal? Seu progresso não salvo será perdido."
        onConfirm={handleConfirmReturn}
        onCancel={handleCancelReturn}
      />
    </>
  );
};

export default GameControls;