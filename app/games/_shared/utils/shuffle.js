/**
 * Devuelve una copia barajada del array (algoritmo Fisher–Yates).
 * No modifica el array original.
 */
export function shuffle(list) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
