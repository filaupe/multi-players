import React from 'react';

const SettingsPanel = ({ visible, soundMuted, musicMuted, onToggleSound, onToggleMusic }) => {
  return (
    <div className={`settings-panel ${visible ? 'visible' : ''}`}>
      <h3>Configurações</h3>
      
      <div className="settings-option">
        <label htmlFor="sound-toggle">Efeitos Sonoros</label>
        <div className="toggle-switch">
          <input 
            type="checkbox" 
            id="sound-toggle" 
            checked={!soundMuted}
            onChange={onToggleSound}
          />
          <label htmlFor="sound-toggle"></label>
        </div>
      </div>
      
      <div className="settings-option">
        <label htmlFor="music-toggle">Música de Fundo</label>
        <div className="toggle-switch">
          <input 
            type="checkbox" 
            id="music-toggle" 
            checked={!musicMuted}
            onChange={onToggleMusic}
          />
          <label htmlFor="music-toggle"></label>
        </div>
      </div>
      
      {/* Outras opções de configuração podem ser adicionadas aqui */}
      <div className="settings-option">
        <label htmlFor="quality-select">Qualidade Gráfica</label>
        <select id="quality-select" defaultValue="medium">
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>
      
      <div className="settings-option">
        <label htmlFor="sensitivity-range">Sensibilidade do Mouse</label>
        <input 
          type="range" 
          id="sensitivity-range" 
          min="1" 
          max="10" 
          defaultValue="5"
        />
      </div>
    </div>
  );
};

export default SettingsPanel;