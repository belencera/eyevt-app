/**
 * Posiciones aleatorias en pantalla para el modo "Posiciones aleatorias" de Memoria Visual.
 */

import { SCATTER_AREA, SCATTER_MIN_GAP } from './constants'

const randomBetween = (min, max) => min + Math.random() * (max - min)

const overlaps = (a, b, gap) => Math.abs(a.x - b.x) < gap.x && Math.abs(a.y - b.y) < gap.y

/**
 * Devuelve `count` posiciones porcentuales { x, y } repartidas por la pantalla sin solaparse.
 * Si no caben con la separación mínima (niveles altos), se reduce poco a poco la separación.
 */
export function getScatteredPositions(count) {
  let gap = { ...SCATTER_MIN_GAP }

  for (let relax = 0; relax < 6; relax++) {
    const positions = []
    let attempts = 0

    while (positions.length < count && attempts < 400) {
      const candidate = {
        x: Math.round(randomBetween(SCATTER_AREA.minX, SCATTER_AREA.maxX)),
        y: Math.round(randomBetween(SCATTER_AREA.minY, SCATTER_AREA.maxY)),
      }
      if (!positions.some((p) => overlaps(p, candidate, gap))) positions.push(candidate)
      attempts++
    }

    if (positions.length === count) return positions
    gap = { x: gap.x * 0.8, y: gap.y * 0.8 }
  }

  // Último recurso: posiciones sin comprobar solapes
  return Array.from({ length: count }, () => ({
    x: Math.round(randomBetween(SCATTER_AREA.minX, SCATTER_AREA.maxX)),
    y: Math.round(randomBetween(SCATTER_AREA.minY, SCATTER_AREA.maxY)),
  }))
}
