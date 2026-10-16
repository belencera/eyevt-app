/**
 * Elementos distintos de una categoría para las tarjetas de ¿Cuál se repite?
 * (solo con los catálogos de `_shared`).
 */

import {
  BASIC_COLORS,
  UPPERCASE_ALPHABET,
  WORD_BANKS,
  getIllustrationCategory,
  getPbqdCombinations,
  resolvePbqdLength,
} from '../../_shared/data/constants'
import { shuffle } from '../../_shared/utils/shuffle'
import { pickRandom } from '../../_shared/utils/random'

const WORD_LENGTHS = [3, 4, 5, 6]
const NUMBER_LENGTHS = [1, 2, 3, 4, 5]

const toItems = (list, getKey = (value) => value) => list.map((value) => ({ key: getKey(value), value }))

/** `count` números distintos de las cifras indicadas (de 1 cifra solo hay 10) */
function getDistinctNumbers(digits, count) {
  const length = NUMBER_LENGTHS.includes(digits) ? digits : pickRandom(NUMBER_LENGTHS)
  if (length === 1) return shuffle(Array.from({ length: 10 }, (_, i) => String(i))).slice(0, count)

  const min = 10 ** (length - 1)
  const range = 10 ** length - min
  const found = new Set()
  while (found.size < count) found.add(String(min + Math.floor(Math.random() * range)))
  return [...found]
}

/**
 * Hasta `count` elementos distintos y barajados de una categoría, como `{ key, value }`
 * (menos si la categoría no tiene tantos). Una misma longitud de palabra, cifras o letras pbqd
 * para todos, también con "Aleatorio".
 *
 * @param {string} type - Categoría ('animals', 'letters', 'pbqd', 'words'…)
 * @param {number} count
 * @param {{ wordLength?: number|'all', numberDigits?: number|'all', pbqdLength?: number|'all' }} [settings]
 */
export function getDistinctItems(type, count, { wordLength = 4, numberDigits = 1, pbqdLength = 1 } = {}) {
  if (type === 'colors') return toItems(shuffle(BASIC_COLORS).slice(0, count), (c) => c.name)
  if (type === 'letters') return toItems(shuffle(UPPERCASE_ALPHABET).slice(0, count))
  if (type === 'pbqd') {
    return toItems(shuffle(getPbqdCombinations(resolvePbqdLength(pbqdLength))).slice(0, count))
  }
  if (type === 'words') {
    const length = WORD_BANKS[wordLength] ? wordLength : pickRandom(WORD_LENGTHS)
    return toItems(shuffle(WORD_BANKS[length]).slice(0, count))
  }
  if (type === 'numbers') return toItems(getDistinctNumbers(numberDigits, count))

  const illustration = getIllustrationCategory(type)
  if (illustration) return toItems(shuffle(illustration.items).slice(0, count), (item) => item.id)

  return []
}
