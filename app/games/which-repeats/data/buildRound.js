/**
 * Construcción de una ronda de ¿Cuál se repite?: dos tarjetas de N estímulos con exactamente uno en común.
 */

import { shuffle } from '../../_shared/utils/shuffle'
import { CARD_EDGE_MARGIN, ITEM_SCALE } from './constants'
import { getDistinctItems } from './categoryItems'

const randomBetween = (min, max) => min + Math.random() * (max - min)

/**
 * Hueco de la tarjeta (en radios, R = 1) para `count` estímulos sin solaparse:
 * hasta 4 en un anillo; desde 5, uno en el centro y el resto en el anillo.
 * Devuelve el radio del anillo y el tamaño máximo de cada estímulo (diámetro de su caja).
 */
export function getCardSlots(count) {
  const hasCenter = count >= 5
  const ringCount = hasCenter ? count - 1 : count
  const limit = 1 - CARD_EDGE_MARGIN
  let best = { ring: 0, size: 0 }

  // Se prueba el radio del anillo y se queda el que deja estímulos más grandes
  for (let ring = 0.05; ring < limit; ring += 0.01) {
    const neighborGap = ringCount > 1 ? 2 * ring * Math.sin(Math.PI / ringCount) : Infinity
    const size = Math.min(
      neighborGap, // Entre vecinos del anillo
      hasCenter ? ring : Infinity, // Entre el centro y el anillo
      2 * (limit - ring), // Dentro del borde
      ringCount === 1 ? 2 * limit : Infinity
    )
    if (size > best.size) best = { ring, size }
  }
  return { ...best, hasCenter, ringCount }
}

/**
 * Coloca los estímulos de una tarjeta. Cada uno lleva su posición (% de la tarjeta),
 * su tamaño (% del diámetro), una escala y un giro al azar. La escala nunca supera el hueco,
 * así que no se solapan.
 */
export function layoutCard(items) {
  const { ring, size, hasCenter, ringCount } = getCardSlots(items.length)
  const baseSize = size / ITEM_SCALE.max // Tamaño a escala 1: con la escala máxima llena el hueco
  const offset = Math.random() * Math.PI * 2 // Anillo girado al azar en cada tarjeta

  return items.map((item, index) => {
    const isCenter = hasCenter && index === 0
    const angle = offset + ((isCenter ? 0 : index - (hasCenter ? 1 : 0)) / ringCount) * Math.PI * 2
    const distance = isCenter ? 0 : ring
    const scale = randomBetween(ITEM_SCALE.min, ITEM_SCALE.max)

    return {
      ...item,
      x: 50 + Math.cos(angle) * distance * 50,
      y: 50 + Math.sin(angle) * distance * 50,
      size: baseSize * scale * 50, // % del diámetro de la tarjeta
      rotation: Math.round(Math.random() * 360),
    }
  })
}

/** Estímulos por tarjeta que caben con `available` elementos distintos (2·N − 1) */
export const getMaxCount = (available) => Math.floor((available + 1) / 2)

/**
 * @param {{ type: string, count: number, settings?: object, prevCommonKey?: string|null }} params
 * @returns {{ count: number, commonKey: string, cards: Array<Array<{ key, value, x, y, size, rotation }>> } | null}
 *   count puede ser menor que el pedido en categorías pequeñas; null si no hay ni 2 elementos
 */
export function buildWhichRepeatsRound({ type, count, settings = {}, prevCommonKey = null }) {
  // Uno de sobra para poder evitar que el común repita el de la ronda anterior
  const pool = getDistinctItems(type, 2 * count, settings)
  const roundCount = Math.min(count, getMaxCount(pool.length))
  if (roundCount < 2) return null

  const common = pool.find((item) => item.key !== prevCommonKey) ?? pool[0]
  const others = pool.filter((item) => item !== common)
  const ownCount = roundCount - 1

  const cards = [others.slice(0, ownCount), others.slice(ownCount, ownCount * 2)].map((own) =>
    layoutCard(shuffle([common, ...own]))
  )

  return { count: roundCount, commonKey: common.key, cards }
}
