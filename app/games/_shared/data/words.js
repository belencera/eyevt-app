import { WORD_BANKS } from './wordsBanks'

export { WORD_BANKS } from './wordsBanks'

export const WORD_LENGTH_OPTIONS = [
  { value: 3, label: '3 letras' },
  { value: 4, label: '4 letras' },
  { value: 5, label: '5 letras' },
  { value: 6, label: '6 letras' },
  { value: 'all', label: 'Aleatorio', icon: '🎲' },
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
