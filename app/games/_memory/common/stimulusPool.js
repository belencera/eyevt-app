/**
 * Elementos de estímulo para los juegos de memoria, de cualquier categoría.
 * Reutiliza los catálogos de estímulos de `_shared`.
 *
 * Cada elemento se normaliza como { key, value }:
 * - key: identificador único dentro de la categoría (para comparar respuestas o parejas)
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
import { MAX_OPTIONS } from './constants'

export const toItems = (list, getKey = (v) => v) => list.map((value) => ({ key: getKey(value), value }))

const randomInt = (max) => Math.floor(Math.random() * max)
export const pickRandom = (list) => list[randomInt(list.length)]

/** Longitudes usadas cuando se elige "Aleatorio": una sola por ronda para que las opciones se parezcan */
const NUMBER_LENGTHS = [2, 3, 4, 5]
const WORD_LENGTHS = [3, 4, 5, 6]
const LEADING_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Cifras de los números de la ronda: con 'Aleatorio' se elige una sola longitud para todas las opciones */
export function resolveNumberLength(digits) {
  return digits === 'all' ? pickRandom(NUMBER_LENGTHS) : digits
}

/**
 * Genera `count` números de `length` cifras repartidos en `groups` grupos:
 * todos los números de un grupo empiezan por la misma cifra (ej: 345, 312, 389…).
 *
 * Se devuelven intercalados por grupo (g1, g2, g3, g1, g2, g3…), así los primeros
 * elementos son uno de cada grupo y cada objetivo tiene distractores que empiezan igual.
 */
export function getGroupedNumbers(length, count, groups) {
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
 * - Números de 1 cifra: 0-9. Con más cifras se devuelve un solo grupo que empieza por la misma cifra
 *   (`buildRecallRound` los agrupa además por objetivo).
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
