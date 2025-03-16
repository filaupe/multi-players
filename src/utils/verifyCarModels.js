/**
 * Script para verificar se os modelos de carros foram processados corretamente
 * 
 * Este script verifica se todos os modelos de carros foram convertidos corretamente
 * e se estão prontos para uso no jogo.
 * 
 * Instruções:
 * 1. Execute o script: node src/utils/verifyCarModels.js
 */

const fs = require('fs-extra');
const path = require('path');

// Diretórios de origem e destino
const sourceDir = path.resolve(__dirname, '../../src/assets/models/cars');
const targetDir = path.resolve(__dirname, '../../public/models/cars');

// Função para verificar um modelo de carro
function verifyCarModel(carName) {
  try {
    const targetCarDir = path.join(targetDir, carName);
    
    // Verifica se o diretório existe
    if (!fs.existsSync(targetCarDir)) {
      console.error(`❌ Diretório não encontrado: ${targetCarDir}`);
      return false;
    }
    
    // Verifica se o arquivo scene.fbx existe
    const fbxPath = path.join(targetCarDir, 'scene.fbx');
    if (!fs.existsSync(fbxPath)) {
      console.error(`❌ Arquivo FBX não encontrado: ${fbxPath}`);
      return false;
    }
    
    // Verifica se o arquivo thumbnail.png existe
    const thumbnailPath = path.join(targetCarDir, 'thumbnail.png');
    if (!fs.existsSync(thumbnailPath)) {
      console.error(`❌ Arquivo de thumbnail não encontrado: ${thumbnailPath}`);
      return false;
    }
    
    // Verifica se há texturas
    const files = fs.readdirSync(targetCarDir);
    const textureFiles = files.filter(file => 
      file.endsWith('.png') || 
      file.endsWith('.jpg') || 
      file.endsWith('.jpeg')
    );
    
    if (textureFiles.length === 0) {
      console.warn(`⚠️ Nenhuma textura encontrada em: ${targetCarDir}`);
    }
    
    console.log(`✅ Modelo verificado com sucesso: ${carName}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao verificar ${carName}:`, error);
    return false;
  }
}

// Função principal
async function verifyAllCarModels() {
  try {
    console.log('Verificando modelos de carros...\n');
    
    // Verifica se o diretório de destino existe
    if (!fs.existsSync(targetDir)) {
      console.error(`❌ Diretório de destino não encontrado: ${targetDir}`);
      console.log('Execute o script de processamento primeiro: node src/utils/processCarModels.js');
      return;
    }
    
    // Lista todos os diretórios de carros no diretório de origem
    const sourceCars = fs.readdirSync(sourceDir)
      .filter(item => {
        const itemPath = path.join(sourceDir, item);
        return fs.statSync(itemPath).isDirectory() && item.toLowerCase().startsWith('carro');
      })
      .map(item => item.toLowerCase().replace(/\s+/g, '-'));
    
    // Lista todos os diretórios de carros no diretório de destino
    const targetCars = fs.readdirSync(targetDir)
      .filter(item => {
        const itemPath = path.join(targetDir, item);
        return fs.statSync(itemPath).isDirectory();
      });
    
    // Verifica se todos os carros foram convertidos
    let allConverted = true;
    for (const car of sourceCars) {
      if (!targetCars.includes(car)) {
        console.error(`❌ Carro não convertido: ${car}`);
        allConverted = false;
      }
    }
    
    if (!allConverted) {
      console.error('\n❌ Nem todos os carros foram convertidos.');
      console.log('Execute o script de processamento: node src/utils/processCarModels.js');
      return;
    }
    
    // Verifica cada modelo de carro
    let allVerified = true;
    for (const car of targetCars) {
      const verified = verifyCarModel(car);
      if (!verified) {
        allVerified = false;
      }
    }
    
    if (allVerified) {
      console.log('\n✅ Todos os modelos de carros foram verificados com sucesso!');
    } else {
      console.error('\n❌ Alguns modelos de carros não foram verificados corretamente.');
      console.log('Execute o script de processamento novamente: node src/utils/processCarModels.js');
    }
  } catch (error) {
    console.error('Erro durante a verificação:', error);
  }
}

// Executa a função principal
verifyAllCarModels();