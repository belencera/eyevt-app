/**
 * Barril de exportación de la familia de juegos de memoria y percepción
 * (Memoria Visual, Memoria Secuencial y Taquitoscopio).
 */

// Constantes y generación de rondas
export * from './data/recallConstants'
export { getCategoryItems, getOptionsCount, getGridColumns, buildRecallRound } from './data/stimulusPool'

// Componentes
export { LevelStatus } from './components/LevelStatus'
export { RecallPresentation } from './components/RecallPresentation'
export { ResponseGrid } from './components/ResponseGrid'
