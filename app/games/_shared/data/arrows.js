/**
 * Configuración y utilidades modulares para el estímulo de flechas direccionales.
 * 4 direcciones cardinales (Arriba, Abajo, Izquierda, Derecha).
 */

export const ARROW_DIRECTIONS = [
  { id: 'up', name: 'Arriba', angle: 0, symbol: '↑' },
  { id: 'right', name: 'Derecha', angle: 90, symbol: '→' },
  { id: 'down', name: 'Abajo', angle: 180, symbol: '↓' },
  { id: 'left', name: 'Izquierda', angle: 270, symbol: '←' },
]

/**
 * Devuelve una flecha aleatoria de las 4 direcciones,
 * evitando repetir consecutivamente la dirección anterior.
 *
 * @param {{ id: string, name: string, angle: number } | null} prevArrow
 * @param {Array<{ id: string, name: string, angle: number, symbol: string }>} list
 * @returns {{ id: string, name: string, angle: number, symbol: string }}
 */
export function getRandomArrow(prevArrow = null, list = ARROW_DIRECTIONS) {
  if (!list || list.length === 0) return ARROW_DIRECTIONS[0]
  const pool =
    prevArrow && list.length > 1
      ? list.filter((a) => a.id !== prevArrow.id)
      : list
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
