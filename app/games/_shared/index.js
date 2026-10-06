/**
 * Barril de exportación principal para el módulo _shared de juegos.
 * Permite importar componentes, hooks y datos de forma centralizada y limpia.
 */

// Componentes de UI y layout
export { GameShell } from './components/GameShell'
export { OptionPicker } from './components/OptionPicker'
export { StimulusGrid } from './components/StimulusGrid'
export { StimulusExtraControls, hasStimulusExtras } from './components/StimulusExtraControls'
export { KeyboardShortcutsBar } from './components/KeyboardShortcutsBar'

// Estímulos visuales
export { StimulusDot } from './stimuli/StimulusDot'
export { StimulusLetter } from './stimuli/StimulusLetter'
export { StimulusWord } from './stimuli/StimulusWord'
export { StimulusNumber } from './stimuli/StimulusNumber'
export { StimulusArrow } from './stimuli/StimulusArrow'
export { StimulusIllustration } from './stimuli/StimulusIllustration'

// Hooks
export { useGameSession } from './hooks/useGameSession'
export { useStimulusManager } from './hooks/useStimulusManager'

// Constantes, opciones y catálogos (incluye animales, frutas, letras, palabras)
export * from './data/constants'

// Utilidades
export { formatTime } from './utils/formatTime'
export { IconPlay, IconPause, IconReset, IconClick, IconTarget } from './utils/icons'
