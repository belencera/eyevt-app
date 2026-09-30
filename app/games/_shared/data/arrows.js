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

export const ARROW_SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequeña' },
  { value: 'md', label: 'Mediana' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Muy grande' },
]

export const ARROW_INTERVAL_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
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
