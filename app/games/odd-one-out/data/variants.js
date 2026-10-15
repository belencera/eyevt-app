/**
 * Estímulo "diferente" en las categorías de texto de Encuentra el diferente:
 * una variante casi igual al original que solo se distingue por un detalle.
 *
 * - pbqd: otra letra del grupo (espejo o invertida)
 * - Letras: una letra parecida (E → F)
 * - Palabras: una letra cambiada por otra parecida (CAMA → CANA)
 * - Números: una cifra cambiada por otra parecida (3481 → 3471)
 *
 * Las ilustraciones se resuelven aparte, quitando un detalle del dibujo (svgDetail.js).
 */

import { PBQD_LETTERS } from '../../_shared/data/constants'
import { pickRandom } from '../../_shared/utils/random'
import { SIMILAR_DIGITS, SIMILAR_LETTERS } from './constants'

export const TEXT_VARIANT_TYPES = ['pbqd', 'letters', 'words', 'numbers']

/** Posiciones de `text` cuyo carácter tiene parecidos en `table` */
function getChangeablePositions(text, table) {
  return [...text].map((ch, index) => index).filter((index) => table[text[index]])
}

/** Cambia un carácter de `text` (de una posición elegible) por uno parecido */
function replaceSimilarChar(text, table) {
  const positions = getChangeablePositions(text, table)
  if (positions.length === 0) return null

  const index = pickRandom(positions)
  // La primera cifra de un número de varias cifras nunca pasa a ser 0
  const choices = table[text[index]].filter((ch) => !(index === 0 && text.length > 1 && ch === '0'))
  if (choices.length === 0) return null

  return text.slice(0, index) + pickRandom(choices) + text.slice(index + 1)
}

/**
 * ¿Se puede crear una variante de este valor? (letras sin parecidos como A, J o S no sirven)
 */
export function canMakeVariant(type, value) {
  if (type === 'pbqd') return PBQD_LETTERS.includes(value)
  if (type === 'letters') return Boolean(SIMILAR_LETTERS[value])
  if (type === 'words') return getChangeablePositions(value, SIMILAR_LETTERS).length > 0
  if (type === 'numbers') return getChangeablePositions(value, SIMILAR_DIGITS).length > 0
  return false
}

/**
 * Devuelve la variante "diferente" de un valor de texto, o null si no se puede crear.
 *
 * @param {string} type - 'pbqd' | 'letters' | 'words' | 'numbers'
 * @param {string} value - Valor original (ej. 'b', 'E', 'CAMA', '3481')
 */
export function makeTextVariant(type, value) {
  if (!canMakeVariant(type, value)) return null

  if (type === 'pbqd') return pickRandom(PBQD_LETTERS.filter((letter) => letter !== value))
  if (type === 'letters') return pickRandom(SIMILAR_LETTERS[value])
  if (type === 'words') return replaceSimilarChar(value, SIMILAR_LETTERS)
  if (type === 'numbers') return replaceSimilarChar(value, SIMILAR_DIGITS)
  return null
}
