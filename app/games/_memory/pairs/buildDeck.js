/**
 * Baraja y distribución del tablero de Memoria de parejas.
 */

import { shuffle } from '../../_shared/utils/shuffle'
import { getCategoryItems } from '../common/stimulusPool'
import { PAIRS_MAX_COLUMNS, PAIRS_MIN_ROWS } from './constants'

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
 * Columnas del tablero: al menos 2 filas y como mucho PAIRS_MAX_COLUMNS cartas por fila.
 * 4 → 2×2, 6 → 3×2, 8 → 4×2 … 16 → 8×2, 18 → 6×3, 20 → 7+7+6 (última fila centrada).
 */
export function getDeckColumns(cardCount) {
  const rows = Math.max(PAIRS_MIN_ROWS, Math.ceil(cardCount / PAIRS_MAX_COLUMNS))
  return Math.ceil(cardCount / rows)
}
