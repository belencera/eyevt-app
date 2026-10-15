/**
 * Barril de exportación de la familia de juegos de memoria.
 *
 * - common/: piezas comunes a todos los juegos de memoria
 * - recall/: juegos con cuadrícula de respuesta (Memoria Visual, Secuencial y Taquitoscopio)
 * - pairs/: Memoria de parejas
 */

// ── Común ──
export * from './common/constants'
export { getCategoryItems } from './common/stimulusPool'
export { preloadImages } from './common/preloadImages'
export { LevelStatus } from './common/LevelStatus'

// ── Recall: Memoria Visual, Secuencial y Taquitoscopio ──
export * from './recall/constants'
export { buildRecallRound, getOptionsCount, getGridColumns } from './recall/buildRound'
export { evaluateAnswer } from './recall/evaluateAnswer'
export { useRecallGame } from './recall/useRecallGame'
export { RecallPresentation } from './recall/RecallPresentation'
export { ResponseGrid } from './recall/ResponseGrid'

// ── Pairs: Memoria de parejas ──
export * from './pairs/constants'
export { buildDeck, getDeckColumns } from './pairs/buildDeck'
