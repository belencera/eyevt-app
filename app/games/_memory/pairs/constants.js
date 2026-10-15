/**
 * Configuración de Memoria de parejas.
 */

// ── Vista previa (cartas boca arriba al empezar cada ronda) ──
export const PREVIEW_OPTIONS = [
  { value: 0, label: 'Sin vista previa' },
  { value: 3, label: '3 s' },
  { value: 5, label: '5 s' },
  { value: 10, label: '10 s' },
  { value: 15, label: '15 s' },
  { value: 20, label: '20 s' },
]
export const DEFAULT_PREVIEW_SECONDS = 5

// ── Juego ──
export const MISMATCH_MS = 1000 // Tiempo que se ven dos cartas distintas antes de esconderse

/** Parejas por nivel: nivel 1 = 2 parejas (4 cartas), nivel 2 = 3 (6 cartas)… sin tope */
export const getPairsCount = (level) => level + 1

// ── Tablero ──
export const PAIRS_MIN_ROWS = 2
export const PAIRS_MAX_COLUMNS = 8

export const PAIRS_SHORTCUTS_HINT = 'Encuentra las parejas con el ratón · Siguiente ronda para avanzar'
