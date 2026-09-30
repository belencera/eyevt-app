/**
 * Configuración y catálogo modular de frutas para terapia visual.
 * 12 ilustraciones vectoriales en formato SVG alojadas en /fruits/.
 */

import {
  ILLUSTRATION_SIZE_OPTIONS,
  ILLUSTRATION_INTERVAL_OPTIONS,
  getRandomIllustration,
} from './illustrations'

export const FRUIT_SIZE_OPTIONS = ILLUSTRATION_SIZE_OPTIONS
export const FRUIT_INTERVAL_OPTIONS = ILLUSTRATION_INTERVAL_OPTIONS

export const FRUITS_LIST = [
  { id: 'uvas', name: 'Uvas', src: '/fruits/1F347.svg' },
  { id: 'sandia', name: 'Sandía', src: '/fruits/1F349.svg' },
  { id: 'naranja', name: 'Naranja', src: '/fruits/1F34A.svg' },
  { id: 'limon', name: 'Limón', src: '/fruits/1F34B.svg' },
  { id: 'platano', name: 'Plátano', src: '/fruits/1F34C.svg' },
  { id: 'manzana', name: 'Manzana', src: '/fruits/1F34E.svg' },
  { id: 'pera', name: 'Pera', src: '/fruits/1F350.svg' },
  { id: 'cerezas', name: 'Cerezas', src: '/fruits/1F352.svg' },
  { id: 'fresa', name: 'Fresa', src: '/fruits/1F353.svg' },
  { id: 'aguacate', name: 'Aguacate', src: '/fruits/1F951.svg' },
  { id: 'kiwi', name: 'Kiwi', src: '/fruits/1F95D.svg' },
  { id: 'coco', name: 'Coco', src: '/fruits/1F965.svg' },
]

/**
 * Devuelve una fruta aleatoria del catálogo evitando repetir inmediatamente la anterior.
 */
export function getRandomFruit(prevFruit = null, list = FRUITS_LIST) {
  return getRandomIllustration(prevFruit, list)
}
