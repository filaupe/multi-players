/**
 * Script para extrair modelos GLTF dos arquivos ZIP
 * 
 * Este script extrai os arquivos GLTF dos arquivos ZIP na pasta de modelos de carros
 * e os coloca nas pastas corretas para serem usados pelo jogo.
 * 
 * Uso: node scripts/extract-models.js
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Caminho para a pasta de modelos de carros
const CARS_PATH = path.join(__dirname, '../public/models/cars');
// Caminho para a pasta de assets de modelos de carros
const ASSETS_PATH = path.join(__dirname, '../src/assets/models/cars');

// Função para extrair um arquivo ZIP
function extractZip(zipPath, extractPath) {
  try {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    console.log(`Extraído: ${zipPath} -> ${extractPath}`);
    return true;
  } catch (error) {
    console.error(`Erro ao extrair ${zipPath}:`, error);
    return false;
  }
}

// Função para processar todos os arquivos ZIP na pasta de assets
function processZipFiles() {
  // Lê todos os arquivos na pasta de assets
  const files = fs.readdirSync(ASSETS_PATH);
  
  // Filtra apenas os arquivos ZIP
  const zipFiles = files.filter(file => file.toLowerCase().endsWith('.zip'));
  
  console.log(`Encontrados ${zipFiles.length} arquivos ZIP para processar.`);
  
  // Processa cada arquivo ZIP
  zipFiles.forEach(zipFile => {
    const zipPath = path.join(ASSETS_PATH, zipFile);
    
    // Cria o nome da pasta de destino (remove a extensão .zip e converte para minúsculas com hífens)
    const folderName = zipFile
      .replace(/\.zip$/i, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
    
    const extractPath = path.join(CARS_PATH, folderName, 'source');
    
    // Cria as pastas necessárias se não existirem
    if (!fs.existsSync(path.join(CARS_PATH, folderName))) {
      fs.mkdirSync(path.join(CARS_PATH, folderName), { recursive: true });
    }
    
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }
    
    // Extrai o arquivo ZIP
    if (extractZip(zipPath, extractPath)) {
      // Procura por arquivos GLTF na pasta extraída
      findAndMoveGltfFiles(extractPath, path.join(CARS_PATH, folderName));
    }
  });
}

// Função para encontrar e mover arquivos GLTF para a pasta correta
function findAndMoveGltfFiles(sourcePath, destPath) {
  try {
    // Função recursiva para procurar arquivos GLTF
    function findGltfFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findGltfFiles(filePath, fileList);
        } else if (file.toLowerCase().endsWith('.gltf')) {
          fileList.push(filePath);
        }
      });
      
      return fileList;
    }
    
    // Encontra todos os arquivos GLTF
    const gltfFiles = findGltfFiles(sourcePath);
    
    if (gltfFiles.length === 0) {
      console.log(`Nenhum arquivo GLTF encontrado em ${sourcePath}`);
      return;
    }
    
    // Copia o primeiro arquivo GLTF encontrado para a pasta de destino
    const sourceGltf = gltfFiles[0];
    const destGltf = path.join(destPath, 'scene.gltf');
    
    // Copia o arquivo GLTF
    fs.copyFileSync(sourceGltf, destGltf);
    console.log(`Copiado: ${sourceGltf} -> ${destGltf}`);
    
    // Copia também os arquivos relacionados (texturas, binários, etc.)
    const sourceDir = path.dirname(sourceGltf);
    const files = fs.readdirSync(sourceDir);
    
    files.forEach(file => {
      if (file.toLowerCase() !== path.basename(sourceGltf).toLowerCase()) {
        const sourceFile = path.join(sourceDir, file);
        const destFile = path.join(destPath, file);
        
        // Verifica se é um arquivo (não uma pasta)
        if (fs.statSync(sourceFile).isFile()) {
          fs.copyFileSync(sourceFile, destFile);
          console.log(`Copiado: ${sourceFile} -> ${destFile}`);
        }
      }
    });
    
  } catch (error) {
    console.error(`Erro ao processar arquivos GLTF em ${sourcePath}:`, error);
  }
}

// Executa o processamento
console.log('Iniciando extração de modelos...');
processZipFiles();
console.log('Extração de modelos concluída!');