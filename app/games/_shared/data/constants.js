export const COUNTDOWN_START = 3

export const DURATION_OPTIONS = [
  { value: 0, label: 'Infinito' },
  { value: 30, label: '30 s' },
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 300, label: '5 min' },
]

export const STIMULUS_TYPES = {
  CLASSIC: 'classic',
  COLORS: 'colors',
  LETTERS: 'letters',
  WORDS: 'words',
  ANIMALS: 'animals',
}

export const STIMULUS_OPTIONS = [
  {
    value: 'classic',
    label: 'Punto fijo',
    iconType: 'classic',
    description: 'Estímulo fijo celeste',
  },
  {
    value: 'colors',
    label: 'Colores',
    iconType: 'colors',
    description: 'Cambio dinámico de color',
  },
  {
    value: 'letters',
    label: 'Letras',
    iconType: 'letters',
    description: 'Letras mayúsculas del abecedario',
  },
  {
    value: 'words',
    label: 'Palabras',
    iconType: 'words',
    description: 'Palabras de 3 a 6 letras en mayúscula',
  },
  {
    value: 'animals',
    label: 'Animales',
    iconType: 'animals',
    description: 'Animales ilustrados aleatorios',
  },
]

export const COLOR_INTERVAL_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
]

/**
 * Colores básicos de alto contraste sobre fondo oscuro, excluyendo el negro.
 */
export const BASIC_COLORS = [
  { name: 'Rojo', hex: '#ef4444' },
  { name: 'Azul', hex: '#38bdf8' },
  { name: 'Amarillo', hex: '#facc15' },
  { name: 'Verde', hex: '#22c55e' },
  { name: 'Rosa', hex: '#f472b6' },
  { name: 'Naranja', hex: '#fb923c' },
  { name: 'Morado', hex: '#c084fc' },
  { name: 'Blanco', hex: '#ffffff' },
]

/**
 * Devuelve un color aleatorio de la paleta evitando repetir el color inmediatamente anterior.
 */
export function getRandomColor(prevColor = null, palette = BASIC_COLORS) {
  if (!palette || palette.length === 0) {
    return { name: 'Celeste', hex: '#38bdf8' }
  }
  const pool =
    prevColor && palette.length > 1
      ? palette.filter((c) => c.name !== prevColor.name)
      : palette
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}

export * from './letters'
export * from './words'
export * from './animals'
