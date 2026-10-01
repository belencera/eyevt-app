/**
 * Configuración y catálogo modular de animales para terapia visual.
 * 22 ilustraciones vectoriales SVG alojadas en /animals/.
 */

export const ANIMALS_LIST = [
  { id: 'baby-chick', name: 'Pollito', src: '/animals/baby-chick.svg' },
  { id: 'bird', name: 'Pájaro', src: '/animals/bird.svg' },
  { id: 'butterfly', name: 'Mariposa', src: '/animals/butterfly.svg' },
  { id: 'chicken', name: 'Gallina', src: '/animals/chicken.svg' },
  { id: 'chipmunk', name: 'Ardilla', src: '/animals/chipmunk.svg' },
  { id: 'cow', name: 'Vaca', src: '/animals/cow.svg' },
  { id: 'crab', name: 'Cangrejo', src: '/animals/crab.svg' },
  { id: 'crocodile', name: 'Cocodrilo', src: '/animals/crocodile.svg' },
  { id: 'elephant', name: 'Elefante', src: '/animals/elephant.svg' },
  { id: 'ewe', name: 'Oveja', src: '/animals/ewe.svg' },
  { id: 'koala', name: 'Koala', src: '/animals/koala.svg' },
  { id: 'lion', name: 'León', src: '/animals/lion.svg' },
  { id: 'lizard', name: 'Lagarto', src: '/animals/lizard.svg' },
  { id: 'monkey', name: 'Mono', src: '/animals/monkey.svg' },
  { id: 'mouse', name: 'Ratón', src: '/animals/mouse.svg' },
  { id: 'octopus', name: 'Pulpo', src: '/animals/octopus.svg' },
  { id: 'penguin', name: 'Pingüino', src: '/animals/penguin.svg' },
  { id: 'pig', name: 'Cerdito', src: '/animals/pig.svg' },
  { id: 'rabbit', name: 'Conejo', src: '/animals/rabbit.svg' },
  { id: 'shrimp', name: 'Gamba', src: '/animals/shrimp.svg' },
  { id: 'tropical-fish', name: 'Pez', src: '/animals/tropical-fish.svg' },
  { id: 'two-hump-camel', name: 'Camello', src: '/animals/two-hump-camel.svg' },
]

import {
  ILLUSTRATION_SIZE_OPTIONS,
  ILLUSTRATION_INTERVAL_OPTIONS,
  getRandomIllustration,
} from './illustrations'

export const ANIMAL_SIZE_OPTIONS = ILLUSTRATION_SIZE_OPTIONS
export const ANIMAL_INTERVAL_OPTIONS = ILLUSTRATION_INTERVAL_OPTIONS

/**
 * Devuelve un animal aleatorio del catálogo, evitando repetir inmediatamente el anterior.
 */
export function getRandomAnimal(prevAnimal = null, list = ANIMALS_LIST) {
  return getRandomIllustration(prevAnimal, list)
}
