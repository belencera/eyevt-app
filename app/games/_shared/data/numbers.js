/**
 * Configuración y utilidades modulares para el estímulo de números.
 * Soporta de 1 a 5 cifras y modo mixto.
 */

export const NUMBER_DIGITS_OPTIONS = [
  { value: 1, label: '1 cifra' },
  { value: 2, label: '2 cifras' },
  { value: 3, label: '3 cifras' },
  { value: 4, label: '4 cifras' },
  { value: 5, label: '5 cifras' },
  { value: 'all', label: 'Aleatorio', icon: '🎲' },
]

/**
 * Devuelve un número aleatorio según la cantidad de cifras solicitada (1, 2, 3, 4, 5 o 'all'),
 * evitando repetir consecutivamente el número inmediatamente anterior.
 *
 * @param {number|'all'} digits - Número de cifras (1 a 5 o 'all')
 * @param {string|null} prevNumber - Número anterior
 * @returns {string}
 */
export function getRandomNumber(digits = 1, prevNumber = null) {
  let d = digits
  if (d === 'all' || typeof d !== 'number' || d < 1 || d > 5) {
    d = Math.floor(Math.random() * 5) + 1
  }

  const min = d === 1 ? 0 : Math.pow(10, d - 1)
  const max = Math.pow(10, d) - 1

  let result
  let attempts = 0
  do {
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    result = String(num)
    attempts++
  } while (result === prevNumber && attempts < 10)

  return result
}
