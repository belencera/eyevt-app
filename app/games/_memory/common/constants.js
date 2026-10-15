/**
 * Configuración común a todos los juegos de memoria
 * (Memoria Visual, Memoria Secuencial, Taquitoscopio y Memoria de parejas).
 */

import { STIMULUS_OPTIONS } from '../../_shared/data/constants'

// ── Estímulos ──
export const DEFAULT_MEMORY_STIMULUS = 'colors'

/** Todas las categorías salvo el punto fijo, que no tiene variantes que recordar */
export const MEMORY_STIMULUS_OPTIONS = STIMULUS_OPTIONS.filter((opt) => opt.value !== 'classic')

/** Elementos parecidos que se generan por ronda en palabras y números */
export const MAX_OPTIONS = 12

// ── Atajos ──
export const MEMORY_SHORTCUTS_HINT = 'Responde con el ratón · Siguiente ronda para avanzar'
