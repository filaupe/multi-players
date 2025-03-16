/**
 * Definição dos carros disponíveis no jogo
 * 
 * Este arquivo contém a lista de carros disponíveis para seleção
 * com suas respectivas cores.
 */

// Lista de carros disponíveis para seleção
export const availableCars = [
  {
    id: 'yellow-car',
    name: 'Carro Amarelo',
    color: '#FFD700', // Amarelo
    description: 'Um carro esportivo amarelo brilhante'
  },
  {
    id: 'red-car',
    name: 'Carro Vermelho',
    color: '#FF0000', // Vermelho
    description: 'Um carro esportivo vermelho vibrante'
  },
  {
    id: 'green-car',
    name: 'Carro Verde',
    color: '#00FF00', // Verde
    description: 'Um carro esportivo verde elegante'
  },
  {
    id: 'blue-car',
    name: 'Carro Azul',
    color: '#0000FF', // Azul
    description: 'Um carro esportivo azul metálico'
  },
  {
    id: 'pink-car',
    name: 'Carro Rosa',
    color: '#FF69B4', // Rosa
    description: 'Um carro esportivo rosa chamativo'
  }
];

/**
 * Obtém um carro pelo seu ID
 * @param {string} id - ID do carro
 * @returns {Object|null} - Objeto do carro ou null se não encontrado
 */
export function getCarById(id) {
  return availableCars.find(car => car.id === id) || null;
}

/**
 * Obtém um carro aleatório da lista de carros disponíveis
 * @returns {Object} - Um carro aleatório
 */
export function getRandomCar() {
  const randomIndex = Math.floor(Math.random() * availableCars.length);
  return availableCars[randomIndex];
}

/**
 * Verifica se um ID de carro é válido
 * @param {string} id - ID do carro a verificar
 * @returns {boolean} - Verdadeiro se o ID for válido
 */
export function isValidCarId(id) {
  return availableCars.some(car => car.id === id);
}