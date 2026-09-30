/**
 * Configuración y catálogo modular de animales para terapia visual.
 * 28 ilustraciones de alta calidad alojadas en /animals/.
 */

export const ANIMALS_LIST = [
  { id: 'caracol', name: 'Caracol', src: '/animals/1F40C_color.png' },
  { id: 'serpiente', name: 'Serpiente', src: '/animals/1F40D_color.png' },
  { id: 'gallo', name: 'Gallo', src: '/animals/1F413_color.png' },
  { id: 'elefante', name: 'Elefante', src: '/animals/1F418_color.png' },
  { id: 'oruga', name: 'Oruga', src: '/animals/1F41B_color.png' },
  { id: 'abeja', name: 'Abeja', src: '/animals/1F41D_color.png' },
  { id: 'mariquita', name: 'Mariquita', src: '/animals/1F41E_color.png' },
  { id: 'pez', name: 'Pez', src: '/animals/1F420_color.png' },
  { id: 'tortuga', name: 'Tortuga', src: '/animals/1F422_color.png' },
  { id: 'pollito', name: 'Pollito', src: '/animals/1F423_color.png' },
  { id: 'camello', name: 'Camello', src: '/animals/1F42B_color.png' },
  { id: 'tigre', name: 'Tigre', src: '/animals/1F42F_color.png' },
  { id: 'ballena', name: 'Ballena', src: '/animals/1F433_color.png' },
  { id: 'perro', name: 'Perro', src: '/animals/1F436_color.png' },
  { id: 'cerdito', name: 'Cerdito', src: '/animals/1F437_color.png' },
  { id: 'rana', name: 'Rana', src: '/animals/1F438_color.png' },
  { id: 'panda', name: 'Panda', src: '/animals/1F43C_color.png' },
  { id: 'ardilla', name: 'Ardilla', src: '/animals/1F43F_color.png' },
  { id: 'cangrejo', name: 'Cangrejo', src: '/animals/1F980_color.png' },
  { id: 'unicornio', name: 'Unicornio', src: '/animals/1F984_color.png' },
  { id: 'tiburon', name: 'Tiburón', src: '/animals/1F988_color.png' },
  { id: 'gamba', name: 'Gamba', src: '/animals/1F990_color.png' },
  { id: 'dinosaurio', name: 'Dinosaurio', src: '/animals/1F996_color.png' },
  { id: 'loro', name: 'Loro', src: '/animals/1F99C_color.png' },
  { id: 'flamenco', name: 'Flamenco', src: '/animals/1F9A9_color.png' },
  { id: 'medusa', name: 'Medusa', src: '/animals/1FABC_color.png' },
  { id: 'ganso', name: 'Ganso', src: '/animals/1FABF_color.png' },
  { id: 'orca', name: 'Orca', src: '/animals/1FACD_color.png' },
]

export const ANIMAL_SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequeño (48px)' },
  { value: 'md', label: 'Mediano (72px)' },
  { value: 'lg', label: 'Grande (96px)' },
  { value: 'xl', label: 'Muy grande (124px)' },
]

export const ANIMAL_INTERVAL_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
]

/**
 * Devuelve un animal aleatorio del catálogo, evitando repetir inmediatamente el anterior.
 */
export function getRandomAnimal(prevAnimal = null, list = ANIMALS_LIST) {
  if (!list || list.length === 0) return null
  const pool =
    prevAnimal && list.length > 1
      ? list.filter((a) => a.id !== prevAnimal.id)
      : list
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
