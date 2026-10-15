'use client'

import { useCallback, useRef, useState } from 'react'

const createInitialState = (minLevel) => ({
  level: minLevel,
  streak: 0, // Aciertos seguidos acumulados para subir al siguiente nivel
  run: 0, // Aciertos consecutivos totales (no se reinicia al subir de nivel)
  stats: {
    maxLevel: minLevel,
    total: 0,
    correct: 0,
    maxStreak: 0,
    consecutiveFails: 0,
  },
})

/**
 * Calcula el estado de progresión tras el resultado de una ronda (función pura).
 *
 * - `upAfter` aciertos seguidos → sube un nivel (y la racha de nivel vuelve a 0)
 * - Fallo llevando algún acierto en el nivel → se queda en el nivel y resetea la racha
 * - Fallo sin aciertos en el nivel (primera ronda del nivel o tras otro fallo) → baja un nivel (mínimo `minLevel`)
 */
export function applyRoundResult(prev, isCorrect, { upAfter = 2, minLevel = 1, maxLevel = Infinity } = {}) {
  const total = prev.stats.total + 1

  if (isCorrect) {
    const run = prev.run + 1
    const reachedStreak = prev.streak + 1 >= upAfter
    const level = reachedStreak ? Math.min(prev.level + 1, maxLevel) : prev.level

    return {
      level,
      streak: reachedStreak ? 0 : prev.streak + 1,
      run,
      stats: {
        maxLevel: Math.max(prev.stats.maxLevel, level),
        total,
        correct: prev.stats.correct + 1,
        maxStreak: Math.max(prev.stats.maxStreak, run),
        consecutiveFails: 0,
      },
    }
  }

  return {
    level: prev.streak > 0 ? prev.level : Math.max(prev.level - 1, minLevel),
    streak: 0,
    run: 0,
    stats: {
      ...prev.stats,
      total,
      consecutiveFails: prev.stats.consecutiveFails + 1,
    },
  }
}

/**
 * Progresión clínica adaptativa por rondas (reglas en `applyRoundResult`).
 *
 * `register(isCorrect)` devuelve el estado actualizado de forma síncrona,
 * útil para decidir en el momento (ej: terminar tras N fallos consecutivos).
 *
 * @param {{ upAfter?: number, minLevel?: number, maxLevel?: number }} [options]
 */
export function useAdaptiveLevel({ upAfter = 2, minLevel = 1, maxLevel = Infinity } = {}) {
  const [state, setState] = useState(() => createInitialState(minLevel))
  const stateRef = useRef(state)

  const commit = useCallback((next) => {
    stateRef.current = next
    setState(next)
    return next
  }, [])

  const register = useCallback(
    (isCorrect) =>
      commit(applyRoundResult(stateRef.current, isCorrect, { upAfter, minLevel, maxLevel })),
    [commit, upAfter, minLevel, maxLevel]
  )

  const reset = useCallback(() => {
    commit(createInitialState(minLevel))
  }, [commit, minLevel])

  return {
    level: state.level,
    streak: state.streak,
    upAfter,
    stats: state.stats,
    register,
    reset,
  }
}
