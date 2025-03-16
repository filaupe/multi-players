# Configuração do Modo Multiplayer

Este documento explica como configurar o jogo para permitir que outros jogadores se conectem à sua instância.

## Pré-requisitos

- Todos os dispositivos devem estar na mesma rede Wi-Fi/LAN
- O computador que hospeda o jogo não deve ter firewall bloqueando a porta 4000
- Você precisa saber o endereço IP local do seu computador

## Como descobrir seu IP local

### No Windows:
1. Abra o Prompt de Comando (cmd)
2. Digite `ipconfig` e pressione Enter
3. Procure por "Endereço IPv4" na seção da sua conexão de rede ativa

### No macOS:
1. Abra as Preferências do Sistema > Rede
2. Selecione sua conexão ativa (Wi-Fi ou Ethernet)
3. O endereço IP será exibido no painel direito

### No Linux:
1. Abra o Terminal
2. Digite `ip addr` ou `ifconfig` e pressione Enter
3. Procure pelo endereço IP na interface de rede ativa (geralmente começa com 192.168 ou 10.0)

## Configuração do Servidor

1. Abra o arquivo `src/config/serverConfig.js`
2. Altere a linha com `SERVER_ADDRESS` para usar seu IP local:

```javascript
export const SERVER_ADDRESS = 'http://SEU_IP_LOCAL:4000';
```

Por exemplo:
```javascript
export const SERVER_ADDRESS = 'http://192.168.1.100:4000';
```

3. Salve o arquivo e reinicie o servidor:

```bash
npm run server
```

4. Inicie o cliente:

```bash
npm start
```

## Conectando outros jogadores

1. Outros jogadores precisam usar o mesmo endereço de servidor para se conectar
2. Eles podem fazer isso de duas maneiras:

   a) Configurando o arquivo `serverConfig.js` com seu IP:
   ```javascript
   export const SERVER_ADDRESS = 'http://SEU_IP_LOCAL:4000';
   ```

   b) Ou definindo a variável de ambiente ao iniciar o jogo:
   ```bash
   REACT_APP_SERVER_URL=http://SEU_IP_LOCAL:4000 npm start
   ```

## Solução de problemas

### Erro de conexão recusada

Se outros jogadores receberem o erro `ERR_CONNECTION_REFUSED`:

1. Verifique se o servidor está rodando
2. Verifique se o IP está correto
3. Verifique se o firewall não está bloqueando a porta 4000
4. Certifique-se de que todos estão na mesma rede

### Erro de CORS

Se houver erros de CORS:

1. Verifique se a configuração CORS no servidor está correta
2. Reinicie o servidor após fazer alterações

## Testando localmente

Para testar o multiplayer localmente em um único computador:

1. Inicie o servidor normalmente
2. Abra duas janelas do navegador
3. Em cada janela, acesse o jogo com um nome de jogador diferente