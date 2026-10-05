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
