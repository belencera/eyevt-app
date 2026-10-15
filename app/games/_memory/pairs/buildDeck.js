/**
 * Baraja y distribución del tablero de Memoria de parejas.
 */

import { shuffle } from '../../_shared/utils/shuffle'
import { getCategoryItems } from '../common/stimulusPool'
import { PAIRS_MAX_COLUMNS, PAIRS_MIN_ROWS, PAIRS_TWO_ROWS_MAX_CARDS } from './constants'

/**
 * Construye la baraja de una ronda: `pairs` parejas barajadas.
 *
 * - Cada carta lleva un `id` único y la `key` de su estímulo: dos cartas son pareja si tienen la misma `key`.
 * - Si la categoría tiene menos elementos que parejas (pbqd, flechas, colores…), los estímulos
 *   se repiten: puede haber 4 cartas "p" y cualquier par de ellas vale.
 * - En palabras, los elementos llegan ordenados de más a menos parecidos y se toman los primeros.
 *
 * @param {{ type: string, pairs: number, settings?: object }} params
 * @returns {Array<{ id: string, key: string, value: any }>}
 */
export function buildDeck({ type, pairs, settings }) {
  const items = getCategoryItems(type, settings)
  if (items.length === 0) return []

  const pool = type === 'words' ? items : shuffle(items)
  const chosen = Array.from({ length: pairs }, (_, i) => pool[i % pool.length])

  const cards = chosen.flatMap((item, i) => [
    { id: `${i}a`, key: item.key, value: item.value },
    { id: `${i}b`, key: item.key, value: item.value },
  ])
  return shuffle(cards)
}

/**
 * Columnas del tablero: 2 filas hasta PAIRS_TWO_ROWS_MAX_CARDS cartas, después 3 filas como mínimo,
 * y como mucho PAIRS_MAX_COLUMNS cartas por fila.
 * 4 → 2×2, 6 → 3×2, 8 → 4×2, 10 → 5×2, 12 → 4×3, 14 → 5+5+4, 16 → 6+6+4 … (última fila centrada).
 */
export function getDeckColumns(cardCount) {
  const minRows = cardCount > PAIRS_TWO_ROWS_MAX_CARDS ? PAIRS_MIN_ROWS + 1 : PAIRS_MIN_ROWS
  const rows = Math.max(minRows, Math.ceil(cardCount / PAIRS_MAX_COLUMNS))
  return Math.ceil(cardCount / rows)
}
