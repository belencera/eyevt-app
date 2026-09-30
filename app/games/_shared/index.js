/**
 * Barril de exportación principal para el módulo _shared de juegos.
 * Permite importar componentes, hooks y datos de forma centralizada y limpia.
 */

// Componentes de UI y layout
export { GameShell } from './components/GameShell'
export { OptionPicker } from './components/OptionPicker'
export { StimulusGrid } from './components/StimulusGrid'
export { TherapistBadge } from './components/TherapistBadge'

// Estímulos visuales
export { StimulusDot } from './stimuli/StimulusDot'
export { StimulusLetter } from './stimuli/StimulusLetter'
export { StimulusWord } from './stimuli/StimulusWord'
export { StimulusAnimal } from './stimuli/StimulusAnimal'

// Hooks
export { useGameSession } from './hooks/useGameSession'
export { useStimulusManager } from './hooks/useStimulusManager'

// Constantes, opciones y catálogos
export * from './data/constants'

// Utilidades
export { formatTime } from './utils/formatTime'
export { IconPlay, IconPause, IconReset } from './utils/icons'
