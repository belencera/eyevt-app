/**
 * Corrección de respuestas de los juegos de memoria y percepción.
 */

/**
 * Corrige una respuesta y devuelve el resultado global y el estado de cada tarjeta.
 *
 * - ordered: coincidencia exacta posición a posición (Memoria Secuencial)
 * - sin orden: mismos elementos y mismas veces, en cualquier orden (multiconjunto)
 *
 * Estado por tarjeta: 'correct' (bien), 'wrong' (sobra o fuera de sitio), 'missed' (faltó pulsarla)
 */
export function evaluateAnswer(targetKeys, selection, ordered) {
  const results = {}

  if (ordered) {
    selection.forEach((key, index) => {
      const ok = targetKeys[index] === key
      results[key] = results[key] === 'wrong' || !ok ? 'wrong' : 'correct'
    })
    targetKeys.forEach((key) => {
      if (!results[key]) results[key] = 'missed'
    })
    const isCorrect = selection.every((key, index) => targetKeys[index] === key)
    return { isCorrect, results }
  }

  const count = (list) =>
    list.reduce((acc, key) => ({ ...acc, [key]: (acc[key] ?? 0) + 1 }), {})
  const targetCount = count(targetKeys)
  const selectedCount = count(selection)
  const keys = new Set([...targetKeys, ...selection])

  let isCorrect = true
  keys.forEach((key) => {
    const expected = targetCount[key] ?? 0
    const chosen = selectedCount[key] ?? 0
    if (expected !== chosen) isCorrect = false

    if (chosen > expected) results[key] = 'wrong'
    else if (chosen < expected) results[key] = 'missed'
    else results[key] = 'correct'
  })

  return { isCorrect, results }
}
