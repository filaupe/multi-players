# Áudio do Jogo

Esta pasta contém todos os arquivos de áudio usados no jogo Multi-Players.

## Estrutura de Pastas

- `/music` - Músicas de fundo e trilhas sonoras
- `/sfx` - Efeitos sonoros (sons de motor, colisões, etc.)

## Formatos Recomendados

Para melhor compatibilidade entre navegadores, recomendamos:

- **MP3** - Formato mais compatível para a maioria dos navegadores
- **OGG** - Alternativa de código aberto com boa compressão
- **WAV** - Para efeitos sonoros curtos que precisam de alta qualidade

## Como Adicionar Novos Sons

1. Coloque os arquivos de áudio na pasta apropriada (`music` ou `sfx`)
2. Importe e registre o som no arquivo `index.js`

## Como Usar no Código

### Método Simples

```javascript
import { playSound } from '../assets/audio';

// Reproduzir um som
const engineSound = playSound('/assets/audio/sfx/engine.mp3', { loop: true, volume: 0.7 });

// Parar o som
engineSound.pause();
```

### Usando o AudioManager (Recomendado)

```javascript
import { audioManager } from '../assets/audio';

// Carregar sons no início do jogo
audioManager.loadSound('engine', '/assets/audio/sfx/engine.mp3');
audioManager.loadSound('crash', '/assets/audio/sfx/crash.mp3');
audioManager.loadSound('background', '/assets/audio/music/race-theme.mp3');

// Reproduzir efeitos sonoros
audioManager.playSFX('engine', true); // segundo parâmetro: loop
audioManager.playSFX('crash');

// Reproduzir música de fundo
audioManager.playMusic('background');

// Controlar volume
audioManager.setMusicVolume(0.5); // 50%
audioManager.setSFXVolume(0.7);   // 70%

// Silenciar/ativar todo o áudio
audioManager.setMuted(true);  // silenciar
audioManager.setMuted(false); // ativar
```

## Dicas para Áudio em Jogos Web

1. **Pré-carregue sons importantes** - Carregue sons críticos no início do jogo
2. **Use compressão adequada** - Arquivos menores carregam mais rápido
3. **Implemente controles de volume** - Permita que os jogadores ajustem o volume
4. **Considere limitações móveis** - Em dispositivos móveis, o áudio só pode ser iniciado após interação do usuário