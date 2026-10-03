/**
 * Configuración y catálogo modular de alimentos para terapia visual.
 * 12 ilustraciones vectoriales en formato SVG alojadas en /food/.
 */

import {
  ILLUSTRATION_SIZE_OPTIONS,
  ILLUSTRATION_INTERVAL_OPTIONS,
  getRandomIllustration,
} from './illustrations'

export const FOOD_SIZE_OPTIONS = ILLUSTRATION_SIZE_OPTIONS
export const FOOD_INTERVAL_OPTIONS = ILLUSTRATION_INTERVAL_OPTIONS

export const FOOD_LIST = [
  { id: 'bacon', name: 'Bacon', src: '/food/bacon.svg' },
  { id: 'cheese-wedge', name: 'Queso', src: '/food/cheese-wedge.svg' },
  { id: 'cookie', name: 'Galleta', src: '/food/cookie.svg' },
  { id: 'doughnut', name: 'Donut', src: '/food/doughnut.svg' },
  { id: 'french-fries', name: 'Patatas fritas', src: '/food/french-fries.svg' },
  { id: 'green-salad', name: 'Ensalada', src: '/food/green-salad.svg' },
  { id: 'hamburger', name: 'Hamburguesa', src: '/food/hamburger.svg' },
  { id: 'hot-dog', name: 'Perrito caliente', src: '/food/hot-dog.svg' },
  { id: 'pizza', name: 'Pizza', src: '/food/pizza.svg' },
  { id: 'popcorn', name: 'Palomitas', src: '/food/popcorn.svg' },
  { id: 'spaghetti', name: 'Espaguetis', src: '/food/spaghetti.svg' },
  { id: 'sushi', name: 'Sushi', src: '/food/sushi.svg' },
]

/**
 * Devuelve un alimento aleatorio del catálogo evitando repetir inmediatamente el anterior.
 */
export function getRandomFood(prevFood = null, list = FOOD_LIST) {
  return getRandomIllustration(prevFood, list)
}
