/**
 * Configuración modular y utilidades para el juego de Periferia.
 */

export const PERIPHERY_MODES = [
  {
    value: 'name-and-tap',
    label: 'Nombra y Pulsa',
    description: 'El centro cambia para decir en voz alta y pulsas puntos alrededor',
    icon: 'click',
  },
  {
    value: 'central-focus',
    label: 'Foco Central',
    description: 'Fija la mirada en el centro e identifica lo que sale en la periferia',
    icon: 'target',
  },
]

export const DISTANCE_OPTIONS = [
  { value: 'close', label: 'Cercana' },
  { value: 'medium', label: 'Media' },
  { value: 'far', label: 'Lejana' },
  { value: 'random', label: 'Aleatoria' },
]

export const DIFFICULTY_OPTIONS = DISTANCE_OPTIONS
export const ECCENTRICITY_OPTIONS = DISTANCE_OPTIONS

export const PERIPHERY_CADENCE_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
]

/**
 * Calcula una posición porcentual aleatoria (x, y) en el campo periférico
 * con respecto al centro (50%, 50%), según la excentricidad seleccionada.
 *
 * @param {'close'|'medium'|'far'|'random'} eccentricity
 * @returns {{ x: number, y: number }}
 */
export function getRandomPeripheralPosition(eccentricity = 'random') {
  let mode = eccentricity
  if (mode === 'random') {
    const choices = ['close', 'medium', 'far']
    mode = choices[Math.floor(Math.random() * choices.length)]
  }

  let minRadius = 14
  let maxRadius = 22

  if (mode === 'medium') {
    minRadius = 24
    maxRadius = 33
  } else if (mode === 'far') {
    minRadius = 35
    maxRadius = 42
  }

  const radius = minRadius + Math.random() * (maxRadius - minRadius)
  const angle = Math.random() * Math.PI * 2

  // Corrección elíptica adaptada a pantallas panorámicas (aspect-ratio horizontal)
  const x = Math.round(50 + Math.cos(angle) * radius * 1.15)
  const y = Math.round(50 + Math.sin(angle) * radius * 0.95)

  // Límites seguros para que nunca se solape con el centro ni se corte en los bordes
  const clampedX = Math.max(8, Math.min(92, x))
  const clampedY = Math.max(10, Math.min(90, y))

  return { x: clampedX, y: clampedY }
}
