export const COUNTDOWN_START = 3

/** Pasos unificados de cadencia/tiempo en segundos para Fijación, Periferia y Sacádicos */
export const CADENCE_STEPS = [0.3, 0.7, 1, 2, 3, 4, 5]

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
  NUMBERS: 'numbers',
  ARROWS: 'arrows',
  ANIMALS: 'animals',
  FRUITS: 'fruits',
  FOOD: 'food',
  EMOJIS: 'emojis',
  VEHICLES: 'vehicles',
  OBJECTS: 'objects',
  NATURE: 'nature',
  FLAGS: 'flags',
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
    value: 'numbers',
    label: 'Números',
    iconType: 'numbers',
    description: 'Cifras numéricas aleatorias (1 a 5 cifras)',
  },
  {
    value: 'arrows',
    label: 'Flechas',
    iconType: 'arrows',
    description: 'Flechas cardinales en 4 direcciones',
  },
  {
    value: 'animals',
    label: 'Animales',
    iconType: 'animals',
    description: 'Animales ilustrados aleatorios',
  },
  {
    value: 'fruits',
    label: 'Frutas',
    iconType: 'fruits',
    description: 'Frutas ilustradas aleatorias',
  },
  {
    value: 'food',
    label: 'Comida',
    iconType: 'food',
    description: 'Alimentos y comida ilustrada aleatoria',
  },
  {
    value: 'emojis',
    label: 'Emojis',
    iconType: 'emojis',
    description: 'Caras de emoji ilustradas aleatorias',
  },
  {
    value: 'vehicles',
    label: 'Vehículos',
    iconType: 'vehicles',
    description: 'Vehículos y medios de transporte ilustrados aleatorios',
  },
  {
    value: 'objects',
    label: 'Objetos',
    iconType: 'objects',
    description: 'Objetos cotidianos ilustrados aleatorios',
  },
  {
    value: 'nature',
    label: 'Naturaleza',
    iconType: 'nature',
    description: 'Elementos de la naturaleza ilustrados aleatorios',
  },
  {
    value: 'flags',
    label: 'Banderas',
    iconType: 'flags',
    description: 'Banderas de países ilustradas aleatorias',
  },
]

export const CHANGE_INTERVAL_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
]

export const STIMULUS_SIZE_PRESETS = {
  xs: 20,
  sm: 32,
  md: 48,
  lg: 72,
  xl: 100,
}

export const STIMULUS_SIZE_OPTIONS = [
  { value: 'xs', label: 'Muy pequeño' },
  { value: 'sm', label: 'Pequeño' },
  { value: 'md', label: 'Mediano' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Muy grande' },
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
export * from './numbers'
export * from './arrows'
export * from './animals'
export * from './fruits'
export * from './food'
export * from './emojis'
export * from './vehicles'
export * from './objects'
export * from './nature'
export * from './flags'
export * from './illustrationsRegistry'
export * from './periphery'
