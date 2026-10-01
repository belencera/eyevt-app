/**
 * Configuración y catálogo modular de frutas para terapia visual.
 * 11 ilustraciones vectoriales en formato SVG alojadas en /fruits/.
 */

import {
  ILLUSTRATION_SIZE_OPTIONS,
  ILLUSTRATION_INTERVAL_OPTIONS,
  getRandomIllustration,
} from './illustrations'

export const FRUIT_SIZE_OPTIONS = ILLUSTRATION_SIZE_OPTIONS
export const FRUIT_INTERVAL_OPTIONS = ILLUSTRATION_INTERVAL_OPTIONS

export const FRUITS_LIST = [
  { id: 'banana', name: 'Plátano', src: '/fruits/banana.svg' },
  { id: 'cherries', name: 'Cerezas', src: '/fruits/cherries.svg' },
  { id: 'grapes', name: 'Uvas', src: '/fruits/grapes.svg' },
  { id: 'kiwi-fruit', name: 'Kiwi', src: '/fruits/kiwi-fruit.svg' },
  { id: 'lemon', name: 'Limón', src: '/fruits/lemon.svg' },
  { id: 'pear', name: 'Pera', src: '/fruits/pear.svg' },
  { id: 'pineapple', name: 'Piña', src: '/fruits/pineapple.svg' },
  { id: 'red-apple', name: 'Manzana', src: '/fruits/red-apple.svg' },
  { id: 'strawberry', name: 'Fresa', src: '/fruits/strawberry.svg' },
  { id: 'tangerine', name: 'Mandarina', src: '/fruits/tangerine.svg' },
  { id: 'watermelon', name: 'Sandía', src: '/fruits/watermelon.svg' },
]

/**
 * Devuelve una fruta aleatoria del catálogo evitando repetir inmediatamente la anterior.
 */
export function getRandomFruit(prevFruit = null, list = FRUITS_LIST) {
  return getRandomIllustration(prevFruit, list)
}
