/**
 * Configuración de ¿Cuál se repite? (dos tarjetas con un único estímulo en común).
 */

import { STIMULUS_OPTIONS } from '../../_shared/data/constants'

// ── Estímulos ──
export const DEFAULT_WHICH_REPEATS_STIMULUS = 'animals'

/** Punto fijo y flechas no tienen elementos suficientes para dos tarjetas distintas */
const EXCLUDED_STIMULI = ['classic', 'arrows']
export const WHICH_REPEATS_STIMULUS_OPTIONS = STIMULUS_OPTIONS.filter(
  (opt) => !EXCLUDED_STIMULI.includes(opt.value)
)

// ── Progresión ──
export const WHICH_REPEATS_START_COUNT = 3 // Estímulos por tarjeta al empezar; cada acierto suma uno
export const WHICH_REPEATS_MAX_COUNT = 8 // Como las cartas del juego original
export const CARD_SIZE_FACTOR = 7 // Diámetro de tarjeta respecto al tamaño de estímulo (↑ / ↓)
export const CARD_SIZE_STEP = 1.5 // Paso de ↑ / ↓ (× factor ≈ 10 px de tarjeta por pulsación, cambio suave)
/** Separación entre las dos tarjetas (px), ajustable con ← / → durante la partida */
export const CARD_GAP = { initial: 64, min: 16, max: 320, step: 16 }
export const WHICH_REPEATS_INFINITE_MAX_FAILS = 5 // Fallos seguidos que terminan la sesión en duración "Infinito"

// ── Modos de juego ──
export const WHICH_REPEATS_MODES = [
  {
    value: 'normal',
    label: 'Normal',
    description: 'Las dos tarjetas quietas en pantalla',
  },
  {
    value: 'memory',
    label: 'Con memoria',
    description: 'Las tarjetas aparecen y desaparecen a la vez; se puede pulsar aunque estén ocultas',
  },
  {
    value: 'rotating',
    label: 'Girando',
    description: 'Las tarjetas giran sin parar, cada una en un sentido',
  },
]
export const DEFAULT_WHICH_REPEATS_MODE = 'normal'

/** Con memoria: segundos que se ven las tarjetas (ocultas siempre HIDDEN_MS) */
export const VISIBLE_SECONDS_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 5, label: '5 s' },
]
export const DEFAULT_VISIBLE_SECONDS = 2
export const HIDDEN_MS = 1000

/** Girando: segundos por vuelta completa */
export const ROTATION_SPEED_OPTIONS = [
  { value: 20, label: 'Lenta' },
  { value: 12, label: 'Media' },
  { value: 6, label: 'Rápida' },
]
export const DEFAULT_ROTATION_SECONDS = 12

// ── Estímulos dentro de la tarjeta ──
/** Escala al azar de cada estímulo respecto al tamaño base de la tarjeta */
export const ITEM_SCALE = { min: 0.6, max: 1.3 }
/** Hueco libre junto al borde de la tarjeta (fracción del radio) */
export const CARD_EDGE_MARGIN = 0.1

// ── Atajos ──
export const WHICH_REPEATS_SHORTCUTS_HINT = 'Pulsa el estímulo que está en las dos tarjetas · Siguiente ronda para avanzar'
