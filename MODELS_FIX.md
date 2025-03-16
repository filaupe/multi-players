# Correção de Problemas com Modelos FBX

Este documento explica como resolver o erro "THREE.FBXLoader: Unknown format" que estava ocorrendo ao carregar os modelos de carros.

## Problema

Os modelos FBX estavam localizados em pastas profundas dentro da estrutura de diretórios, com nomes como "FINAL_MODEL", "FINAL_MODEL_2", etc. O código não estava apontando corretamente para esses arquivos, resultando no erro de formato desconhecido.

## Solução

Foram implementadas as seguintes soluções:

1. **Atualização dos caminhos dos modelos**: Os caminhos para os arquivos FBX foram atualizados no arquivo `src/assets/models/cars/index.js` para apontar para os locais corretos.

2. **Estrutura simplificada**: Foi criado um script para copiar os modelos FBX para uma estrutura mais simples na pasta `public/models/cars`, facilitando o acesso.

3. **Tratamento de erros**: Os componentes que carregam os modelos foram atualizados para lidar melhor com erros de carregamento e usar modelos de fallback quando necessário.

4. **Caminhos alternativos**: Foram adicionados caminhos alternativos para os modelos, permitindo que o sistema tente primeiro o caminho simplificado e, se falhar, use o caminho original.

## Como usar

Para aplicar a solução, siga estes passos:

1. Execute o script de simplificação dos modelos:
   ```
   npm run simplify-models
   ```

2. Inicie a aplicação normalmente:
   ```
   npm start
   ```

## Estrutura dos arquivos

- **Modelos originais**: Localizados em `src/assets/models/cars/[Nome do Carro]/source/FINAL_MODEL_*/`
- **Modelos simplificados**: Copiados para `public/models/cars/[nome-do-carro]/model.fbx`

## Observações

- Os modelos FBX são grandes e podem levar algum tempo para carregar.
- Se ainda ocorrerem problemas, verifique se os arquivos FBX estão no formato correto e se são compatíveis com o Three.js.
- Pode ser necessário converter os modelos FBX para GLTF para melhor compatibilidade e desempenho.