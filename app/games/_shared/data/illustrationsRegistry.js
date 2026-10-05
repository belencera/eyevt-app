/**
 * Registro centralizado y extensible de colecciones de ilustraciones vectoriales.
 * Permite registrar nuevas categorías de SVGs (ej. animales, frutas, comida, vehículos...)
 * sin necesidad de modificar el código de los juegos ni duplicar lógica en componentes.
 *
 * También centraliza las instrucciones de ayuda (hints) para todos los tipos de estímulo
 * en cada juego, eliminando la necesidad de definir mapas HINTS locales en cada página.
 */

import { ANIMALS_LIST } from './animals'
import { FRUITS_LIST } from './fruits'
import { FOOD_LIST } from './food'

/**
 * Devuelve un elemento aleatorio de una lista de ilustraciones
 * evitando repetir consecutivamente el elemento inmediatamente anterior.
 *
 * @param {{ id: string, name: string } | null} prevItem - Elemento anterior
 * @param {Array<{ id: string, name: string, src: string }>} list - Catálogo de ilustraciones
 * @returns {{ id: string, name: string, src: string } | null}
 */
export function getRandomIllustration(prevItem = null, list = []) {
  if (!list || list.length === 0) return null
  const pool =
    prevItem && list.length > 1
      ? list.filter((item) => (item.id || item.name) !== (prevItem.id || prevItem.name))
      : list
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}

export const ILLUSTRATION_CATEGORIES = {
  animals: {
    id: 'animals',
    label: 'Animales',
    description: 'Animales ilustrados aleatorios',
    iconSrc: '/animals/lion.svg',
    fallbackEmoji: '🦁',
    hintNoun: 'el animal',
    items: ANIMALS_LIST,
  },
  fruits: {
    id: 'fruits',
    label: 'Frutas',
    description: 'Frutas ilustradas aleatorias',
    iconSrc: '/fruits/strawberry.svg',
    fallbackEmoji: '🍓',
    hintNoun: 'la fruta',
    items: FRUITS_LIST,
  },
  food: {
    id: 'food',
    label: 'Comida',
    description: 'Alimentos y comida ilustrada aleatoria',
    iconSrc: '/food/pizza.svg',
    fallbackEmoji: '🍕',
    hintNoun: 'la comida',
    items: FOOD_LIST,
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
  return getRandomIllustration(prevItem, cat.items)
}

/* ── Hints centralizados para todos los tipos de estímulo en cada juego ── */

const GAME_HINTS = {
  fixation: {
    classic: 'Mantén la mirada fija en el punto central sin mover los ojos ni la cabeza.',
    colors: 'Mantén la mirada fija en el centro y di el color en voz alta cada vez que cambie.',
    letters: 'Mantén la mirada fija en el centro y nombra la letra en voz alta cada vez que cambie.',
    words: 'Mantén la mirada fija en el centro y lee la palabra en voz alta cada vez que cambie.',
    numbers: 'Mantén la mirada fija en el centro y di el número en voz alta cada vez que cambie.',
    arrows: 'Mantén la mirada fija en el centro e indica la dirección de la flecha en voz alta cada vez que cambie.',
  },
  'eye-tracking': {
    classic: 'Sigue el punto con la mirada sin mover la cabeza.',
    colors: 'Sigue el punto con los ojos sin mover la cabeza y di el color activo en voz alta cada vez que cambie.',
    letters: 'Sigue la letra con la mirada sin mover la cabeza y nómbrala en voz alta cada vez que cambie.',
    words: 'Sigue la palabra con la vista sin mover la cabeza y léela en voz alta cada vez que cambie.',
    numbers: 'Sigue el número con la mirada sin mover la cabeza y dilo en voz alta cada vez que cambie.',
    arrows: 'Sigue la flecha con los ojos sin mover la cabeza e indica su dirección en voz alta cada vez que cambie.',
  },
  sacades: {
    classic: 'Mueve los ojos con precisión entre los diferentes puntos sin mover la cabeza.',
    colors: 'Mueve los ojos con precisión sin mover la cabeza cada vez que el color cambie de posición y di el color en voz alta.',
    letters: 'Mueve los ojos con precisión sin mover la cabeza cada vez que la letra cambie de posición y léela en voz alta.',
    words: 'Mueve los ojos con precisión sin mover la cabeza cada vez que la palabra cambie de posición y léela en voz alta.',
    numbers: 'Mueve los ojos con precisión sin mover la cabeza cada vez que el número cambie de posición y dilo en voz alta.',
    arrows: 'Mueve los ojos con precisión sin mover la cabeza cada vez que la flecha cambie de posición e indica su dirección en voz alta.',
  },
}

/**
 * Devuelve la instrucción de ayuda para cualquier combinación de juego y tipo de estímulo.
 * Para categorías de ilustración registradas, genera el hint dinámicamente usando el nombre de la categoría.
 * Para tipos estándar, devuelve el hint estático del mapa centralizado.
 *
 * @param {string} gameKey - Clave del juego ('fixation' | 'eye-tracking' | 'sacades')
 * @param {string} stimulusType - Tipo de estímulo activo
 * @returns {string | null}
 */
export function getGameHint(gameKey, stimulusType) {
  // Para categorías de ilustración, generar dinámicamente
  const cat = ILLUSTRATION_CATEGORIES[stimulusType]
  if (cat) {
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
  // Para tipos estándar, usar el mapa estático
  return GAME_HINTS[gameKey]?.[stimulusType] ?? null
}

// Alias retrocompatible — se puede eliminar en el futuro
export const getIllustrationHint = getGameHint
