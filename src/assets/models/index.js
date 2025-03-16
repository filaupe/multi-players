/**
 * Arquivo de índice para importação de modelos 3D
 * 
 * Este arquivo facilita a importação de modelos 3D no jogo.
 * Adicione suas importações de modelos aqui e exporte-as para uso em todo o jogo.
 */

// Importações de modelos de carros
import './cars';

/**
 * Classe para gerenciar modelos 3D no jogo
 */
export class ModelManager {
  constructor() {
    this.models = {};
    this.loaded = {};
  }

  /**
   * Registra um modelo para uso posterior
   * @param {string} id - Identificador único para o modelo
   * @param {string|Object} model - Caminho ou objeto do modelo 3D
   */
  registerModel(id, model) {
    this.models[id] = model;
  }

  /**
   * Obtém um modelo pelo seu ID
   * @param {string} id - Identificador do modelo
   * @returns {Object} O modelo 3D ou null se não encontrado
   */
  getModel(id) {
    return this.models[id] || null;
  }

  /**
   * Marca um modelo como carregado
   * @param {string} id - Identificador do modelo
   * @param {Object} loadedModel - O modelo 3D carregado
   */
  setLoaded(id, loadedModel) {
    this.loaded[id] = loadedModel;
  }

  /**
   * Verifica se um modelo já foi carregado
   * @param {string} id - Identificador do modelo
   * @returns {boolean} Verdadeiro se o modelo já foi carregado
   */
  isLoaded(id) {
    return !!this.loaded[id];
  }

  /**
   * Obtém um modelo carregado pelo seu ID
   * @param {string} id - Identificador do modelo
   * @returns {Object} O modelo 3D carregado ou null se não encontrado
   */
  getLoadedModel(id) {
    return this.loaded[id] || null;
  }
}

// Exporta uma instância única do gerenciador de modelos
export const modelManager = new ModelManager();