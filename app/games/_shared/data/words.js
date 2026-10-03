import { WORD_BANKS } from './wordsBanks'

export { WORD_BANKS } from './wordsBanks'

export const WORD_SIZE_OPTIONS = [
  { value: 'xs', label: 'Muy pequeña' },
  { value: 'sm', label: 'Pequeña' },
  { value: 'md', label: 'Mediana' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Muy grande' },
]

export const WORD_LENGTH_OPTIONS = [
  { value: 3, label: '3 letras' },
  { value: 4, label: '4 letras' },
  { value: 5, label: '5 letras' },
  { value: 6, label: '6 letras' },
  { value: 'all', label: 'Aleatorio', icon: '🎲' },
]

export const WORD_INTERVAL_OPTIONS = [
  { value: 1, label: '1 s' },
  { value: 2, label: '2 s' },
  { value: 3, label: '3 s' },
  { value: 4, label: '4 s' },
  { value: 5, label: '5 s' },
]

/**
 * Devuelve una palabra aleatoria en mayúsculas según la longitud indicada (3, 4, 5, 6 o 'all'),
 * evitando repetir consecutivamente la palabra anterior.
 */
export function getRandomWord(length = 4, prevWord = null) {
  let targetLen = length
  if (targetLen === 'all' || !WORD_BANKS[targetLen]) {
    const validLengths = [3, 4, 5, 6]
    targetLen = validLengths[Math.floor(Math.random() * validLengths.length)]
  }

  const bank = WORD_BANKS[targetLen] || WORD_BANKS[4]
  const pool =
    prevWord && bank.length > 1
      ? bank.filter((w) => w !== prevWord)
      : bank
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
