/**
 * Script para descompactar os arquivos ZIP dos carros
 * 
 * Este script deve ser executado manualmente para extrair os modelos de carros
 * para a pasta public/models/cars.
 * 
 * Instruções:
 * 1. Instale as dependências: npm install adm-zip fs-extra
 * 2. Execute o script: node src/utils/extractCars.js
 */

const AdmZip = require('adm-zip');
const fs = require('fs-extra');
const path = require('path');

// Diretórios de origem e destino
const sourceDir = path.resolve(__dirname, '../../src/assets/models/cars');
const targetDir = path.resolve(__dirname, '../../public/models/cars');

// Função para extrair um arquivo ZIP
async function extractZip(zipPath, targetFolder) {
  try {
    const zip = new AdmZip(zipPath);
    
    // Cria o diretório de destino se não existir
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    
    // Extrai o arquivo ZIP
    zip.extractAllTo(targetFolder, true);
    console.log(`Extraído: ${path.basename(zipPath)} -> ${targetFolder}`);
    
    return true;
  } catch (error) {
    console.error(`Erro ao extrair ${zipPath}:`, error);
    return false;
  }
}

// Função principal
async function extractAllCars() {
  try {
    // Verifica se o diretório de origem existe
    if (!fs.existsSync(sourceDir)) {
      console.error(`Diretório de origem não encontrado: ${sourceDir}`);
      return;
    }
    
    // Cria o diretório de destino se não existir
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Lista todos os arquivos ZIP no diretório de origem
    const files = fs.readdirSync(sourceDir);
    const zipFiles = files.filter(file => file.endsWith('.zip'));
    
    if (zipFiles.length === 0) {
      console.log('Nenhum arquivo ZIP encontrado.');
      return;
    }
    
    console.log(`Encontrados ${zipFiles.length} arquivos ZIP para extrair.`);
    
    // Extrai cada arquivo ZIP
    for (const zipFile of zipFiles) {
      const zipPath = path.join(sourceDir, zipFile);
      const carName = zipFile.replace('.zip', '').toLowerCase().replace(/\s+/g, '-');
      const targetFolder = path.join(targetDir, carName);
      
      await extractZip(zipPath, targetFolder);
      
      // Cria um arquivo de thumbnail vazio (você pode substituir por uma imagem real)
      const thumbnailPath = path.join(targetFolder, 'thumbnail.png');
      if (!fs.existsSync(thumbnailPath)) {
        fs.writeFileSync(thumbnailPath, '');
        console.log(`Criado arquivo de thumbnail vazio: ${thumbnailPath}`);
      }
    }
    
    console.log('Extração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a extração:', error);
  }
}

// Executa a função principal
extractAllCars();