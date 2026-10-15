/**
 * Configuración común de los juegos de memoria y percepción
 * (Memoria Visual, Memoria Secuencial y Taquitoscopio).
 */

import { STIMULUS_OPTIONS } from '../../_shared/data/constants'

// ── Progresión ──
export const LEVEL_UP_STREAK = 2 // Aciertos seguidos para subir de nivel
export const INFINITE_MAX_FAILS = 5 // Fallos seguidos que terminan la sesión en duración "Infinito"

// ── Cuadrícula de respuesta ──
/**
 * Número de opciones según el nivel (N estímulos a recordar). Siempre 2 filas simétricas.
 * Se usa el último escalón cuyo `minLevel` se ha alcanzado.
 */
export const GRID_SIZE_STEPS = [
  { minLevel: 1, options: 8 }, // 4 + 4
  { minLevel: 4, options: 10 }, // 5 + 5
  { minLevel: 6, options: 12 }, // 6 + 6
]
export const MAX_OPTIONS = 12
export const MIN_DISTRACTORS = 3 // Opciones que no son objetivo; por debajo, los objetivos se repiten
export const SINGLE_ROW_MAX = 4 // Categorías pequeñas (pbqd, flechas) en una sola fila

// ── Tiempos de presentación ──
export const FIXATION_MS = 600 // Cruz de fijación previa del Taquitoscopio
export const SEQUENCE_GAP_MS = 250 // Pantalla en blanco entre estímulos de la secuencia

/** Tiempo de exposición simultánea en Memoria Visual (segundos) */
export const EXPOSURE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5]
export const DEFAULT_EXPOSURE = 2.5

/** Tiempo de cada estímulo en Memoria Secuencial (segundos) */
export const SEQUENCE_SPEED_STEPS = [0.5, 0.75, 1, 1.5, 2]
export const DEFAULT_SEQUENCE_SPEED = 1

/** Duración del flash del Taquitoscopio (milisegundos) */
export const FLASH_MS_STEPS = [50, 100, 150, 200, 300, 400, 500]
export const DEFAULT_FLASH_MS = 300

// ── Estímulos y atajos ──
export const DEFAULT_RECALL_STIMULUS = 'colors'

/** Todas las categorías salvo el punto fijo, que no tiene variantes que recordar */
export const RECALL_STIMULUS_OPTIONS = STIMULUS_OPTIONS.filter((opt) => opt.value !== 'classic')

export const RECALL_SHORTCUTS_HINT = 'Responde con el ratón · Siguiente ronda para avanzar'
