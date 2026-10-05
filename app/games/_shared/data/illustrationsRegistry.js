/**
 * Registro centralizado y extensible de colecciones de ilustraciones vectoriales.
 * Permite registrar nuevas categorías de SVGs (animales, frutas, comida, emojis, vehículos, objetos, naturaleza, banderas...)
 * sin necesidad de modificar el código de los juegos ni duplicar lógica en componentes.
 */

import { ANIMALS_LIST } from './animals'
import { FRUITS_LIST } from './fruits'
import { FOOD_LIST } from './food'
import { EMOJIS_LIST } from './emojis'
import { VEHICLES_LIST } from './vehicles'
import { OBJECTS_LIST } from './objects'
import { NATURE_LIST } from './nature'
import { FLAGS_LIST } from './flags'

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
    items: ANIMALS_LIST,
  },
  fruits: {
    id: 'fruits',
    label: 'Frutas',
    description: 'Frutas ilustradas aleatorias',
    iconSrc: '/fruits/strawberry.svg',
    fallbackEmoji: '🍓',
    items: FRUITS_LIST,
  },
  food: {
    id: 'food',
    label: 'Comida',
    description: 'Alimentos y comida ilustrada aleatoria',
    iconSrc: '/food/pizza.svg',
    fallbackEmoji: '🍕',
    items: FOOD_LIST,
  },
  emojis: {
    id: 'emojis',
    label: 'Emojis',
    description: 'Caras de emoji ilustradas aleatorias',
    iconSrc: '/faces/emojione--smiling-face-with-smiling-eyes.svg',
    fallbackEmoji: '😊',
    items: EMOJIS_LIST,
  },
  vehicles: {
    id: 'vehicles',
    label: 'Vehículos',
    description: 'Vehículos y medios de transporte ilustrados aleatorios',
    iconSrc: '/vehicles/emojione--automobile.svg',
    fallbackEmoji: '🚗',
    items: VEHICLES_LIST,
  },
  objects: {
    id: 'objects',
    label: 'Objetos',
    description: 'Objetos cotidianos ilustrados aleatorios',
    iconSrc: '/objects/emojione--light-bulb.svg',
    fallbackEmoji: '💡',
    items: OBJECTS_LIST,
  },
  nature: {
    id: 'nature',
    label: 'Naturaleza',
    description: 'Elementos de la naturaleza ilustrados aleatorios',
    iconSrc: '/nature/emojione--deciduous-tree.svg',
    fallbackEmoji: '🌳',
    items: NATURE_LIST,
  },
  flags: {
    id: 'flags',
    label: 'Banderas',
    description: 'Banderas de países ilustradas aleatorias',
    iconSrc: '/flags/emojione--flag-for-european-union.svg',
    fallbackEmoji: '🚩',
    items: FLAGS_LIST,
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
