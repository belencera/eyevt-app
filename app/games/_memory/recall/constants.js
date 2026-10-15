/**
 * Configuración de los juegos de recuerdo con cuadrícula de respuesta
 * (Memoria Visual, Memoria Secuencial y Taquitoscopio).
 */

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
export const MIN_DISTRACTORS = 3 // Opciones que no son objetivo; por debajo, los objetivos se repiten
export const SINGLE_ROW_MAX = 4 // Categorías pequeñas (pbqd, flechas) en una sola fila

// ── Tiempos de presentación ──
export const FLASH_DELAY_MS = 600 // Pantalla vacía antes del flash del Taquitoscopio (centra la mirada y precarga imágenes)
export const FADE_MS = 200 // Fundido de estímulos y cuadrícula (igual que las transiciones de recall.css)
export const START_DELAY_MS = 400 // Pantalla vacía tras la cuenta atrás, antes del primer estímulo de la sesión
export const RESPONSE_DELAY_MS = 500 // Pantalla vacía tras la presentación, antes de mostrar las respuestas
export const SEQUENCE_GAP_MS = 250 // Pantalla en blanco entre estímulos de la secuencia

// ── Modos de Memoria Visual ──
export const VISUAL_MEMORY_MODES = [
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
export const DEFAULT_VISUAL_MEMORY_MODE = 'center'

/** Zona de la pantalla (en %) donde pueden aparecer los estímulos dispersos: deja libre la barra de nivel */
export const SCATTER_AREA = { minX: 10, maxX: 90, minY: 22, maxY: 85 }
/** Separación mínima (en %) entre estímulos dispersos para que no se solapen */
export const SCATTER_MIN_GAP = { x: 16, y: 20 }

/** Tiempo de exposición simultánea en Memoria Visual (segundos) */
export const EXPOSURE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5]
export const DEFAULT_EXPOSURE = 2.5

/** Tiempo de cada estímulo en Memoria Secuencial (segundos) */
export const SEQUENCE_SPEED_STEPS = [0.5, 0.75, 1, 1.5, 2]
export const DEFAULT_SEQUENCE_SPEED = 1

/** Duración del flash del Taquitoscopio (milisegundos) */
export const FLASH_MS_STEPS = [50, 100, 150, 200, 300, 400, 500]
export const DEFAULT_FLASH_MS = 300
