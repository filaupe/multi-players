# Multi-Players Game

Um jogo multiplayer 3D desenvolvido com React, Three.js e Socket.IO.

## Configuração Inicial

Antes de iniciar o jogo, é necessário extrair os modelos 3D dos arquivos ZIP. Siga os passos abaixo:

1. Instale as dependências:
   ```
   npm install
   ```

2. Execute o script de extração de modelos:
   ```
   npm run extract-models
   ```
   Este script extrairá os arquivos GLTF dos arquivos ZIP na pasta `src/assets/models/cars` e os colocará nas pastas corretas em `public/models/cars` para serem usados pelo jogo.

3. Inicie o jogo:
   ```
   npm start
   ```

## Solução de Problemas

### Modelos 3D não aparecem

Se os modelos 3D não aparecerem, verifique se:

1. O script de extração foi executado com sucesso
2. Os arquivos GLTF foram extraídos corretamente para as pastas em `public/models/cars`
3. Cada pasta de carro contém um arquivo `scene.gltf`

Se ainda houver problemas, o jogo usará automaticamente um modelo de fallback para garantir que você possa jogar mesmo sem os modelos 3D.

## Desenvolvimento

### Estrutura de Pastas

- `public/models/cars/`: Contém os modelos 3D dos carros
- `src/assets/models/cars/`: Contém os arquivos ZIP originais dos modelos
- `src/components/`: Componentes React do jogo
- `scripts/`: Scripts utilitários, como o script de extração de modelos

### Adicionando Novos Modelos

Para adicionar novos modelos de carros:

1. Adicione o arquivo ZIP do modelo na pasta `src/assets/models/cars/`
2. Adicione o modelo na lista em `src/assets/models/cars/index.js`
3. Execute o script de extração: `npm run extract-models`