/**
 * Configuración y utilidades modulares para el estímulo de letras sueltas.
 * Abecedario completo en mayúsculas para terapia visual.
 */

export const UPPERCASE_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
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

export const PBQD_LETTERS = ['p', 'b', 'q', 'd']

export const PBQD_LENGTH_OPTIONS = [
  { value: 1, label: '1 letra' },
  { value: 2, label: '2 letras' },
  { value: 3, label: '3 letras' },
  { value: 4, label: '4 letras' },
  { value: 'all', label: 'Aleatorio' },
]

const PBQD_LENGTHS = [1, 2, 3, 4]

/** Cantidad de letras: con 'Aleatorio' se elige una (1 a 4) */
export function resolvePbqdLength(length) {
  return PBQD_LENGTHS.includes(length)
    ? length
    : PBQD_LENGTHS[Math.floor(Math.random() * PBQD_LENGTHS.length)]
}

/**
 * Todas las combinaciones de `length` letras pbqd distintas entre sí
 * (1 → p, b, q, d · 2 → pb, bq, dq… (12) · 3 → pdb, dqb… (24) · 4 → pbqd, dqbp… (24)).
 */
export function getPbqdCombinations(length = 1) {
  if (length <= 1) return [...PBQD_LETTERS]
  return getPbqdCombinations(length - 1).flatMap((prefix) =>
    PBQD_LETTERS.filter((letter) => !prefix.includes(letter)).map((letter) => prefix + letter)
  )
}

/**
 * Devuelve una combinación pbqd aleatoria en minúscula de 1 a 4 letras ('all' = aleatorio),
 * evitando repetir la inmediatamente anterior si es posible.
 */
export function getRandomPbqd(prevLetter = null, length = 1) {
  return getRandomLetter(prevLetter, getPbqdCombinations(resolvePbqdLength(length)))
}
