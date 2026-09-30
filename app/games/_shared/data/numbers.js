/**
 * Configuración y utilidades modulares para el estímulo de números.
 * Soporta de 1 a 5 cifras y modo mixto, con selección de tamaño e intervalo.
 */

export const NUMBER_SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequeño (26px)' },
  { value: 'md', label: 'Mediano (38px)' },
  { value: 'lg', label: 'Grande (54px)' },
  { value: 'xl', label: 'Muy grande (74px)' },
]

export const NUMBER_DIGITS_OPTIONS = [
  { value: 1, label: '1 cifra' },
  { value: 2, label: '2 cifras' },
  { value: 3, label: '3 cifras' },
  { value: 4, label: '4 cifras' },
  { value: 5, label: '5 cifras' },
  { value: 'all', label: 'Mixto (1 a 5)' },
]

export const NUMBER_INTERVAL_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
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
