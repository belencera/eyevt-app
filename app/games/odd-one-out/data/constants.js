/**
 * Configuración de Encuentra el diferente (discriminación visual).
 */

import { STIMULUS_OPTIONS } from '../../_shared/data/constants'

// ── Estímulos ──
/** Punto fijo, flechas y colores no tienen detalles que discriminar */
const EXCLUDED_STIMULI = ['classic', 'arrows', 'colors']
export const ODD_ONE_STIMULUS_OPTIONS = STIMULUS_OPTIONS.filter((opt) => !EXCLUDED_STIMULI.includes(opt.value))

/** Por defecto, la primera categoría de la lista (Números) */
export const DEFAULT_ODD_ONE_STIMULUS = ODD_ONE_STIMULUS_OPTIONS[0].value

// ── Progresión ──
export const ODD_ONE_START_COUNT = 3 // Estímulos de la primera pantalla; cada acierto suma uno, sin tope
export const ODD_ONE_SIZE_FACTOR = 2 // Estímulos más grandes que en otros juegos para distinguir los detalles
export const ODD_ONE_SIZE_STEP = 2 // Paso de ↑ / ↓ (× factor = 4 px por pulsación, cambio suave)
export const ODD_ONE_INFINITE_MAX_FAILS = 5 // Fallos seguidos que terminan la sesión en duración "Infinito"

// ── Detalle eliminado en ilustraciones ──
/**
 * Proporción del dibujo que puede cambiar al quitar una pieza: visible pero poco perceptible
 * (un ojo, una rueda, un brillo). Ni piezas tapadas (0 %) ni piezas grandes como el cuerpo.
 */
export const DETAIL_MIN_RATIO = 0.01
export const DETAIL_MAX_RATIO = 0.05

// ── Diferencias en letras, palabras y números ──
/** Letras mayúsculas que se confunden visualmente (Letras y Palabras) */
export const SIMILAR_LETTERS = {
  B: ['R', 'D', 'P'],
  C: ['G', 'O'],
  D: ['O', 'B'],
  E: ['F'],
  F: ['E', 'P'],
  G: ['C'],
  H: ['N'],
  I: ['L'],
  K: ['X'],
  L: ['I'],
  M: ['N', 'W'],
  N: ['M', 'H'],
  O: ['Q', 'D', 'C'],
  P: ['R', 'F', 'B'],
  Q: ['O'],
  R: ['P', 'B'],
  T: ['I', 'Y'],
  U: ['V'],
  V: ['U'],
  W: ['M', 'V'],
  X: ['K', 'Y'],
  Y: ['V', 'X'],
}

/** Cifras que se confunden visualmente */
export const SIMILAR_DIGITS = {
  0: ['8', '6', '9'],
  1: ['7', '4'],
  2: ['7', '5'],
  3: ['8', '5'],
  4: ['1', '9'],
  5: ['6', '3', '2'],
  6: ['8', '5', '0', '9'],
  7: ['1', '2'],
  8: ['3', '6', '0', '9'],
  9: ['6', '8', '4', '0'],
}

// ── Atajos ──
export const ODD_ONE_SHORTCUTS_HINT = 'Pulsa el estímulo diferente · Siguiente ronda para avanzar'
