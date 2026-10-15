/**
 * Barril de exportación principal para el módulo _shared de juegos.
 * Permite importar componentes, hooks y datos de forma centralizada y limpia.
 */

// Componentes de UI y layout
export { GameShell } from './components/GameShell'
export { OptionPicker } from './components/OptionPicker'
export { ModeSelector } from './components/ModeSelector'
export { StimulusGrid } from './components/StimulusGrid'
export { StimulusExtraControls } from './components/StimulusExtraControls'
export { KeyboardShortcutsBar } from './components/KeyboardShortcutsBar'
export { SessionSummary } from './components/SessionSummary'

// Estímulos visuales
export { StimulusDot } from './stimuli/StimulusDot'
export { StimulusItem } from './stimuli/StimulusItem'
export { StimulusLetter } from './stimuli/StimulusLetter'
export { StimulusWord } from './stimuli/StimulusWord'
export { StimulusNumber } from './stimuli/StimulusNumber'
export { StimulusArrow } from './stimuli/StimulusArrow'
export { StimulusIllustration } from './stimuli/StimulusIllustration'

// Hooks
export { useGameSession } from './hooks/useGameSession'
export { useStimulusManager } from './hooks/useStimulusManager'
export { useTimers } from './hooks/useTimers'
export { useAdaptiveLevel } from './hooks/useAdaptiveLevel'

// Constantes, opciones y catálogos (incluye animales, frutas, letras, palabras)
export * from './data/constants'

// Juegos por rondas con nivel (memoria y discriminación)
export * from './rounds'

// Utilidades
export { formatTime } from './utils/formatTime'
export { shuffle } from './utils/shuffle'
export { pickRandom } from './utils/random'
export { IconPlay, IconPause, IconReset, IconClick, IconTarget, IconRandom } from './utils/icons'
