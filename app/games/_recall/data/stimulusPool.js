/**
 * Generación de rondas para los juegos de memoria y percepción.
 * Reutiliza los catálogos de estímulos de `_shared` para cualquier categoría.
 *
 * Cada elemento se normaliza como { key, value }:
 * - key: identificador único dentro de la categoría (para comparar respuestas)
 * - value: el dato que entiende `StimulusItem` para pintarlo
 */

import {
  BASIC_COLORS,
  UPPERCASE_ALPHABET,
  PBQD_LETTERS,
  ARROW_DIRECTIONS,
  WORD_BANKS,
  getRandomNumber,
  getIllustrationCategory,
} from '../../_shared/data/constants'
import { shuffle } from '../../_shared/utils/shuffle'
import {
  GRID_SIZE_STEPS,
  MAX_OPTIONS,
  MIN_DISTRACTORS,
  SINGLE_ROW_MAX,
} from './recallConstants'

const toItems = (list, getKey = (v) => v) => list.map((value) => ({ key: getKey(value), value }))

/**
 * Genera `count` números distintos con la cantidad de cifras indicada.
 * Con 1 cifra solo existen 10 (0-9), así que el catálogo queda en 10.
 */
function getUniqueNumbers(digits, count) {
  if (digits === 1) {
    return Array.from({ length: 10 }, (_, i) => String(i))
  }
  const found = new Set()
  let attempts = 0
  while (found.size < count && attempts < count * 20) {
    found.add(getRandomNumber(digits))
    attempts++
  }
  return [...found]
}

/**
 * Devuelve el catálogo normalizado de una categoría.
 *
 * @param {string} type - Categoría ('colors', 'letters', 'animals'...)
 * @param {{ wordLength?: number|'all', numberDigits?: number|'all' }} [settings]
 * @returns {Array<{ key: string, value: any }>}
 */
export function getCategoryItems(type, { wordLength = 4, numberDigits = 1 } = {}) {
  if (type === 'colors') return toItems(BASIC_COLORS, (c) => c.name)
  if (type === 'letters') return toItems(UPPERCASE_ALPHABET)
  if (type === 'pbqd') return toItems(PBQD_LETTERS)
  if (type === 'arrows') return toItems(ARROW_DIRECTIONS, (a) => a.id)

  if (type === 'words') {
    const bank = WORD_BANKS[wordLength] ?? Object.values(WORD_BANKS).flat()
    return toItems(bank)
  }

  if (type === 'numbers') {
    return toItems(getUniqueNumbers(numberDigits, MAX_OPTIONS))
  }

  const illustration = getIllustrationCategory(type)
  if (illustration) return toItems(illustration.items, (item) => item.id)

  return []
}

/**
 * Número de opciones de la cuadrícula para un nivel, limitado al tamaño de la categoría.
 * Se mantiene par para que las 2 filas sean simétricas (salvo categorías de una sola fila).
 */
export function getOptionsCount(level, categorySize) {
  const step = [...GRID_SIZE_STEPS].reverse().find((s) => level >= s.minLevel) ?? GRID_SIZE_STEPS[0]
  if (categorySize <= SINGLE_ROW_MAX) return categorySize
  const available = categorySize - (categorySize % 2)
  return Math.min(step.options, available)
}

/**
 * Columnas de la cuadrícula: 1 fila para categorías pequeñas, 2 filas en el resto.
 */
export function getGridColumns(optionsCount) {
  return optionsCount <= SINGLE_ROW_MAX ? optionsCount : optionsCount / 2
}

/**
 * Construye una ronda: opciones de la cuadrícula y objetivos a recordar.
 *
 * - Sin repetición mientras queden al menos MIN_DISTRACTORS opciones que no son objetivo.
 * - Con más estímulos que eso, los objetivos se sortean con reemplazo (pueden repetirse),
 *   así cualquier categoría puede subir de nivel sin límite.
 * - En categorías de una fila (pbqd, flechas) todas las opciones pueden ser objetivo
 *   y los objetivos pueden repetirse desde el primer nivel.
 *
 * @param {{ type: string, count: number, settings?: object }} params
 * @returns {{ options: Array, targets: Array, columns: number, allowRepeats: boolean }}
 */
export function buildRecallRound({ type, count, settings }) {
  const items = getCategoryItems(type, settings)
  const optionsCount = getOptionsCount(count, items.length)
  const options = shuffle(items).slice(0, optionsCount)

  const isSingleRow = optionsCount <= SINGLE_ROW_MAX
  const targetPoolSize = isSingleRow ? optionsCount : optionsCount - MIN_DISTRACTORS
  const allowRepeats = isSingleRow || count > targetPoolSize

  let targets
  if (allowRepeats) {
    const pool = shuffle(options).slice(0, targetPoolSize)
    targets = Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)])
  } else {
    targets = shuffle(options).slice(0, count)
  }

  return {
    options,
    targets,
    columns: getGridColumns(optionsCount),
    allowRepeats,
  }
}
