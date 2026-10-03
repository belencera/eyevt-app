/**
 * Configuración y utilidades modulares para el estímulo de letras sueltas.
 * Abecedario completo en mayúsculas para terapia visual.
 */

export const UPPERCASE_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
]

export const LETTER_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
}

export const LETTER_SIZE_OPTIONS = [
  { value: 'xs', label: 'Muy pequeña' },
  { value: 'sm', label: 'Pequeña' },
  { value: 'md', label: 'Mediana' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Muy grande' },
]

export const LETTER_INTERVAL_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
]

/**
 * Devuelve una letra aleatoria del abecedario en mayúscula,
 * evitando repetir la letra inmediatamente anterior si hay más de una disponible.
 */
export function getRandomLetter(prevLetter = null, alphabet = UPPERCASE_ALPHABET) {
  if (!alphabet || alphabet.length === 0) return 'A'
  const pool =
    prevLetter && alphabet.length > 1
      ? alphabet.filter((l) => l !== prevLetter)
      : alphabet
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
