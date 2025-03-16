/**
 * Script para processar os modelos FBX e convertê-los para GLTF
 * 
 * Este script processa os modelos FBX na pasta src/assets/models/cars
 * e os converte para GLTF na pasta public/models/cars.
 * 
 * Instruções:
 * 1. Instale as dependências: npm install fs-extra fbx2gltf
 * 2. Execute o script: node src/utils/processFbxModels.js
 */

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Diretórios de origem e destino
const sourceDir = path.resolve(__dirname, '../../src/assets/models/cars');
const targetDir = path.resolve(__dirname, '../../public/models/cars');

// Função para converter FBX para GLTF usando fbx2gltf
async function convertFbxToGltf(fbxPath, outputDir) {
  try {
    const fbxFileName = path.basename(fbxPath, '.fbx');
    const outputPath = path.join(outputDir, 'scene.gltf');
    
    // Certifique-se de que o diretório de saída existe
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Execute o comando fbx2gltf
    const command = `npx fbx2gltf "${fbxPath}" --output "${outputPath}" --binary`;
    await execPromise(command);
    
    console.log(`Convertido: ${fbxPath} -> ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Erro ao converter ${fbxPath}:`, error);
    return false;
  }
}

// Função para copiar texturas
async function copyTextures(sourceTexturesDir, targetDir) {
  try {
    if (fs.existsSync(sourceTexturesDir)) {
      const textureFiles = fs.readdirSync(sourceTexturesDir);
      
      for (const textureFile of textureFiles) {
        const sourcePath = path.join(sourceTexturesDir, textureFile);
        const targetPath = path.join(targetDir, textureFile);
        
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Copiada textura: ${sourcePath} -> ${targetPath}`);
        }
      }
    }
    return true;
  } catch (error) {
    console.error(`Erro ao copiar texturas de ${sourceTexturesDir}:`, error);
    return false;
  }
}

// Função para criar thumbnail
async function createThumbnail(carDir, targetDir) {
  try {
    // Procura por uma textura que possa ser usada como thumbnail
    const texturesDir = path.join(carDir, 'textures');
    if (fs.existsSync(texturesDir)) {
      const textureFiles = fs.readdirSync(texturesDir);
      const diffuseTextures = textureFiles.filter(file => 
        file.toLowerCase().includes('diffuse') && 
        (file.endsWith('.png') || file.endsWith('.jpg'))
      );
      
      if (diffuseTextures.length > 0) {
        // Usa a primeira textura diffuse como thumbnail
        const thumbnailSource = path.join(texturesDir, diffuseTextures[0]);
        const thumbnailTarget = path.join(targetDir, 'thumbnail.png');
        fs.copyFileSync(thumbnailSource, thumbnailTarget);
        console.log(`Criado thumbnail: ${thumbnailSource} -> ${thumbnailTarget}`);
        return true;
      }
    }
    
    // Se não encontrou uma textura adequada, cria um arquivo vazio
    const thumbnailPath = path.join(targetDir, 'thumbnail.png');
    fs.writeFileSync(thumbnailPath, '');
    console.log(`Criado arquivo de thumbnail vazio: ${thumbnailPath}`);
    return true;
  } catch (error) {
    console.error(`Erro ao criar thumbnail:`, error);
    return false;
  }
}

// Função para encontrar arquivos FBX recursivamente
function findFbxFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findFbxFiles(itemPath));
    } else if (item.toLowerCase().endsWith('.fbx')) {
      results.push(itemPath);
    }
  }
  
  return results;
}

// Função principal
async function processAllModels() {
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
    
    console.log(`Encontrados ${carDirs.length} diretórios de carros para processar.`);
    
    // Processa cada diretório de carro
    for (const carDir of carDirs) {
      const carName = path.basename(carDir).toLowerCase().replace(/\s+/g, '-');
      const targetCarDir = path.join(targetDir, carName);
      
      // Limpa o diretório de destino se existir
      if (fs.existsSync(targetCarDir)) {
        fs.removeSync(targetCarDir);
      }
      
      // Cria o diretório de destino
      fs.mkdirSync(targetCarDir, { recursive: true });
      
      // Encontra todos os arquivos FBX no diretório do carro
      const fbxFiles = findFbxFiles(carDir);
      
      if (fbxFiles.length > 0) {
        // Usa o primeiro arquivo FBX encontrado
        const fbxFile = fbxFiles[0];
        await convertFbxToGltf(fbxFile, targetCarDir);
        
        // Copia as texturas
        const texturesDir = path.join(carDir, 'textures');
        await copyTextures(texturesDir, targetCarDir);
        
        // Cria thumbnail
        await createThumbnail(carDir, targetCarDir);
      } else {
        console.log(`Nenhum arquivo FBX encontrado em ${carDir}`);
      }
    }
    
    console.log('Processamento concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o processamento:', error);
  }
}

// Executa a função principal
processAllModels();