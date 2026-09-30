/**
 * Configuración modular y utilidades compartidas para estímulos gráficos/ilustraciones
 * (Animales, Frutas y futuras colecciones de imágenes o SVGs).
 */

export const ILLUSTRATION_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
}

export const ILLUSTRATION_SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequeño (48px)' },
  { value: 'md', label: 'Mediano (72px)' },
  { value: 'lg', label: 'Grande (96px)' },
  { value: 'xl', label: 'Muy grande (124px)' },
]

export const ILLUSTRATION_INTERVAL_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
]

/**
 * Devuelve un elemento aleatorio de una lista de ilustraciones
 * evitando repetir consecutivamente el elemento inmediatamente anterior.
 *
 * @param {{ id: string, name: string } | null} prevItem - Elemento anterior
 * @param {Array<{ id: string, name: string, src: string }>} list - Catálogo de ilustraciones
 * @returns {{ id: string, name: string, src: string } | null}
 */
export function getRandomIllustration(prevItem = null, list = []) {
  if (!list || list.length === 0) return null
  const pool =
    prevItem && list.length > 1
      ? list.filter((item) => (item.id || item.name) !== (prevItem.id || prevItem.name))
      : list
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
