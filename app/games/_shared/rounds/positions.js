/**
 * Disposición de los estímulos en pantalla: juntos en el centro o en posiciones aleatorias.
 */

export const POSITION_MODES = [
  {
    value: 'center',
    label: 'Centro',
    description: 'Los estímulos aparecen juntos en el centro de la pantalla',
  },
  {
    value: 'scattered',
    label: 'Posiciones aleatorias',
    description: 'Cada estímulo aparece en una zona aleatoria de la pantalla',
  },
]
export const DEFAULT_POSITION_MODE = 'center'

/** Zona de la pantalla (en %) donde pueden aparecer los estímulos dispersos: deja libre la barra de nivel */
export const SCATTER_AREA = { minX: 10, maxX: 90, minY: 22, maxY: 85 }
/** Separación mínima (en %) entre estímulos dispersos para que no se solapen */
export const SCATTER_MIN_GAP = { x: 16, y: 20 }

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
