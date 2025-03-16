/**
 * Script principal para processar modelos de carros
 * 
 * Este script executa todos os passos necessários para processar os modelos de carros:
 * 1. Limpa arquivos desnecessários
 * 2. Converte modelos FBX para GLTF
 * 
 * Instruções:
 * 1. Instale as dependências necessárias:
 *    npm install fs-extra fbx2gltf
 * 2. Execute o script: node src/utils/processCarModels.js
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');

// Caminho para os scripts
const cleanupScript = path.resolve(__dirname, './cleanupCarModels.js');
const processFbxScript = path.resolve(__dirname, './processFbxModels.js');

// Função para executar um script Node.js
async function runScript(scriptPath) {
  try {
    console.log(`Executando script: ${scriptPath}`);
    const { stdout, stderr } = await execPromise(`node "${scriptPath}"`);
    
    if (stdout) {
      console.log(stdout);
    }
    
    if (stderr) {
      console.error(stderr);
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao executar script ${scriptPath}:`, error);
    return false;
  }
}

// Função principal
async function processAllCarModels() {
  try {
    console.log('Iniciando processamento de modelos de carros...');
    
    // Passo 1: Limpar arquivos desnecessários
    console.log('\n=== PASSO 1: Limpando arquivos desnecessários ===');
    await runScript(cleanupScript);
    
    // Passo 2: Converter modelos FBX para GLTF
    console.log('\n=== PASSO 2: Convertendo modelos FBX para GLTF ===');
    await runScript(processFbxScript);
    
    console.log('\nProcessamento de modelos de carros concluído com sucesso!');
    console.log('\nVerifique os modelos convertidos na pasta public/models/cars');
  } catch (error) {
    console.error('Erro durante o processamento:', error);
  }
}

// Executa a função principal
processAllCarModels();