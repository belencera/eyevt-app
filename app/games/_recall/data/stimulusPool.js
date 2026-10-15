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

const randomInt = (max) => Math.floor(Math.random() * max)
const pickRandom = (list) => list[randomInt(list.length)]

/** Longitudes usadas cuando se elige "Aleatorio": una sola por ronda para que las opciones se parezcan */
const NUMBER_LENGTHS = [2, 3, 4, 5]
const WORD_LENGTHS = [3, 4, 5, 6]
const LEADING_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Cifras de los números de la ronda: con 'Aleatorio' se elige una sola longitud para todas las opciones */
function resolveNumberLength(digits) {
  return digits === 'all' ? pickRandom(NUMBER_LENGTHS) : digits
}

/**
 * Genera `count` números de `length` cifras repartidos en `groups` grupos:
 * todos los números de un grupo empiezan por la misma cifra (ej: 345, 312, 389…).
 *
 * Se devuelven intercalados por grupo (g1, g2, g3, g1, g2, g3…), así los primeros
 * elementos son uno de cada grupo y cada objetivo tiene distractores que empiezan igual.
 */
function getGroupedNumbers(length, count, groups) {
  const leads = shuffle(LEADING_DIGITS).slice(0, groups)
  const found = new Set()
  const result = []

  for (let i = 0; i < count; i++) {
    const lead = leads[i % groups]
    let number
    let attempts = 0
    do {
      const rest = Array.from({ length: length - 1 }, () => randomInt(10)).join('')
      number = lead + rest
      attempts++
    } while (found.has(number) && attempts < 50)

    if (!found.has(number)) {
      found.add(number)
      result.push(number)
    }
  }
  return result
}

/**
 * Parecido entre dos palabras: comparten inicio (lo que más pesa), terminan igual
 * y cuántas letras tienen en común.
 */
function getWordSimilarity(a, b) {
  let prefix = 0
  while (prefix < a.length && a[prefix] === b[prefix]) prefix++
  const sameEnd = a[a.length - 1] === b[b.length - 1] ? 1 : 0
  const sharedLetters = [...new Set(a)].filter((ch) => b.includes(ch)).length
  return prefix * 3 + sameEnd * 2 + sharedLetters
}

/**
 * Elige una palabra de referencia y las `count - 1` más parecidas a ella de la misma longitud.
 */
function getSimilarWords(wordLength, count) {
  const length = WORD_BANKS[wordLength] ? wordLength : pickRandom(WORD_LENGTHS)
  const bank = WORD_BANKS[length]
  const anchor = pickRandom(bank)

  // Barajar antes de ordenar desempata al azar entre palabras igual de parecidas
  return shuffle(bank)
    .map((word) => ({ word, score: word === anchor ? Infinity : getWordSimilarity(anchor, word) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, count)
    .map((entry) => entry.word)
}

/**
 * Devuelve los elementos disponibles para una ronda, normalizados.
 * - Palabras: grupo nuevo de palabras parecidas entre sí en cada ronda.
 * - Números de 1 cifra: 0-9. Con más cifras, `buildRecallRound` los agrupa por primera cifra
 *   según los objetivos; aquí se devuelve un solo grupo que empieza por la misma cifra.
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
  if (type === 'words') return toItems(getSimilarWords(wordLength, MAX_OPTIONS))
  if (type === 'numbers') {
    const length = resolveNumberLength(numberDigits)
    if (length === 1) return toItems(Array.from({ length: 10 }, (_, i) => String(i)))
    return toItems(getGroupedNumbers(length, MAX_OPTIONS, 1))
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
 * Elige los objetivos entre las opciones de la ronda.
 *
 * `candidates` son las opciones en orden de preferencia para ser objetivo
 * (en números, intercaladas por grupo para que haya un objetivo de cada grupo).
 *
 * - Sin repetición mientras queden al menos MIN_DISTRACTORS opciones que no son objetivo.
 * - Con más estímulos que eso, los objetivos se sortean con reemplazo (pueden repetirse),
 *   así cualquier categoría puede subir de nivel sin límite.
 * - En categorías de una fila (pbqd, flechas) todas las opciones pueden ser objetivo
 *   y los objetivos pueden repetirse desde el primer nivel.
 */
function assembleRound(candidates, count) {
  const optionsCount = candidates.length
  const isSingleRow = optionsCount <= SINGLE_ROW_MAX
  const targetPoolSize = isSingleRow ? optionsCount : optionsCount - MIN_DISTRACTORS
  const allowRepeats = isSingleRow || count > targetPoolSize

  const targetPool = candidates.slice(0, targetPoolSize)
  let targets
  if (isSingleRow) {
    // pbqd y flechas: sorteo libre con repetición desde el primer nivel
    targets = Array.from({ length: count }, () => pickRandom(targetPool))
  } else if (allowRepeats) {
    // Primero un objetivo por candidato (cubre todos los grupos de números) y el resto se repite al azar
    const extras = Array.from({ length: count - targetPool.length }, () => pickRandom(targetPool))
    targets = shuffle([...targetPool, ...extras])
  } else {
    targets = shuffle(candidates.slice(0, count))
  }

  return {
    options: shuffle(candidates),
    targets,
    columns: getGridColumns(optionsCount),
    allowRepeats,
  }
}

/**
 * Ronda de números de varias cifras: un grupo por objetivo (hasta la mitad de las opciones)
 * y todas las opciones de un grupo empiezan por la misma cifra que su objetivo.
 * Ej: objetivos 345 y 678 → opciones 345, 312, 389… y 678, 641, 607…
 */
function buildNumberRound(count, length) {
  const optionsCount = getOptionsCount(count, MAX_OPTIONS)
  const groups = Math.max(1, Math.min(count, Math.floor(optionsCount / 2)))
  return assembleRound(toItems(getGroupedNumbers(length, optionsCount, groups)), count)
}

/**
 * Construye una ronda: opciones de la cuadrícula y objetivos a recordar.
 *
 * @param {{ type: string, count: number, settings?: object }} params
 * @returns {{ options: Array, targets: Array, columns: number, allowRepeats: boolean }}
 */
export function buildRecallRound({ type, count, settings = {} }) {
  if (type === 'numbers') {
    const length = resolveNumberLength(settings.numberDigits ?? 1)
    if (length > 1) return buildNumberRound(count, length)
  }

  const items = getCategoryItems(type, settings)
  const optionsCount = getOptionsCount(count, items.length)
  // Las palabras ya vienen ordenadas de más a menos parecidas: se toman las primeras
  const pool = type === 'words' ? items : shuffle(items)
  return assembleRound(shuffle(pool.slice(0, optionsCount)), count)
}
