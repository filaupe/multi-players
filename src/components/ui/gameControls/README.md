# Controles de Interface do Jogo

Este conjunto de componentes fornece uma interface de controle para o jogo, incluindo:

- Botão de configurações com painel expansível
- Controles de som (efeitos sonoros e música)
- Botão para voltar ao menu principal com diálogo de confirmação

## Como usar

Importe o componente `GameControls` e adicione-o à sua tela de jogo:

```jsx
import React from 'react';
import GameControls from '../components/ui/gameControls';

const GameScreen = () => {
  // Função para lidar com o retorno ao menu principal
  const handleReturnToMainMenu = () => {
    // Lógica para voltar ao menu principal
    console.log('Voltando ao menu principal...');
  };

  return (
    <div className="game-screen">
      {/* Conteúdo do jogo */}
      <div className="game-content">
        {/* Seu jogo aqui */}
      </div>

      {/* Controles do jogo */}
      <GameControls onReturnToMainMenu={handleReturnToMainMenu} />
    </div>
  );
};

export default GameScreen;
```

## Personalização

Você pode personalizar os controles modificando os estilos em `index.css` ou criando um arquivo CSS específico para os controles.

## Dependências

Este componente utiliza ícones do Font Awesome. Certifique-se de incluir o Font Awesome em seu projeto:

```html
<!-- No seu index.html -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
```

Ou instale via npm:

```bash
npm install @fortawesome/fontawesome-free
```

E importe no seu arquivo principal:

```javascript
import '@fortawesome/fontawesome-free/css/all.min.css';
```