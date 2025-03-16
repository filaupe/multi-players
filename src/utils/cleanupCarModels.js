/**
 * Script para limpar arquivos desnecessários nos modelos de carros
 * 
 * Este script remove arquivos duplicados e desnecessários nas pastas de carros.
 * 
 * Instruções:
 * 1. Execute o script: node src/utils/cleanupCarModels.js
 */

const fs = require('fs-extra');
const path = require('path');

// Diretório de origem
const sourceDir = path.resolve(__dirname, '../../src/assets/models/cars');

// Lista de extensões de arquivos a manter na pasta source
const sourceExtensions = ['.fbx', '.blend', '.max', '.c4d', '.ma', '.mb'];

// Função para limpar uma pasta de carro
async function cleanupCarFolder(carDir) {
  try {
    console.log(`Limpando pasta: ${carDir}`);
    
    // Verifica se as pastas source e textures existem
    const sourceDir = path.join(carDir, 'source');
    const texturesDir = path.join(carDir, 'textures');
    
    if (!fs.existsSync(sourceDir) || !fs.existsSync(texturesDir)) {
      console.log(`Pasta source ou textures não encontrada em ${carDir}`);
      return false;
    }
    
    // Lista todos os arquivos na pasta source
    const sourceFiles = fs.readdirSync(sourceDir);
    
    // Remove arquivos que não são modelos 3D da pasta source
    for (const file of sourceFiles) {
      const filePath = path.join(sourceDir, file);
      
      // Se for um diretório, processa recursivamente
      if (fs.statSync(filePath).isDirectory()) {
        // Mantém diretórios que contêm arquivos FBX
        const hasFbx = fs.readdirSync(filePath).some(f => f.toLowerCase().endsWith('.fbx'));
        if (hasFbx) {
          continue;
        }
        
        // Remove diretórios que não contêm arquivos FBX
        fs.removeSync(filePath);
        console.log(`Removido diretório: ${filePath}`);
      } else {
        // Verifica se é um arquivo de modelo 3D
        const ext = path.extname(file).toLowerCase();
        if (!sourceExtensions.includes(ext)) {
          // Se não for um arquivo de modelo, verifica se existe na pasta textures
          const textureFile = path.join(texturesDir, file);
          if (fs.existsSync(textureFile)) {
            // Se existir na pasta textures, remove da pasta source
            fs.removeSync(filePath);
            console.log(`Removido arquivo duplicado: ${filePath}`);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao limpar ${carDir}:`, error);
    return false;
  }
}

// Função principal
async function cleanupAllCars() {
  try {
    // Verifica se o diretório de origem existe
    if (!fs.existsSync(sourceDir)) {
      console.error(`Diretório de origem não encontrado: ${sourceDir}`);
      return;
    }
    
    // Lista todos os diretórios de carros
    const carDirs = fs.readdirSync(sourceDir)
      .filter(item => {
        const itemPath = path.join(sourceDir, item);
        return fs.statSync(itemPath).isDirectory() && item.toLowerCase().startsWith('carro');
      })
      .map(item => path.join(sourceDir, item));
    
    if (carDirs.length === 0) {
      console.log('Nenhum diretório de carro encontrado.');
      return;
    }
    
    console.log(`Encontrados ${carDirs.length} diretórios de carros para limpar.`);
    
    // Limpa cada diretório de carro
    for (const carDir of carDirs) {
      await cleanupCarFolder(carDir);
    }
    
    console.log('Limpeza concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a limpeza:', error);
  }
}

// Executa a função principal
cleanupAllCars();