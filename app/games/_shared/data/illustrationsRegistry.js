/**
 * Registro centralizado y extensible de colecciones de ilustraciones vectoriales.
 * Permite registrar nuevas categorías de SVGs (ej. animales, frutas, comida, vehículos...)
 * sin necesidad de modificar el código de los juegos ni duplicar lógica en componentes.
 */

import { ANIMALS_LIST, getRandomAnimal } from './animals'
import { FRUITS_LIST, getRandomFruit } from './fruits'
import { FOOD_LIST, getRandomFood } from './food'

export const ILLUSTRATION_CATEGORIES = {
  animals: {
    id: 'animals',
    label: 'Animales',
    description: 'Animales ilustrados aleatorios',
    iconSrc: '/animals/lion.svg',
    fallbackEmoji: '🦁',
    hintNoun: 'el animal',
    items: ANIMALS_LIST,
    getRandom: getRandomAnimal,
  },
  fruits: {
    id: 'fruits',
    label: 'Frutas',
    description: 'Frutas ilustradas aleatorias',
    iconSrc: '/fruits/strawberry.svg',
    fallbackEmoji: '🍓',
    hintNoun: 'la fruta',
    items: FRUITS_LIST,
    getRandom: getRandomFruit,
  },
  food: {
    id: 'food',
    label: 'Comida',
    description: 'Alimentos y comida ilustrada aleatoria',
    iconSrc: '/food/pizza.svg',
    fallbackEmoji: '🍕',
    hintNoun: 'la comida',
    items: FOOD_LIST,
    getRandom: getRandomFood,
  },
}

/**
 * Comprueba si un tipo de estímulo corresponde a una categoría de ilustración registrada.
 */
export function isIllustrationCategory(type) {
  return Boolean(type && ILLUSTRATION_CATEGORIES[type])
}

/**
 * Obtiene los metadatos de una categoría de ilustración.
 */
export function getIllustrationCategory(type) {
  return ILLUSTRATION_CATEGORIES[type] || null
}

/**
 * Obtiene un elemento aleatorio para cualquier categoría registrada.
 */
export function getRandomIllustrationByCategory(type, prevItem = null) {
  const cat = ILLUSTRATION_CATEGORIES[type]
  if (!cat) return null
  return cat.getRandom(prevItem, cat.items)
}

/**
 * Devuelve la instrucción de ayuda dinámica para cualquier categoría en cada juego.
 */
export function getIllustrationHint(gameKey, type) {
  const cat = ILLUSTRATION_CATEGORIES[type]
  if (!cat) return null

  switch (gameKey) {
    case 'fixation':
      return `Mantén la mirada fija en el centro y nombra ${cat.hintNoun} en voz alta cada vez que cambie.`
    case 'eye-tracking':
      return `Sigue ${cat.hintNoun} con la mirada sin mover la cabeza y nómbralo en voz alta cada vez que cambie.`
    case 'sacades':
      return `Mueve los ojos con precisión sin mover la cabeza cada vez que ${cat.hintNoun} cambie de posición y nómbralo en voz alta.`
    default:
      return null
  }
}
