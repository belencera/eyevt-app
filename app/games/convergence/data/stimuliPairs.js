import { SIMULTANEOUS_PERCEPTION_PAIRS } from './simultaneousPerception'
import { FLAT_FUSION_PAIRS } from './flatFusion'

export { SIMULTANEOUS_PERCEPTION_PAIRS } from './simultaneousPerception'
export { FLAT_FUSION_PAIRS } from './flatFusion'

export const STIMULI_CATEGORIES = [
  { id: 'percepcion-simultanea', label: 'Percepción simultánea' },
  { id: 'fusion-plana', label: 'Fusión plana' },
  { id: 'estereopsis', label: 'Estereopsis' },
]

/**
 * Catálogo completo de parejas de estímulos para convergencia.
 * Agrupa los módulos especializados por grado de visión binocular.
 */
export const STIMULI_PAIRS = [
  ...SIMULTANEOUS_PERCEPTION_PAIRS,
  ...FLAT_FUSION_PAIRS,
]

export const CONVERGENCE_MODES = [
  {
    value: 'fixed',
    label: 'Fijo',
    description: 'Distancia constante entre estímulos',
    icon: 'fixed',
  },
  {
    value: 'motion',
    label: 'En movimiento',
    description: 'Los estímulos se separan lentamente',
    icon: 'motion',
  },
]

export const INITIAL_DISTANCE_OPTIONS = [
  { value: 60, label: '60 px' },
  { value: 100, label: '100 px' },
  { value: 140, label: '140 px' },
  { value: 180, label: '180 px' },
  { value: 240, label: '240 px' },
  { value: 300, label: '300 px' },
]

export const SPEED_OPTIONS = [
  { value: 2, label: 'Muy lento' },
  { value: 4, label: 'Lento' },
  { value: 8, label: 'Medio' },
  { value: 14, label: 'Rápido' },
  { value: 20, label: 'Muy rápido' },
]

export const STIMULUS_SIZE_PX = {
  sm: 52,
  md: 76,
  lg: 104,
  xl: 132,
}

export const STIMULUS_SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequeño' },
  { value: 'md', label: 'Mediano' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Muy grande' },
]
