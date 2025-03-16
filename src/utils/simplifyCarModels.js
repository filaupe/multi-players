/**
 * Script para simplificar a estrutura dos modelos de carros
 * 
 * Este script copia os arquivos FBX das pastas FINAL_MODEL para uma estrutura mais simples
 * na pasta public/models/cars, facilitando o acesso aos modelos.
 * 
 * Instruções:
 * 1. Execute o script: node src/utils/simplifyCarModels.js
 */

const fs = require('fs-extra');
const path = require('path');

// Diretórios de origem e destino
const sourceDir = path.resolve(__dirname, '../../src/assets/models/cars');
const targetDir = path.resolve(__dirname, '../../public/models/cars');

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

// Função para copiar texturas
async function copyTextures(sourceCarDir, targetCarDir) {
  try {
    const texturesDir = path.join(sourceCarDir, 'textures');
    
    if (fs.existsSync(texturesDir)) {
      const textureFiles = fs.readdirSync(texturesDir);
      
      for (const textureFile of textureFiles) {
        const sourcePath = path.join(texturesDir, textureFile);
        const targetPath = path.join(targetCarDir, textureFile);
        
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Copiada textura: ${sourcePath} -> ${targetPath}`);
        }
      }
    }
    
    // Também copia texturas da pasta source/FINAL_MODEL*
    const sourceDir = path.join(sourceCarDir, 'source');
    if (fs.existsSync(sourceDir)) {
      const sourceDirs = fs.readdirSync(sourceDir);
      
      for (const dir of sourceDirs) {
        if (dir.includes('FINAL_MODEL')) {
          const finalModelDir = path.join(sourceDir, dir);
          const files = fs.readdirSync(finalModelDir);
          
          for (const file of files) {
            if (file.endsWith('.png') || file.endsWith('.jpg')) {
              const sourcePath = path.join(finalModelDir, file);
              const targetPath = path.join(targetCarDir, file);
              
              fs.copyFileSync(sourcePath, targetPath);
              console.log(`Copiada textura: ${sourcePath} -> ${targetPath}`);
            }
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao copiar texturas de ${sourceCarDir}:`, error);
    return false;
  }
}

// Função principal
async function simplifyModels() {
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
      
      // Cria o diretório de destino se não existir
      if (!fs.existsSync(targetCarDir)) {
        fs.mkdirSync(targetCarDir, { recursive: true });
      }
      
      // Encontra todos os arquivos FBX no diretório do carro
      const fbxFiles = findFbxFiles(carDir);
      
      if (fbxFiles.length > 0) {
        // Copia o primeiro arquivo FBX encontrado para o diretório de destino
        const fbxFile = fbxFiles[0];
        const targetFbxPath = path.join(targetCarDir, 'model.fbx');
        
        fs.copyFileSync(fbxFile, targetFbxPath);
        console.log(`Copiado modelo: ${fbxFile} -> ${targetFbxPath}`);
        
        // Copia as texturas
        await copyTextures(carDir, targetCarDir);
        
        // Copia ou cria thumbnail
        const thumbnailSource = path.join(carDir, 'textures', 'thumbnail.png');
        const thumbnailTarget = path.join(targetCarDir, 'thumbnail.png');
        
        if (fs.existsSync(thumbnailSource)) {
          fs.copyFileSync(thumbnailSource, thumbnailTarget);
          console.log(`Copiado thumbnail: ${thumbnailSource} -> ${thumbnailTarget}`);
        } else {
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
              fs.copyFileSync(thumbnailSource, thumbnailTarget);
              console.log(`Criado thumbnail: ${thumbnailSource} -> ${thumbnailTarget}`);
            }
          }
        }
      } else {
        console.log(`Nenhum arquivo FBX encontrado em ${carDir}`);
      }
    }
    
    console.log('Simplificação concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a simplificação:', error);
  }
}

// Executa a função principal
simplifyModels();